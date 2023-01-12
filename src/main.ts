const startEl = document.getElementById("start");
const cancelEl = document.getElementById("cancel");

const repsEl = document.getElementById("reps") as HTMLInputElement;
const intervalEl = document.getElementById("interval") as HTMLInputElement;

const configEl = document.getElementById("config");
const playingEl = document.getElementById("playing");
const currentEl = document.getElementById("current");

const MOVES = {
  FRONT_LEFT: "Front left",
  FRONT_RIGHT: "Front right",
  MIDDLE_LEFT: "Volley left",
  MIDDLE_RIGHT: "Volley right",
  BACK_LEFT: "Back left",
  BACK_RIGHT: "Back right",
} as const;

type Move = keyof typeof MOVES;

startEl?.addEventListener("click", () => {
  const reps = parseInt(repsEl?.value);
  const interval = parseInt(intervalEl?.value) * 1000;

  loop(reps - 1, interval);

  configEl?.classList.add("hidden");
  playingEl?.classList.remove("hidden");
});

cancelEl?.addEventListener("click", () => {
  window.location.reload();
});

const loop = async (reps: number, interval: number) => {
  const move = getRandomMove();
  await ghostSpeak(move);

  setTimeout(() => {
    if (reps === 0) {
      finish();
      return;
    }
    loop(reps - 1, interval);
  }, interval);
};

const getRandomMove = (): Move => {
  const rnd = Math.floor(Math.random() * 6);
  const keys = Object.keys(MOVES) as Move[];
  return keys[rnd];
};

const synth = window.speechSynthesis;

const ghostSpeak = async (move: Move) => {
  return new Promise((resolve) => {
    const currentMove = MOVES[move];
    const speak = new SpeechSynthesisUtterance(currentMove);
    speak.addEventListener("end", () => {
      resolve("");
    });
    synth.speak(speak);
    if (currentEl) {
      currentEl.innerText = currentMove;
    }
  });
};

const finish = () => {
  configEl?.classList.remove("hidden");
  playingEl?.classList.add("hidden");
};

export {};
