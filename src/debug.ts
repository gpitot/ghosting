const debugElements = document.querySelectorAll("[data-debug]");
const debugMode = Boolean(
  new URLSearchParams(window.location.search).get("debug")
);

if (debugMode) {
  debugElements.forEach((el) => el.classList.remove("hidden"));
} else {
  debugElements.forEach((el) => el.classList.add("hidden"));
}

export {};
