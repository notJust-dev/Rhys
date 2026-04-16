import * as Sentry from "@sentry/react-native";
import { fetch } from "expo/fetch";
import { supabase } from "./client";
import { supabasePublishableKey, supabaseUrl } from "./config";

export async function invokeFunctionStream(
  name: string,
  body: unknown,
): Promise<{
  reader: ReadableStreamDefaultReader<Uint8Array>;
  headers: Headers;
}> {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token ?? supabasePublishableKey;

  const response = await fetch(`${supabaseUrl}/functions/v1/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      apikey: supabasePublishableKey ?? "",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok || !response.body) {
    const error = new Error(`Function "${name}" failed: ${response.status}`);
    Sentry.captureException(error, {
      tags: { feature: "invoke_edge_function_stream", function_name: name },
      extra: { status: response.status },
    });
    throw error;
  }

  return { reader: response.body.getReader(), headers: response.headers };
}
