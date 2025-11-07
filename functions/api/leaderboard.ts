/// <reference types="@cloudflare/workers-types" />
import type {
  DurableObjectNamespace,
  PagesFunction
} from "@cloudflare/workers-types";

export interface Env {
  LEADERBOARD: DurableObjectNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const id = context.env.LEADERBOARD.idFromName("global");
  const stub = context.env.LEADERBOARD.get(id);

  const response = await stub.fetch("https://wordspark.dev/api/leaderboard");

  return new Response(response.body, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    },
    status: response.status
  });
};
