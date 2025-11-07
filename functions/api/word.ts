import type { PagesFunction } from "@cloudflare/workers-types";

export interface Env {
  WORD_BANK: KVNamespace;
}

const FALLBACK_WORDS = [
  {
    id: "quake-01",
    word: "earthquake",
    definition: "a sudden shaking of the ground",
    hint: "地震",
    level: "B1"
  },
  {
    id: "resilient-02",
    word: "resilient",
    definition: "able to recover quickly after difficult conditions",
    hint: "有韧性",
    level: "B2"
  }
];

export const onRequest: PagesFunction<Env> = async (context) => {
  const { env } = context;
  const listKey = "daily:today";

  try {
    const cache = await env.WORD_BANK.get(listKey);
    if (cache) {
      return new Response(cache, {
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("KV read failed", error);
  }

  return new Response(JSON.stringify({ words: FALLBACK_WORDS }), {
    headers: { "Content-Type": "application/json" }
  });
};

