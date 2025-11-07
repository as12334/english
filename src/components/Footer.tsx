export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm md:flex-row md:items-center md:justify-between">
        <p className="font-medium">WordSpark · 英语拼写趣味游戏</p>
        <div className="flex flex-wrap gap-4 text-xs text-slate-300">
          <span>Cloudflare Pages 驱动</span>
          <span>OCR & 教材词库持续更新</span>
          <span>联系邮箱：hi@wordspark.app</span>
        </div>
      </div>
    </footer>
  );
};
