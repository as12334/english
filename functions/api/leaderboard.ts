/// <reference types="@cloudflare/workers-types" />
import type { PagesFunction } from "@cloudflare/workers-types";

const SAMPLE = [
  { rank: 1, nickname: "Aurora", score: 1280, streak: 5 },
  { rank: 2, nickname: "Milo", score: 1185, streak: 3 },
  { rank: 3, nickname: "星航", score: 1102, streak: 4 }
];

export const onRequest: PagesFunction = async () => {
  return new Response(JSON.stringify({ leaderboard: SAMPLE }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
};
