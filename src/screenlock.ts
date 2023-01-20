const canWakeLock = "wakeLock" in navigator;
const wakeLockEl = document.getElementById("wakelock");
if (wakeLockEl) {
  wakeLockEl.innerText = `Wakelock enabled: ${canWakeLock}`;
}

(async () => {
  try {
    if (canWakeLock) {
      // @ts-ignore
      await navigator.wakeLock.request("screen");
      console.log("wake lock requested");
    }
  } catch (err) {
    console.log(err);
    // if wake lock request fails - usually system related, such as battery
  }
})();

export {};
