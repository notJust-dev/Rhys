import { fetch } from "expo/fetch";
import { supabase } from "./client";
import { supabasePublishableKey, supabaseUrl } from "./config";

export async function invokeFunctionStream(
  name: string,
  body: unknown,
): Promise<ReadableStreamDefaultReader<Uint8Array>> {
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
    throw new Error(`Function "${name}" failed: ${response.status}`);
  }

  return response.body.getReader();
}
