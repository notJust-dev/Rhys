import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { createSupabaseClient } from "../_shared/supabase.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!OPENAI_API_KEY) {
    return new Response("OPENAI_API_KEY is not set", { status: 500 });
  }

  const { chatId, messages } = await req.json();

  if (!chatId || typeof chatId !== "string") {
    return new Response("Missing chatId", { status: 400 });
  }
  if (!messages || !Array.isArray(messages)) {
    return new Response("Missing messages array", { status: 400 });
  }

  const supabase = createSupabaseClient(req);

  // Create a placeholder assistant row up front so we can stream its id back
  // to the client in response headers. Filled in on stream completion.
  const { data: placeholder, error: insertError } = await supabase
    .from("messages")
    .insert({ chat_id: chatId, role: "assistant", content: "" })
    .select("id, created_at")
    .single();

  if (insertError || !placeholder) {
    return new Response(
      insertError?.message ?? "Failed to create assistant message",
      { status: 500 },
    );
  }

  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const error = await upstream.text();
    await supabase.from("messages").delete().eq("id", placeholder.id);
    return new Response(error, { status: upstream.status });
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  let assistantContent = "";
  let clientConnected = true;

  const persist = async () => {
    const { error } = await supabase
      .from("messages")
      .update({ content: assistantContent })
      .eq("id", placeholder.id);
    if (error) console.error("Persist failed:", error);
  };

  // Runs independently of the response stream. Keeps reading from OpenAI and
  // writing the final content to the DB even if the mobile client disconnects.
  const runStreamingTask = async (
    controller: ReadableStreamDefaultController<Uint8Array> | null,
  ) => {
    const reader = upstream.body!.getReader();
    let buffer = "";

    const tryEnqueue = (bytes: Uint8Array) => {
      if (!clientConnected || !controller) return;
      try {
        controller.enqueue(bytes);
      } catch {
        clientConnected = false;
      }
    };

    const tryClose = () => {
      if (!clientConnected || !controller) return;
      try {
        controller.close();
      } catch {
        // ignore
      }
    };

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") {
            await persist();
            tryClose();
            return;
          }
          try {
            const json = JSON.parse(payload);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              tryEnqueue(encoder.encode(delta));
            }
          } catch {
            // ignore malformed chunks
          }
        }
      }
      await persist();
      tryClose();
    } catch (err) {
      console.error("Streaming task failed:", err);
      if (assistantContent) {
        await persist();
      } else {
        await supabase.from("messages").delete().eq("id", placeholder.id);
      }
      if (clientConnected && controller) {
        try {
          controller.error(err);
        } catch {
          // ignore
        }
      }
    }
  };

  const stream = new ReadableStream({
    start(controller) {
      // @ts-ignore EdgeRuntime is provided by Supabase edge runtime
      EdgeRuntime.waitUntil(runStreamingTask(controller));
    },
    cancel() {
      // Client disconnected — flip the flag so the background task stops
      // trying to write to the (now-dead) controller but keeps running to
      // persist the assistant message.
      clientConnected = false;
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
      "X-Message-Id": placeholder.id,
      "X-Message-Created-At": placeholder.created_at,
    },
  });
});
