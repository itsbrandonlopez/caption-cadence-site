(() => {
  const demo = document.querySelector('.demo-window');
  const time = document.querySelector('#demo-time');
  const timeline = document.querySelector('.timeline');
  const playhead = document.querySelector('.playhead');
  const words = [...document.querySelectorAll('#caption-demo span')];
  const bars = [...document.querySelectorAll('.timeline i')];
  if (!demo || !time || !timeline || !playhead || !words.length || !bars.length) return;

  let started = false;
  let wordIndex = -1;
  const startFrame = 24 * 60 + 18;

  const animate = (now, startedAt) => {
    const totalElapsed = now - startedAt;
    const elapsed = totalElapsed % 3000;
    const frame = Math.floor(elapsed / 1000 * 30);
    const total = startFrame + frame;
    const frames = total % 24;
    const seconds = Math.floor(total / 24) % 60;
    const minutes = Math.floor(total / (24 * 60)) % 60;
    const hours = Math.floor(total / (24 * 60 * 60));
    time.textContent = [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':') + ':' + String(frames).padStart(2, '0');

    const nextWord = Math.min(words.length - 1, Math.floor(elapsed / (3000 / words.length)));
    if (nextWord !== wordIndex) {
      wordIndex = nextWord;
      words.forEach((word, index) => word.classList.toggle('is-active', index === wordIndex));
    }
    playhead.style.left = `${(totalElapsed % 12000) / 12000 * 100}%`;
    window.requestAnimationFrame((nextNow) => animate(nextNow, startedAt));
  };

  const start = () => {
    if (started || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    started = true;
    window.requestAnimationFrame((now) => animate(now, now));
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      start();
      observer.disconnect();
    }
  }, { threshold: 0.35 });
  observer.observe(demo);
})();
