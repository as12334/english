const stats = [
  { value: "8.5 min", label: "平均关卡时长" },
  { value: "92%", label: "识别准确率" },
  { value: "120k+", label: "教材词量覆盖" }
];

export const DailyChallenge = () => {
  return (
    <section id="challenge" className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-12 md:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">每日挑战 & 智能录词</h2>
          <p className="text-sm text-slate-600">
            每天中午准时更新词单，结合 OCR 拍照录词和错题复盘，帮助你在碎片时间保持节奏。识别失败会提示人工校对，所有图片即时删除，保障隐私安全。
          </p>
          <ul className="grid gap-3 text-sm text-slate-700" role="list">
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-[10px] font-semibold text-amber-700">
                1
              </span>
              选择教材版本 / 年级或直接进入每日挑战。
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-200 text-[10px] font-semibold text-indigo-700">
                2
              </span>
              拍摄纸质资料或上传图片，自动识别生成练习列表，可手动修订。
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-200 text-[10px] font-semibold text-emerald-700">
                3
              </span>
              进入拼写关卡，配合倒计时、提示、连击加分与语音发音辅助完成练习。
            </li>
          </ul>
        </div>
        <div className="card space-y-6">
          <header className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">WordSpark 数据速览</p>
            <h3 className="text-xl font-semibold text-slate-900">持续迭代的轻量体验</h3>
          </header>
          <dl className="grid gap-4">
            {stats.map((item) => (
              <div key={item.label} className="flex items-baseline justify-between">
                <dt className="text-xs uppercase tracking-wide text-slate-500">{item.label}</dt>
                <dd className="text-lg font-semibold text-slate-900">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
