/// <reference types="@cloudflare/workers-types" />

export class LeaderboardObject {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.endsWith("/health")) {
      return new Response("ok", { status: 200 });
    }

    if (request.method === "POST") {
      return new Response(JSON.stringify({ status: "queued" }), {
        status: 202,
        headers: { "Content-Type": "application/json" }
      });
    }

    const sample = [
      { rank: 1, nickname: "Aurora", score: 1280, streak: 5 },
      { rank: 2, nickname: "Milo", score: 1185, streak: 3 },
      { rank: 3, nickname: "星航", score: 1102, streak: 4 }
    ];

    return new Response(JSON.stringify({ leaderboard: sample }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
