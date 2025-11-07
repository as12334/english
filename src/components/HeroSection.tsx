export const HeroSection = () => {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-10 px-6 pb-16 pt-12 md:flex-row md:items-center">
      <div className="flex-1 space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-500">轻量拼写新体验</p>
        <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
          WordSpark：简洁大方的英语单词拼写游戏
        </h1>
        <p className="max-w-xl text-base text-slate-600">
          在碎片时间挑战教材词库、每日主题与趣味闯关。支持拍照识别、错词复盘与排行榜，让背单词更有参与感。
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="button-primary">开始练习</button>
          <button className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900">
            体验拍照识别
          </button>
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col gap-4">
        <article className="card relative overflow-hidden">
          <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-600">
            今日挑战
          </span>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">earthquake</h2>
            <p className="text-sm text-slate-600">n. 地震；地表的剧烈震动</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>剩余 58 分钟</span>
              <span>?</span>
              <span>连胜 +2</span>
            </div>
          </div>
        </article>
        <article className="card">
          <p className="text-sm font-medium text-slate-700">OCR 快速录词</p>
          <p className="mt-1 text-sm text-slate-500">
            拍下教材或练习册，一键生成练习列表；可手动校对、识别历史随时查看。
          </p>
        </article>
      </div>
    </section>
  );
};

