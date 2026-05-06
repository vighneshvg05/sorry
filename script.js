const screens = Array.from(document.querySelectorAll(".screen"));
const progressDots = Array.from(document.querySelectorAll(".dot"));
const celebration = document.querySelector(".celebration");
const celebrationDate = document.querySelector(".celebration-date");
const celebrationMessage = document.querySelector(".celebration-message");
const sideStitchImages = Array.from(document.querySelectorAll(".stitch-pic"));
const screen4Content = document.querySelector('.screen[data-screen="4"] .screen-content');

let currentScreenIndex = 0;

function showScreen(index) {
  screens.forEach((screen, i) => {
    screen.classList.toggle("active", i === index);
  });

  progressDots.forEach((dot, i) => {
    dot.classList.toggle("active", i <= index);
  });
}

function getRandomOffset(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rectsOverlap(a, b) {
  return !(
    a.right <= b.left ||
    a.left >= b.right ||
    a.bottom <= b.top ||
    a.top >= b.bottom
  );
}

function moveNoButton(noBtn, container, yesBtn) {
  const maxX = Math.max(container.clientWidth - noBtn.offsetWidth, 12);
  const maxY = Math.max(container.clientHeight - noBtn.offsetHeight, 12);

  const yesRectAbs = yesBtn?.getBoundingClientRect?.();
  const contRectAbs = container.getBoundingClientRect();
  const yesRect = yesRectAbs
    ? {
        left: yesRectAbs.left - contRectAbs.left - 10,
        right: yesRectAbs.right - contRectAbs.left + 10,
        top: yesRectAbs.top - contRectAbs.top - 10,
        bottom: yesRectAbs.bottom - contRectAbs.top + 10,
      }
    : null;

  let x = 0;
  let y = 0;
  let tries = 0;
  while (tries < 30) {
    x = getRandomOffset(0, maxX);
    y = getRandomOffset(0, maxY);

    if (!yesRect) break;

    const noRect = {
      left: x,
      right: x + noBtn.offsetWidth,
      top: y,
      bottom: y + noBtn.offsetHeight,
    };

    if (!rectsOverlap(noRect, yesRect)) break;
    tries += 1;
  }

  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

function formatDateForDisplay(isoDate) {
  if (!isoDate) return "";
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

screens.forEach((screen, index) => {
  const envelope = screen.querySelector(".envelope");
  const letter = screen.querySelector(".letter");
  const yesBtn = screen.querySelector(".yes-btn");
  const noBtn = screen.querySelector(".no-btn");
  const choices = screen.querySelector(".choices");
  const confirmBtn = screen.querySelector(".mini-form-confirm");
  const afterConfirmBlocks = Array.from(screen.querySelectorAll(".after-confirm"));
  const miniForm = screen.querySelector(".mini-form");
  const dateInput = screen.querySelector("#sushi-date");
  const miniFormError = screen.querySelector(".mini-form-error");

  envelope.addEventListener("click", () => {
    envelope.classList.add("open");
    letter.classList.add("show");
  });

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      const picked = dateInput?.value?.trim?.() || "";
      if (!picked) {
        if (miniFormError) miniFormError.classList.remove("hidden");
        dateInput?.focus?.();
        return;
      }

      localStorage.setItem("sushiDate", picked);
      if (miniFormError) miniFormError.classList.add("hidden");
      if (miniForm) miniForm.classList.add("hidden");
      afterConfirmBlocks.forEach((el) => el.classList.remove("hidden"));
    });
  }

  if (dateInput) {
    dateInput.addEventListener("input", () => {
      if (miniFormError) miniFormError.classList.add("hidden");
    });
  }

  yesBtn.addEventListener("click", () => {
    const isFinalScreen = index === screens.length - 1;

    if (isFinalScreen) {
      document.body.classList.add("final-yes-state");
      const saved = localStorage.getItem("sushiDate") || "";
      const pretty = formatDateForDisplay(saved);
      if (celebrationDate) {
        celebrationDate.textContent = pretty
          ? `Sushi date — ${pretty} it is. Waiting for it…`
          : "Sushi date — soon. Waiting for it…";
      }

      if (celebrationMessage) {
        celebrationMessage.textContent =
          "Heyy bbg, hope this got a smile on your face. I’m really sorry, Vishruthaaa and I promise I won’t do something like this again. And yess I’ll always try to be the person you can come to when you’re sad and not the person who makes you sad.\n\n" +
          "You may not text me for hours, but I also know the fact that whenever something, even a little, is bothering you and you feel sad, I’m the first person you come to. And I’m very lucky that I get to be that person for you. I promise I’ll try my best not to disappoint you in this\n\n"      }

      // Put the final card inside page 4 so it doesn't overlap.
      if (screen4Content && celebration && !screen4Content.contains(celebration)) {
        screen4Content.appendChild(celebration);
      }

      celebration.classList.add("show");
      return;
    }

    currentScreenIndex = index + 1;
    showScreen(currentScreenIndex);
  });

  // Make "No" button jump away whenever user gets close.
  ["mouseenter", "mouseover", "mousemove", "touchstart"].forEach((eventName) => {
    noBtn.addEventListener(eventName, () => moveNoButton(noBtn, choices, yesBtn));
  });

  noBtn.addEventListener("click", (event) => {
    event.preventDefault();
    moveNoButton(noBtn, choices, yesBtn);
  });
});

sideStitchImages.forEach((img) => {
  img.addEventListener("error", () => {
    img.style.display = "none";
  });
});

showScreen(currentScreenIndex);
