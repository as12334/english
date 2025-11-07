const features = [
  {
    title: "拍照识别单词",
    description: "OCR 支持教材扫描与练习册上传，失败兜底手动校对，图片即时清除。"
  },
  {
    title: "教材词库全覆盖",
    description: "小学到高中主流教材词表预置，按单元、难度自动生成练习路径。"
  },
  {
    title: "H5 多端体验",
    description: "统一的轻量界面，手机、平板、电脑都拥有顺滑触控与键盘操作。"
  }
];

export const FeatureHighlights = () => {
  return (
    <section id="features" className="bg-white/70">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16">
        <header>
          <h2 className="text-2xl font-semibold text-slate-900">把学习流程做得更轻盈</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            WordSpark 专注“简洁大方 + 高频使用”，核心场景覆盖拍照录词、教材自学与快捷练习。
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((item) => (
            <article key={item.title} className="card h-full">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
