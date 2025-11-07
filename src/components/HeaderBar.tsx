export const HeaderBar = () => {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-indigo-500 text-white font-medium shadow-sm">
          Ws
        </span>
        WordSpark
      </div>
      <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
        <a className="hover:text-slate-900" href="#modes">
          模式
        </a>
        <a className="hover:text-slate-900" href="#challenge">
          每日挑战
        </a>
        <a className="hover:text-slate-900" href="#features">
          功能亮点
        </a>
      </nav>
      <button className="button-primary">立即开始</button>
    </header>
  );
};

