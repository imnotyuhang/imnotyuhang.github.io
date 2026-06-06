const obstacleSelector = [
  ".sidebar",
  ".top-bar",
  ".bento-card",
  ".entry-card",
  ".rail-card",
  ".detail-article",
  ".toc-card",
  ".life-panel",
].join(",");

const reactions = ["heart", "boop", "jump", "hi", "spark"];
const ambientActions = ["idle", "lick", "stretch"];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function intersects(a, b, margin = 8) {
  return !(
    a.right + margin < b.left ||
    a.left - margin > b.right ||
    a.bottom + margin < b.top ||
    a.top - margin > b.bottom
  );
}

function visibleObstacleRects() {
  return Array.from(document.querySelectorAll(obstacleSelector))
    .map((element) => element.getBoundingClientRect())
    .filter((rect) => rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth);
}

function candidateRect(x, y, width, height) {
  return { left: x, top: y, right: x + width, bottom: y + height };
}

function isSafe(rect, obstacles) {
  return !obstacles.some((obstacle) => intersects(rect, obstacle));
}

function readConfig(pet) {
  try {
    return JSON.parse(pet.dataset.petConfig || "{}");
  } catch {
    return {};
  }
}

function setSpriteFrame(pet, frame, frameCount) {
  const sprite = pet.querySelector(".pet-sprite");
  if (!sprite || !frameCount) return;

  const position = frameCount <= 1 ? 0 : (frame / (frameCount - 1)) * 100;
  sprite.style.backgroundSize = `${frameCount * 100}% 100%`;
  sprite.style.backgroundPosition = `${position}% center`;
}

function playAction(pet, actionName) {
  const config = pet.__petConfig;
  const action = config.actions?.[actionName] || config.actions?.idle;
  const frames = action?.frames || [0];
  const frameMs = action?.frameMs || 260;
  const frameCount = config.sprite?.frames || frames.length || 1;

  window.clearInterval(pet.__petActionTimer);
  pet.dataset.action = actionName;

  let frameIndex = 0;
  setSpriteFrame(pet, frames[frameIndex], frameCount);

  if (frames.length <= 1) return;

  pet.__petActionTimer = window.setInterval(() => {
    frameIndex += 1;
    if (frameIndex >= frames.length) {
      window.clearInterval(pet.__petActionTimer);
      playAction(pet, "idle");
      return;
    }
    setSpriteFrame(pet, frames[frameIndex], frameCount);
  }, frameMs);
}

function findSafePosition(pet, index) {
  const width = pet.offsetWidth || 138;
  const height = pet.offsetHeight || 140;
  const padding = 22;
  const maxX = Math.max(padding, window.innerWidth - width - padding);
  const maxY = Math.max(82, window.innerHeight - height - padding);
  const obstacles = visibleObstacleRects();

  const candidates = [
    [maxX - index * 112 - Math.random() * 20, maxY - index * 2 - Math.random() * 8],
    [maxX - Math.random() * 22, window.innerHeight * 0.5 + index * 80 + Math.random() * 60],
    [window.innerWidth * 0.08 + index * 120 + Math.random() * 80, maxY - Math.random() * 28],
    [window.innerWidth * 0.5 + index * 92 + Math.random() * 90, maxY - Math.random() * 28],
  ];

  for (let i = 0; i < 28; i += 1) {
    candidates.push([
      padding + Math.random() * (maxX - padding),
      82 + Math.random() * (maxY - 82),
    ]);
  }

  for (const [rawX, rawY] of candidates) {
    const x = clamp(rawX, padding, maxX);
    const y = clamp(rawY, 82, maxY);
    const rect = candidateRect(x, y, width, height);
    if (isSafe(rect, obstacles)) return { x, y, safe: true };
  }

  const fallbackX = clamp(maxX - index * 98, padding, maxX);
  const fallbackY = clamp(maxY - index * 8, 82, maxY);
  return { x: fallbackX, y: fallbackY, safe: false };
}

function placePets(pets) {
  pets.forEach((pet, index) => {
    const position = findSafePosition(pet, index);
    pet.style.setProperty("--pet-x", `${Math.round(position.x)}px`);
    pet.style.setProperty("--pet-y", `${Math.round(position.y)}px`);
    pet.classList.toggle("is-sheltered", !position.safe);
  });
}

function scheduleAmbientAction(pet) {
  window.clearTimeout(pet.__petAmbientTimer);
  const delay = 3200 + Math.random() * 5600;

  pet.__petAmbientTimer = window.setTimeout(() => {
    const actionName = ambientActions[Math.floor(Math.random() * ambientActions.length)];
    playAction(pet, actionName);
    scheduleAmbientAction(pet);
  }, delay);

  window.__petAmbientTimers = window.__petAmbientTimers || [];
  window.__petAmbientTimers.push(pet.__petAmbientTimer);
}

export function initPetEngine() {
  const pets = Array.from(document.querySelectorAll("[data-wander-pet]"));
  if (!pets.length) return;

  window.clearInterval(window.__petWanderTimer);
  if (window.__petAmbientTimers) window.__petAmbientTimers.forEach((timer) => window.clearTimeout(timer));
  window.__petAmbientTimers = [];
  if (window.__petResizeHandler) window.removeEventListener("resize", window.__petResizeHandler);

  if (window.matchMedia("(max-width: 560px)").matches) return;

  pets.forEach((pet, index) => {
    pet.__petConfig = readConfig(pet);
    pet.classList.remove("is-ready", "is-booped", "is-sheltered");
    pet.style.setProperty("--wander-delay", `${index * -1.4}s`);
    playAction(pet, "idle");

    pet.onclick = () => {
      const reaction = pet.querySelector(".pet-reaction");
      if (reaction) reaction.textContent = reactions[Math.floor(Math.random() * reactions.length)];
      pet.classList.remove("is-booped");
      void pet.offsetWidth;
      pet.classList.add("is-booped");
      playAction(pet, "jump");
      window.setTimeout(() => pet.classList.remove("is-booped"), 680);
    };

    scheduleAmbientAction(pet);
  });

  requestAnimationFrame(() => {
    placePets(pets);
    pets.forEach((pet) => pet.classList.add("is-ready"));
  });

  window.__petWanderTimer = window.setInterval(() => placePets(pets), 9000);
  window.__petResizeHandler = () => placePets(pets);
  window.addEventListener("resize", window.__petResizeHandler, { passive: true });
}
