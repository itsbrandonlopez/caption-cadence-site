(() => {
  const demo = document.querySelector('.demo-window');
  const time = document.querySelector('#demo-time');
  const words = [...document.querySelectorAll('#caption-demo span')];
  const bars = [...document.querySelectorAll('.timeline i')];
  if (!demo || !time || !words.length || !bars.length) return;

  let timer;
  let started = false;
  let wordIndex = -1;
  let frame = 0;
  const startFrame = 24 * 60 + 18;

  const renderTime = () => {
    const total = startFrame + frame;
    const frames = total % 24;
    const seconds = Math.floor(total / 24) % 60;
    const minutes = Math.floor(total / (24 * 60)) % 60;
    const hours = Math.floor(total / (24 * 60 * 60));
    time.textContent = [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':') + ':' + String(frames).padStart(2, '0');
  };

  const advance = () => {
    frame += 2;
    renderTime();
    const cycleFrames = words.length * 9;
    const cycleFrame = frame % cycleFrames;
    const nextWord = Math.floor(cycleFrame / 9);
    if (nextWord !== wordIndex) {
      wordIndex = nextWord;
      words.forEach((word, index) => word.classList.toggle('is-active', index === wordIndex));
    }
    bars.forEach((bar, index) => bar.classList.toggle('is-playing', index === wordIndex));
    demo.style.setProperty('--timeline-progress', cycleFrame / (cycleFrames - 1));
  };

  const start = () => {
    if (started) return;
    started = true;
    timer = window.setInterval(advance, 1000 / 24);
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      start();
      observer.disconnect();
    }
  }, { threshold: 0.35 });
  observer.observe(demo);

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (event) => {
    if (event.matches && timer) window.clearInterval(timer);
  });
})();
