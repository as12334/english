const modes = [
  {
    title: "教材闯关",
    description: "根据年级和单元逐个挑战教材词汇，自动记录掌握度。",
    callout: "适配小学到高中主流教材"
  },
  {
    title: "每日挑战",
    description: "精选主题词单配合例句和语境，限时连击更刺激。",
    callout: "每天刷新 10 道新题"
  },
  {
    title: "自由练习",
    description: "自定义词单、难度与提示方式，适合碎片时间。",
    callout: "支持 OCR / 语音录入"
  }
];

export const ModeCards = () => {
  return (
    <section id="modes" className="bg-white/70">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">丰富但简洁的学习模式</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            三大模式覆盖教材、挑战和自由练习，统一的简洁界面让不同年级、不同场景都能快速上手。
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {modes.map((mode) => (
            <article key={mode.title} className="card flex h-full flex-col justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{mode.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{mode.description}</p>
              </div>
              <span className="text-xs font-medium text-amber-600">{mode.callout}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

