import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent
} from "react";

interface PracticePanelProps {
  active: boolean;
  onClose: () => void;
}

interface PracticeWord {
  id: string;
  word: string;
  definition: string;
  hint: string;
}

interface Tile {
  id: string;
  letter: string;
}

type PracticeResult = "idle" | "correct" | "wrong" | "completed" | "incomplete";
type FeedbackFx = "none" | "success" | "error";

const MAX_LIVES = 3;
const CONFETTI_COLORS = ["#F97316", "#FACC15", "#34D399", "#38BDF8", "#A855F7", "#FB7185"];

const demoWords: PracticeWord[] = [
  { id: "focus-1", word: "focus", definition: "集中注意力于某件事", hint: "f____" },
  {
    id: "resilient-1",
    word: "resilient",
    definition: "能够迅速从困难中恢复",
    hint: "r_______"
  },
  { id: "orbit-1", word: "orbit", definition: "行星或航天器围绕另一天体的轨道", hint: "o____" }
];

const createTiles = (word: PracticeWord) =>
  word.word.split("").map((letter, index) => ({
    id: `${word.id}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    letter
  }));

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const PracticePanel = ({ active, onClose }: PracticePanelProps) => {
  const [step, setStep] = useState(0);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [slots, setSlots] = useState<(Tile | null)[]>([]);
  const [result, setResult] = useState<PracticeResult>("idle");
  const [lives, setLives] = useState(MAX_LIVES);
  const [streak, setStreak] = useState(0);
  const [feedbackFx, setFeedbackFx] = useState<FeedbackFx>("none");
  const [confettiPieces, setConfettiPieces] = useState<
    Array<{ id: string; left: number; delay: number; xTravel: number; color: string }>
  >([]);

  const currentWord = useMemo(() => demoWords[step] ?? null, [step]);
  const sessionCompleted = result === "completed";
  const isOutOfLives = lives <= 0;
  const locked = sessionCompleted || isOutOfLives;

  const buildConfettiPieces = useCallback(() => {
    return Array.from({ length: 12 }).map((_, index) => ({
      id: `${Date.now()}-${index}`,
      left: Math.random() * 80 + 10,
      delay: Math.random() * 120,
      xTravel: (Math.random() - 0.5) * 160,
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length]
    }));
  }, []);

  const initializeBoard = useCallback(() => {
    if (!currentWord) {
      setTiles([]);
      setSlots([]);
      setResult("completed");
      setFeedbackFx("none");
      setConfettiPieces([]);
      return;
    }

    const baseTiles = createTiles(currentWord);
    setTiles(shuffle(baseTiles));
    setSlots(Array(baseTiles.length).fill(null));
    setResult("idle");
    setFeedbackFx("none");
    setConfettiPieces([]);
  }, [currentWord]);

  useEffect(() => {
    if (!active) {
      setStep(0);
      setTiles([]);
      setSlots([]);
      setLives(MAX_LIVES);
      setStreak(0);
      setResult("idle");
      setFeedbackFx("none");
      setConfettiPieces([]);
      return;
    }
    setStep(0);
    setLives(MAX_LIVES);
    setStreak(0);
    setFeedbackFx("none");
    setConfettiPieces([]);
  }, [active]);

  useEffect(() => {
    if (!active || !currentWord) return;
    initializeBoard();
  }, [active, currentWord, initializeBoard]);

  useEffect(() => {
    if (feedbackFx === "none") return;
    const timer = window.setTimeout(() => {
      setFeedbackFx("none");
      setConfettiPieces([]);
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [feedbackFx]);

  const fillNextSlot = (tileId: string) => {
    const tile = tiles.find((t) => t.id === tileId);
    if (!tile) return;
    const nextIndex = slots.findIndex((slot) => slot === null);
    if (nextIndex === -1) return;

    const newSlots = [...slots];
    newSlots[nextIndex] = tile;
    setSlots(newSlots);
    setTiles(tiles.filter((t) => t.id !== tile.id));
    setResult("idle");
  };

  const clearSlot = (slotIndex: number) => {
    const tile = slots[slotIndex];
    if (!tile) return;
    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);
    setTiles([...tiles, tile]);
    setResult("idle");
  };

  const handleTileClick = (tileId: string) => {
    if (locked) return;
    fillNextSlot(tileId);
  };

  const handleSlotClick = (slotIndex: number) => {
    if (locked) return;
    clearSlot(slotIndex);
  };

  const handleCheck = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentWord || locked) return;

    if (slots.some((slot) => slot === null)) {
      setResult("incomplete");
      return;
    }

    const assembled = slots.map((slot) => slot?.letter ?? "").join("").toLowerCase();
    if (assembled === currentWord.word.toLowerCase()) {
      const nextResult = step === demoWords.length - 1 ? "completed" : "correct";
      setResult(nextResult);
      setStreak((prev) => prev + 1);
      setFeedbackFx("success");
      setConfettiPieces(buildConfettiPieces());
    } else {
      setResult("wrong");
      setLives((prev) => Math.max(0, prev - 1));
      setStreak(0);
      setFeedbackFx("error");
    }
  };

  const canGoNext = step < demoWords.length - 1 && result === "correct";

  const handleNext = () => {
    if (!canGoNext) return;
    setStep((prev) => prev + 1);
  };

  const handleResetBoard = () => {
    if (!currentWord || locked) return;
    initializeBoard();
  };

  const statusMessage = (() => {
    if (sessionCompleted) return "演示题已完成，试试每日挑战吧！";
    if (isOutOfLives) return "生命值用尽，重新开始可恢复。";
    switch (result) {
      case "correct":
        return "完美！点击下一题继续保持节奏。";
      case "wrong":
        return "再排列一次？错字母会扣生命值。";
      case "incomplete":
        return "还有空位，点击字母填满后再检查。";
      default:
        return "点击字母填入空位，再次点击空位可回收。";
    }
  })();

  const slotFeedbackClass = result === "wrong" ? "animate-wiggle" : result === "correct" ? "animate-pop" : "";
  const tileClass =
    "rounded-2xl border border-slate-200 bg-white px-4 py-2 text-lg font-semibold uppercase tracking-wide text-slate-900 shadow-sm";

  if (!active) return null;

  return (
    <section
      id="practice"
      className="relative mx-auto mt-4 w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
      aria-live="polite"
    >
      {feedbackFx === "success" && (
        <div className="fx-confetti">
          {confettiPieces.map((piece) => (
            <span
              key={piece.id}
              className="fx-confetti-piece"
              style={
                {
                  left: `${piece.left}%`,
                  animationDelay: `${piece.delay}ms`,
                  backgroundColor: piece.color,
                  "--x-travel": `${piece.xTravel}px`
                } as CSSProperties & Record<string, string>
              }
            />
          ))}
        </div>
      )}
      {feedbackFx === "error" && <div className="fx-error-ring" />}

      <header className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-500">即时演示</p>
          <h2 className="text-2xl font-semibold text-slate-900">点击式拼写体验</h2>
          <p className="text-sm text-slate-600">借鉴 Duolingo 拼写关卡，点击字母填入空位，配合生命值与连击机制。</p>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: MAX_LIVES }).map((_, index) => (
                <span key={`life-${index}`} className={`text-lg ${index < lives ? "text-rose-500" : "text-slate-300"}`}>
                  ❤
                </span>
              ))}
            </div>
            <span>生命值</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">连击</p>
            <p className="text-lg font-semibold text-amber-600">{streak}x</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-1 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            onClick={onClose}
          >
            结束练习
          </button>
        </div>
      </header>

      <div className="mt-4 flex items-center gap-2">
        {demoWords.map((word, index) => (
          <span
            key={word.id}
            className={`h-2 flex-1 rounded-full ${index < step ? "bg-emerald-400" : index === step ? "bg-amber-400" : "bg-slate-200"}`}
            aria-label={`进度 ${index + 1}/${demoWords.length}`}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
        <form className="space-y-4" onSubmit={handleCheck} aria-label="点击字母练习">
          <div className="rounded-2xl bg-sand-100/60 p-4">
            <p className="text-xs text-slate-500">释义 #{step + 1}/{demoWords.length}</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{currentWord?.definition ?? "全部完成"}</p>
            {currentWord && <p className="mt-1 text-sm text-amber-600">提示：{currentWord.hint}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
              <span>点击字母填空</span>
              {locked && <span className="text-xs text-rose-500">{isOutOfLives ? "生命值耗尽" : "本轮完成"}</span>}
            </div>
            <div className={`flex flex-wrap gap-2 ${slotFeedbackClass}`}>
              {slots.map((slot, index) => (
                <button
                  key={`${currentWord?.id ?? "slot"}-${index}`}
                  type="button"
                  className={`flex h-14 w-16 items-center justify-center rounded-2xl border-2 ${
                    slot ? "border-slate-900 bg-slate-900 text-white shadow-inner" : "border-dashed border-slate-300 bg-white/60 text-slate-400"
                  }`}
                  onClick={() => handleSlotClick(index)}
                  disabled={!slot || locked}
                >
                  {slot ? slot.letter.toUpperCase() : ""}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 p-4">
            <p className="text-sm font-semibold text-slate-800">可用字母（点击自动填入）</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tiles.map((tile) => (
                <button
                  key={tile.id}
                  type="button"
                  className={`${tileClass} ${locked ? "opacity-60" : "hover:border-slate-400 hover:text-slate-900"}`}
                  onClick={() => handleTileClick(tile.id)}
                  disabled={locked}
                >
                  {tile.letter.toUpperCase()}
                </button>
              ))}
              {!tiles.length && <span className="text-xs text-slate-400">字母已用完，可点击空位回收</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="button-primary disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={!currentWord || locked}>
              检查
            </button>
            <button
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:opacity-60"
              type="button"
              onClick={handleNext}
              disabled={!canGoNext}
            >
              下一题
            </button>
            <button
              className="rounded-full border border-transparent px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 disabled:opacity-40"
              type="button"
              onClick={handleResetBoard}
              disabled={locked}
            >
              重新排列
            </button>
          </div>
        </form>

        <aside className="space-y-4 rounded-2xl border border-dashed border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-900">即时反馈</p>
          <p className="text-sm text-slate-600">{statusMessage}</p>
          <ul className="text-xs text-slate-500">
            <li>· 点击字母=填空，再次点击=回收</li>
            <li>· 生命值归零后可重新开始一轮</li>
            <li>· 题库可替换为教材词库 / OCR 结果</li>
          </ul>
        </aside>
      </div>
    </section>
  );
};
