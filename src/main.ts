const startEl = document.getElementById("start");

const repsEl = document.getElementById("reps") as HTMLInputElement;
const intervalEl = document.getElementById("interval") as HTMLInputElement;

const configEl = document.getElementById("config");
const playingEl = document.getElementById("playing");
const currentEl = document.getElementById("current");

const repsDefault = window.localStorage.getItem("reps") ?? "15";
const intervalDefault = window.localStorage.getItem("interval") ?? "2";
repsEl.value = repsDefault;
intervalEl.value = intervalDefault;

const MOVES = {
  FRONT_LEFT: "Front left",
  FRONT_RIGHT: "Front right",
  MIDDLE_LEFT: "Volley left",
  MIDDLE_RIGHT: "Volley right",
  BACK_LEFT: "Back left",
  BACK_RIGHT: "Back right",
} as const;

type Move = keyof typeof MOVES;

const MoveKeys = Object.keys(MOVES) as Move[];
let availableMoves: Move[] = [];
const setAvailableMoves = (reps: number) => {
  MoveKeys.forEach((move) => {
    for (let i = 0; i <= Math.max(1, Math.floor(reps / 5)); i += 1) {
      availableMoves.push(move);
    }
  });
};

let lastMove: Move;

const setLocalStorage = (reps: number, interval: number) => {
  window.localStorage.setItem("reps", reps.toString());
  window.localStorage.setItem("interval", interval.toString());
};

startEl?.addEventListener("click", async () => {
  const reps = parseInt(repsEl?.value);
  const interval = parseFloat(intervalEl?.value);
  setLocalStorage(reps, interval);
  configEl?.classList.add("hidden");
  playingEl?.classList.remove("hidden");
  setAvailableMoves(reps);
  await countdown();
  loop(reps - 1, interval * 1000);
});

const sleep = (ms: number): Promise<void> =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const loop = async (reps: number, interval: number) => {
  const move = getRandomMove();
  await ghostSpeak(move);
  if (reps === 0) {
    finish();
    return;
  }
  await sleep(interval);
  loop(reps - 1, interval);
};

const getRandomMove = (): Move => {
  const rnd = Math.floor(Math.random() * availableMoves.length);
  const move = availableMoves[rnd];
  if (move === lastMove) {
    console.log("same move again , try one more");
    return getRandomMove();
  }
  lastMove = move;
  availableMoves = [
    ...availableMoves.slice(0, rnd),
    ...availableMoves.slice(rnd + 1),
  ];

  return move;
};

const synth = window.speechSynthesis;

const speak = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    const speak = new SpeechSynthesisUtterance(text);
    if (currentEl) {
      currentEl.innerText = text;
    }
    speak.addEventListener("end", () => {
      resolve();
    });
    synth.speak(speak);
  });
};

const ghostSpeak = async (move: Move) => {
  const currentMove = MOVES[move];
  await speak(currentMove);
};

const finish = async () => {
  await speak("Finished session");
  configEl?.classList.remove("hidden");
  playingEl?.classList.add("hidden");
};

const countdown = async (): Promise<void> => {
  await speak("Starting in 3");
  await sleep(500);
  await speak("2");
  await sleep(500);
  await speak("1");
  await sleep(500);
};

export {};
