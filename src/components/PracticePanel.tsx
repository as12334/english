import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type DragEvent,
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

type DragPayload =
  | {
      source: "pool";
      tileId: string;
    }
  | {
      source: "slot";
      tileId: string;
      slotIndex: number;
    };

type PracticeResult =
  | "idle"
  | "correct"
  | "wrong"
  | "completed"
  | "incomplete";

const demoWords: PracticeWord[] = [
  {
    id: "focus-1",
    word: "focus",
    definition: "集中注意力于某件事",
    hint: "f____"
  },
  {
    id: "resilient-1",
    word: "resilient",
    definition: "能够迅速从困难中恢复",
    hint: "r_______"
  },
  {
    id: "orbit-1",
    word: "orbit",
    definition: "行星或航天器围绕另一天体的轨道",
    hint: "o____"
  }
];

const shuffleTiles = (tiles: Tile[]) => {
  const copy = [...tiles];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const createTiles = (word: PracticeWord) =>
  word.word.split("").map((letter, index) => ({
    id: `${word.id}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    letter
  }));

export const PracticePanel = ({ active, onClose }: PracticePanelProps) => {
  const [step, setStep] = useState(0);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [slots, setSlots] = useState<(Tile | null)[]>([]);
  const [result, setResult] = useState<PracticeResult>("idle");

  const currentWord = useMemo(() => demoWords[step] ?? null, [step]);

  const initializeBoard = useCallback(() => {
    if (!currentWord) {
      setTiles([]);
      setSlots([]);
      setResult("completed");
      return;
    }

    const baseTiles = createTiles(currentWord);
    setTiles(shuffleTiles(baseTiles));
    setSlots(Array(baseTiles.length).fill(null));
    setResult("idle");
  }, [currentWord]);

  useEffect(() => {
    if (active) {
      initializeBoard();
    }
  }, [active, initializeBoard]);

  useEffect(() => {
    if (!active) {
      setStep(0);
      setTiles([]);
      setSlots([]);
      setResult("idle");
    }
  }, [active]);

  const parsePayload = (event: DragEvent<HTMLElement>): DragPayload | null => {
    try {
      const data = event.dataTransfer.getData("application/json");
      if (!data) return null;
      const payload = JSON.parse(data);
      if (payload?.source === "pool" && payload.tileId) return payload;
      if (
        payload?.source === "slot" &&
        payload.tileId &&
        typeof payload.slotIndex === "number"
      ) {
        return payload;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleDragStart = (payload: DragPayload) => (
    event: DragEvent<HTMLButtonElement>
  ) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/json", JSON.stringify(payload));
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDropOnSlot = (slotIndex: number) => (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    const payload = parsePayload(event);
    if (!payload) return;

    if (payload.source === "pool") {
      const tile = tiles.find((t) => t.id === payload.tileId);
      if (!tile) return;
      const newSlots = [...slots];
      const displaced = newSlots[slotIndex];
      newSlots[slotIndex] = tile;

      const newPool = tiles.filter((t) => t.id !== tile.id);
      if (displaced) {
        newPool.push(displaced);
      }

      setSlots(newSlots);
      setTiles(newPool);
      setResult("idle");
      return;
    }

    if (payload.source === "slot") {
      if (payload.slotIndex === slotIndex) return;
      const newSlots = [...slots];
      const movingTile = newSlots[payload.slotIndex];
      if (!movingTile) return;
      const displaced = newSlots[slotIndex];
      newSlots[slotIndex] = movingTile;
      newSlots[payload.slotIndex] = displaced ?? null;
      setSlots(newSlots);
      setResult("idle");
    }
  };

  const handleDropToPool = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const payload = parsePayload(event);
    if (!payload || payload.source !== "slot") return;
    const tile = slots[payload.slotIndex];
    if (!tile) return;
    const newSlots = [...slots];
    newSlots[payload.slotIndex] = null;
    setSlots(newSlots);
    setTiles([...tiles, tile]);
    setResult("idle");
  };

  const handleSlotClear = (slotIndex: number) => {
    const tile = slots[slotIndex];
    if (!tile) return;
    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);
    setTiles([...tiles, tile]);
    setResult("idle");
  };

  const handleCheck = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentWord) return;

    if (slots.some((slot) => slot === null)) {
      setResult("incomplete");
      return;
    }

    const assembled = slots.map((slot) => slot?.letter ?? "").join("");
    if (assembled.toLowerCase() === currentWord.word.toLowerCase()) {
      if (step === demoWords.length - 1) {
        setResult("completed");
      } else {
        setResult("correct");
      }
    } else {
      setResult("wrong");
    }
  };

  const handleNext = () => {
    if (step < demoWords.length - 1) {
      setStep((prev) => prev + 1);
      setResult("idle");
    } else {
      setResult("completed");
    }
  };

  const handleResetBoard = () => {
    initializeBoard();
  };

  if (!active) return null;

  const tileClass =
    "cursor-grab select-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-base font-semibold text-slate-900 shadow-sm active:cursor-grabbing";

  return (
    <section
      id="practice"
      className="mx-auto mt-4 w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
      aria-live="polite"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-500">
            即刻开局
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            拖动字母完成拼写
          </h2>
          <p className="text-sm text-slate-600">
            将字母碎片拖入空位组成单词，模拟正式关卡的拖拽拼写体验。
            支持双击或拖拽字母回收，随时重新排列。
          </p>
        </div>
        <button
          className="text-sm text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline"
          type="button"
          onClick={onClose}
        >
          结束练习
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
        <form
          className="space-y-4"
          onSubmit={handleCheck}
          aria-label="拖动字母练习"
        >
          <div className="rounded-2xl bg-sand-100/60 p-4">
            <p className="text-xs text-slate-500">
              释义 #{step + 1}/{demoWords.length}
            </p>
            <p className="mt-2 text-lg font-medium text-slate-900">
              {currentWord?.definition ?? "全部完成"}
            </p>
            {currentWord && (
              <p className="mt-1 text-sm text-amber-600">提示：{currentWord.hint}</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-800">
              拖拽字母到空位
            </p>
            <div className="flex flex-wrap gap-2">
              {slots.map((slot, index) => (
                <div
                  key={`${currentWord?.id ?? "slot"}-${index}`}
                  className={`flex h-12 w-16 items-center justify-center rounded-2xl border-2 ${
                    slot
                      ? "border-slate-900 bg-slate-900/90 text-white shadow-inner"
                      : "border-dashed border-slate-300 bg-white/60 text-slate-400"
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDropOnSlot(index)}
                >
                  {slot ? (
                    <div
                      role="button"
                      tabIndex={0}
                      className="flex h-full w-full cursor-grab items-center justify-center rounded-xl bg-transparent text-lg font-semibold text-white outline-none"
                      draggable
                      onDragStart={handleDragStart({
                        source: "slot",
                        slotIndex: index,
                        tileId: slot.id
                      })}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleSlotClear(index);
                        }
                      }}
                      onDoubleClick={() => handleSlotClear(index)}
                    >
                      {slot.letter}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">拖到此处</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl border border-dashed border-slate-300 p-4"
            onDragOver={handleDragOver}
            onDrop={handleDropToPool}
          >
            <p className="text-sm font-semibold text-slate-800">
              可用字母（拖回可重新分配）
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tiles.map((tile) => (
                <button
                  key={tile.id}
                  type="button"
                  className={tileClass}
                  draggable
                  onDragStart={handleDragStart({ source: "pool", tileId: tile.id })}
                >
                  {tile.letter}
                </button>
              ))}
              {!tiles.length && (
                <span className="text-xs text-slate-400">
                  字母已用完，可双击空位中的字母回收
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="button-primary disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={!currentWord}
            >
              检查
            </button>
            <button
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:opacity-60"
              type="button"
              onClick={handleNext}
              disabled={result === "completed"}
            >
              下一题
            </button>
            <button
              className="rounded-full border border-transparent px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-900"
              type="button"
              onClick={handleResetBoard}
            >
              重新排列
            </button>
          </div>
        </form>

        <aside className="space-y-4 rounded-2xl border border-dashed border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-900">即时反馈</p>
          <p className="text-sm text-slate-600">
            {result === "idle" && "拖动字母组成单词，然后点击“检查”。"}
            {result === "incomplete" &&
              "还有空位未填满，继续拖动直至完成整个单词。"}
            {result === "correct" && "答对啦！可以点击下一题继续保持手感。"}
            {result === "wrong" && "好像不太对，检查提示或重新排列字母再试一次。"}
            {result === "completed" &&
              "演示题已全部完成，去每日挑战或教材模式试试看。"}
          </p>
          <ul className="text-xs text-slate-500">
            <li>· 拖放或双击即可回收字母</li>
            <li>· 题库可替换为教材词汇 / OCR 结果</li>
            <li>· 下一步可接入计时、连击与排行榜统计</li>
          </ul>
        </aside>
      </div>
    </section>
  );
};
