/* =========================================================
   رحلة الأكواد في أعماق البحر — محرك الشرائح + مشهد Canvas
========================================================= */

/* ============================================================
   1) إعداد الـ Canvas
============================================================ */
const canvas = document.getElementById('ocean-canvas');
const ctx = canvas.getContext('2d');
let W = 0, H = 0;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* ============================================================
   2) بيانات دروس السمك (كل سمكة ليها لون + شكل في الكانفاس)
============================================================ */
const fishLessons = [
  { emoji: '🐟', color: '#FFD23F', title: 'السمكة الصفراء: هيكل الصفحة',
    desc: 'كل صفحة HTML لازم تبدأ بجملة سحرية تقول للمتصفح "دي صفحة HTML"، وبعدين جوه بيت اسمه html وفيه غرفتين: head و body.',
    code: `&lt;<span class="tag">!DOCTYPE html</span>&gt;
&lt;<span class="tag">html</span> <span class="attr">lang</span>=<span class="str">"ar"</span>&gt;
  &lt;<span class="tag">head</span>&gt;...&lt;/<span class="tag">head</span>&gt;
  &lt;<span class="tag">body</span>&gt;...&lt;/<span class="tag">body</span>&gt;
&lt;/<span class="tag">html</span>&gt;` },
  { emoji: '🐠', color: '#FF9F1C', title: 'سمكة المهرج: العناوين والفقرات',
    desc: 'لما نحب نكتب عنوان كبير بنستخدم h1، ولما نحب نكتب كلام عادي بنستخدم p.',
    code: `&lt;<span class="tag">h1</span>&gt;عنوان كبير&lt;/<span class="tag">h1</span>&gt;
&lt;<span class="tag">p</span>&gt;ده كلام عادي (فقرة)&lt;/<span class="tag">p</span>&gt;` },
  { emoji: '🐡', color: '#2EC4B6', title: 'سمكة النفخة: الصندوق div',
    desc: 'وسم div ده زي صندوق فاضي بنحط جواه أي حاجة عشان نجمعها مع بعض ونتحكم فيها بسهولة.',
    code: `&lt;<span class="tag">div</span> <span class="attr">class</span>=<span class="str">"card"</span>&gt;
  محتوى الكارت هنا
&lt;/<span class="tag">div</span>&gt;` },
  { emoji: '🦈', color: '#6EC6FF', title: 'القرش اللطيف: ربط CSS',
    desc: 'عشان نلوّن ونزوّق صفحتنا، بنربطها بملف CSS خارجي جوه head باستخدام وسم link.',
    code: `&lt;<span class="tag">link</span> <span class="attr">rel</span>=<span class="str">"stylesheet"</span>
      <span class="attr">href</span>=<span class="str">"style.css"</span>&gt;` },
  { emoji: '🐙', color: '#B983FF', title: 'الأخطبوط: الألوان والتدرج',
    desc: 'خاصية background بتلوّن الخلفية، وممكن نستخدم linear-gradient عشان نعمل تدرج بين لونين زي غروب الشمس.',
    code: `.card {
  <span class="prop">background</span>: <span class="val">linear-gradient(135deg, #ff9a9e, #fad0c4)</span>;
}` },
  { emoji: '🦑', color: '#FF6B9D', title: 'الحبار: الفليكس بوكس',
    desc: 'display: flex بيخلي توسيط أي عنصر (يمين شمال وفوق تحت) حاجة سهلة جدًا.',
    code: `.box {
  <span class="prop">display</span>: <span class="val">flex</span>;
  <span class="prop">align-items</span>: <span class="val">center</span>;
  <span class="prop">justify-content</span>: <span class="val">center</span>;
}` },
  { emoji: '🐚', color: '#FFB627', title: 'المحارة: حواف دايرية وظل',
    desc: 'border-radius بيخلي زوايا العنصر مدورة زي المحارة، وbox-shadow بيدي إحساس إن العنصر واقف فوق السطح.',
    code: `.card {
  <span class="prop">border-radius</span>: <span class="val">20px</span>;
  <span class="prop">box-shadow</span>: <span class="val">0 10px 30px rgba(0,0,0,0.3)</span>;
}` },
  { emoji: '🦀', color: '#FF6B6B', title: 'السلطعون: البعد الثالث',
    desc: 'perspective بيدي إحساس بالعمق، وtransform-style: preserve-3d بيخلي العناصر جوه تتلف في الفراغ الحقيقي مش بس تتفرطح.',
    code: `.scene {
  <span class="prop">perspective</span>: <span class="val">1000px</span>;
}
.card {
  <span class="prop">transform-style</span>: <span class="val">preserve-3d</span>;
}` },
  { emoji: '🐢', color: '#06A77D', title: 'السلحفاة: اللفة السحرية',
    desc: 'خاصية transform: rotateY() بتلف العنصر حوالين نفسه زي ما السلحفاة بتلف في قوقعتها.',
    code: `.card {
  <span class="prop">transform</span>: <span class="val">rotateY(180deg)</span>;
}` },
  { emoji: '🐬', color: '#4CC9F0', title: 'الدولفين: الحركة الناعمة',
    desc: 'transition بيخلي أي تغيير يحصل بهدوء مش فجأة، وhover بيشغل تأثير لما الماوس يوقف على العنصر.',
    code: `.card {
  <span class="prop">transition</span>: <span class="val">transform 0.8s ease</span>;
}
.scene:<span class="attr">hover</span> .card {
  <span class="prop">transform</span>: <span class="val">rotateY(180deg)</span>;
}` }
];

/* ============================================================
   3) أسئلة اللعبة (20 سؤال)
============================================================ */
const quizData = [
  { q: 'أول سطر لازم نكتبه في أي صفحة HTML؟', options: ['<html>', '<!DOCTYPE html>', '<head>', '<body>'], correct: 1 },
  { q: 'الوسم اللي بيكتب بيه أكبر عنوان في الصفحة؟', options: ['<p>', '<h6>', '<h1>', '<div>'], correct: 2 },
  { q: 'علشان نكتب فقرة نص عادية بنستخدم وسم؟', options: ['<p>', '<span>', '<img>', '<link>'], correct: 0 },
  { q: 'الوسم اللي بيتستخدم كصندوق لتجميع عناصر تانية؟', options: ['<div>', '<a>', '<ul>', '<br>'], correct: 0 },
  { q: 'إزاي بنربط ملف CSS خارجي بصفحة HTML؟', options: ['<style src="">', '<link rel="stylesheet" href="style.css">', '<css>style.css</css>', '<script src="style.css">'], correct: 1 },
  { q: 'خاصية CSS اللي بنلوّن بيها خلفية عنصر؟', options: ['color', 'background', 'border', 'font'], correct: 1 },
  { q: 'عشان نعمل تدرج لوني (Gradient) بنستخدم؟', options: ['linear-gradient()', 'color-mix()', 'gradient-color()', 'mix-blend-mode()'], correct: 0 },
  { q: 'خاصية CSS اللي بتخلي العناصر جنب بعض وتتوسط بسهولة؟', options: ['display: block', 'display: flex', 'display: none', 'display: table'], correct: 1 },
  { q: 'لتوسيط العناصر أفقيًا جوه flex بنستخدم؟', options: ['justify-content: center', 'align-items: center', 'text-align: right', 'float: center'], correct: 0 },
  { q: 'لتوسيط العناصر رأسيًا جوه flex بنستخدم؟', options: ['justify-content', 'align-items: center', 'vertical-align', 'margin: auto'], correct: 1 },
  { q: 'خاصية بتخلي زوايا العنصر مدورة؟', options: ['border-style', 'border-radius', 'corner-radius', 'round-edges'], correct: 1 },
  { q: 'خاصية بتضيف ظل تحت العنصر؟', options: ['shadow-box', 'box-shadow', 'drop-shadow', 'text-shadow فقط'], correct: 1 },
  { q: 'خاصية CSS اللي بتديك إحساس بالعمق (البعد التالت)؟', options: ['perspective', 'depth', 'z-view', '3d-space'], correct: 0 },
  { q: 'الخاصية اللي بتخلي العناصر الجواها تحافظ على وضعها ثلاثي الأبعاد؟', options: ['transform-style: preserve-3d', 'position: 3d', 'display: 3d', 'render: solid'], correct: 0 },
  { q: 'الخاصية اللي بنستخدمها عشان نلف عنصر حوالين محور رأسي؟', options: ['rotateX()', 'rotateY()', 'rotateZ()', 'skew()'], correct: 1 },
  { q: 'علشان اللفة تبقى سلسة ومش فجأة بنستخدم خاصية؟', options: ['transition', 'animation-delay', 'smooth', 'ease-only'], correct: 0 },
  { q: 'الحدث اللي بيخلي تأثير يحصل لما الماوس يوقف على عنصر؟', options: [':active', ':focus', ':hover', ':click'], correct: 2 },
  { q: 'خاصية بتخفي الوش الخلفي للعنصر وقت اللفة؟', options: ['backface-visibility: hidden', 'hide-back: true', 'face-visibility: none', 'back-display: hidden'], correct: 0 },
  { q: 'أي امتداد بيتحفظ بيه ملف الأنماط (التنسيقات)؟', options: ['.html', '.js', '.css', '.txt'], correct: 2 },
  { q: 'إيه المعنى الصح لـ HTML؟', options: ['لغة برمجة كاملة', 'لغة توصيف صفحات الويب', 'قاعدة بيانات', 'نوع خط'], correct: 1 }
];

/* ============================================================
   4) مشهد الـ Canvas: فقاعات + حشائش + سمك + حوت
============================================================ */

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

// فقاعات
const bubbleParticles = [];
for (let i = 0; i < 40; i++) {
  bubbleParticles.push({
    x: Math.random() * 1600,
    y: Math.random() * 900,
    r: 3 + Math.random() * 10,
    speed: 20 + Math.random() * 40,
    wobble: Math.random() * Math.PI * 2
  });
}

// حشائش
const seaweeds = [];
for (let i = 0; i < 9; i++) {
  seaweeds.push({
    xRatio: (i + 0.5) / 9,
    height: 60 + Math.random() * 70,
    phase: Math.random() * Math.PI * 2,
    color: i % 2 === 0 ? '#0E5C4A' : '#0A7A5C'
  });
}

// السمك: سمكة لكل درس، لونها بيتحدد من fishLessons
const oceanFish = fishLessons.map((f, i) => ({
  id: i,
  color: f.color,
  rgb: hexToRgb(f.color),
  laneRatio: (i + 0.5) / fishLessons.length,
  x: Math.random() * 1600,
  dir: Math.random() > 0.5 ? 1 : -1,
  speed: 22 + Math.random() * 18,
  bobPhase: Math.random() * Math.PI * 2,
  size: 16 + Math.random() * 6,
  // موضع حالي (متحدث كل فريم)، بيستخدم في اختبار الضغط بالماوس
  curX: 0, curY: 0, curSize: 16,
  active: false
}));

let activeFishIndex = null; // السمكة اللي بتشرح دلوقتي
let whaleVisible = true;

const whale = { bobPhase: 0, bubbleTimer: 0 };

function setActiveFish(index) {
  oceanFish.forEach(f => f.active = false);
  activeFishIndex = index;
  if (index !== null) oceanFish[index].active = true;
}
function setWhaleVisible(v) { whaleVisible = v; }

/* ------------------- رسم عنصر سمكة ------------------- */
function drawFish(f, x, y, size, facing, glow) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);

  if (glow) {
    ctx.shadowColor = f.color;
    ctx.shadowBlur = 26;
  }

  // الذيل
  const wag = Math.sin(performance.now() / 140 + f.bobPhase) * 0.35;
  ctx.save();
  ctx.translate(-size * 1.05, 0);
  ctx.rotate(wag);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-size * 0.9, -size * 0.6);
  ctx.lineTo(-size * 0.9, size * 0.6);
  ctx.closePath();
  ctx.fillStyle = f.color;
  ctx.globalAlpha = 0.9;
  ctx.fill();
  ctx.restore();

  // الجسم
  ctx.beginPath();
  ctx.ellipse(0, 0, size, size * 0.68, 0, 0, Math.PI * 2);
  const grad = ctx.createLinearGradient(-size, -size, size, size);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.35, f.color);
  grad.addColorStop(1, f.color);
  ctx.fillStyle = grad;
  ctx.globalAlpha = 1;
  ctx.fill();

  // الزعنفة العلوية
  ctx.beginPath();
  ctx.moveTo(-size * 0.15, -size * 0.55);
  ctx.lineTo(size * 0.15, -size * 0.55);
  ctx.lineTo(0, -size * 1.05);
  ctx.closePath();
  ctx.fillStyle = f.color;
  ctx.fill();

  ctx.shadowBlur = 0;

  // العين
  ctx.beginPath();
  ctx.arc(size * 0.42, -size * 0.08, size * 0.17, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(size * 0.47, -size * 0.08, size * 0.08, 0, Math.PI * 2);
  ctx.fillStyle = '#072742';
  ctx.fill();

  ctx.restore();
}

/* ------------------- رسم الحوت ------------------- */
function drawWhale(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // الذيل
  const wag = Math.sin(performance.now() / 500) * 0.25;
  ctx.save();
  ctx.translate(-95, 0);
  ctx.rotate(wag);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-40, -30);
  ctx.lineTo(-30, 0);
  ctx.lineTo(-40, 30);
  ctx.closePath();
  ctx.fillStyle = '#3E7CB1';
  ctx.fill();
  ctx.restore();

  // الجسم
  ctx.beginPath();
  ctx.ellipse(0, 0, 95, 55, 0, 0, Math.PI * 2);
  const g = ctx.createLinearGradient(-95, -55, 95, 55);
  g.addColorStop(0, '#6FB1E0');
  g.addColorStop(1, '#2C5C8A');
  ctx.fillStyle = g;
  ctx.fill();

  // البطن الفاتح
  ctx.beginPath();
  ctx.ellipse(5, 20, 70, 26, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#EAF6F6';
  ctx.globalAlpha = 0.9;
  ctx.fill();
  ctx.globalAlpha = 1;

  // العين
  ctx.beginPath();
  ctx.arc(48, -12, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#072742';
  ctx.fill();

  // الابتسامة
  ctx.beginPath();
  ctx.arc(35, 10, 22, 0.15 * Math.PI, 0.5 * Math.PI);
  ctx.strokeStyle = '#072742';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.restore();

  // نافورة فقاعات من فوق راسه بين الحين والتاني
  whale.bubbleTimer -= 1;
  if (whaleVisible && whale.bubbleTimer <= 0) {
    whale.bubbleTimer = 90 + Math.random() * 60;
    bubbleParticles.push({
      x: x + 20 * scale, y: y - 60 * scale,
      r: 4 + Math.random() * 6, speed: 40 + Math.random() * 20,
      wobble: Math.random() * Math.PI * 2
    });
  }
}

/* ------------------- حلقة الرسم ------------------- */
let lastTime = performance.now();

function drawScene(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  // خلفية بحرية متدرجة
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0B2E52');
  bg.addColorStop(0.35, '#082446');
  bg.addColorStop(0.7, '#061C38');
  bg.addColorStop(1, '#03101F');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // أشعة شمس خفيفة
  ctx.save();
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    const rx = W * (0.15 + i * 0.25) + Math.sin(now / 4000 + i) * 30;
    ctx.moveTo(rx, 0);
    ctx.lineTo(rx - 60, H);
    ctx.lineTo(rx + 60, H);
    ctx.closePath();
    ctx.fillStyle = '#BEEFEA';
    ctx.fill();
  }
  ctx.restore();

  // حشائش البحر
  seaweeds.forEach(s => {
    const baseX = s.xRatio * W;
    ctx.beginPath();
    ctx.moveTo(baseX, H);
    const sway = Math.sin(now / 900 + s.phase) * 22;
    ctx.quadraticCurveTo(baseX + sway, H - s.height * 0.6, baseX + sway * 0.5, H - s.height);
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();
  });

  // فقاعات
  bubbleParticles.forEach(b => {
    b.y -= b.speed * dt;
    b.x += Math.sin(now / 600 + b.wobble) * 0.4;
    if (b.y < -20) {
      b.y = H + 20;
      b.x = Math.random() * W;
    }
    ctx.beginPath();
    ctx.arc(b.x % W, b.y, b.r, 0, Math.PI * 2);
    const bg2 = ctx.createRadialGradient(b.x % W - b.r * 0.3, b.y - b.r * 0.3, 1, b.x % W, b.y, b.r);
    bg2.addColorStop(0, 'rgba(255,255,255,0.9)');
    bg2.addColorStop(1, 'rgba(255,255,255,0.05)');
    ctx.fillStyle = bg2;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // الحوت (في شرائح الترحيب / تمهيد اللعبة / النتيجة)
  if (whaleVisible) {
    const wx = W * 0.5;
    const wy = H * 0.22 + Math.sin(now / 1000) * 10;
    drawWhale(wx, wy, Math.min(W, H) / 900 + 0.6);
  }

  // السمك
  oceanFish.forEach(f => {
    if (f.active) {
      // السمكة النشطة: تسبح لمكان مميز وتكبر وتلمع
      const targetX = W * 0.87;
      const targetY = H * (whaleVisible ? 0.55 : 0.28) + Math.sin(now / 500 + f.bobPhase) * 14;
      f.curX += (targetX - f.curX) * Math.min(dt * 3, 1);
      f.curY += (targetY - f.curY) * Math.min(dt * 3, 1);
      f.curSize += (f.size * 2.1 - f.curSize) * Math.min(dt * 3, 1);
      const pulse = 1 + Math.sin(now / 260) * 0.06;
      drawFish(f, f.curX, f.curY, f.curSize * pulse, -1, true);
    } else {
      // سباحة عشوائية هادئة في الخلفية
      f.x += f.dir * f.speed * dt;
      if (f.x > W + 60) { f.x = -60; }
      if (f.x < -60) { f.x = W + 60; }
      const laneY = H * (0.35 + 0.55 * f.laneRatio);
      const y = laneY + Math.sin(now / 800 + f.bobPhase) * 18;
      f.curX = f.x; f.curY = y; f.curSize = f.size;
      drawFish(f, f.x, y, f.size, f.dir, false);
    }
  });

  requestAnimationFrame(drawScene);
}
requestAnimationFrame(drawScene);

/* ضغطة الماوس/اللمس على السمكة النشطة تفتح/تقفل صندوق الكود */
canvas.addEventListener('click', (e) => {
  if (activeFishIndex === null) return;
  const f = oceanFish[activeFishIndex];
  const dx = e.clientX - f.curX;
  const dy = e.clientY - f.curY;
  if (Math.sqrt(dx * dx + dy * dy) < f.curSize * 1.6) {
    toggleCodeReveal();
  }
});

/* ============================================================
   5) محرك الشرائح (نفس فكرة الدرس، لكن مربوط بمشهد الكانفاس)
============================================================ */

const slides = [];
slides.push({ type: 'intro' });
fishLessons.forEach((f, i) => slides.push({ type: 'fish', data: f, fIndex: i }));
slides.push({ type: 'quizintro' });
quizData.forEach((q, i) => slides.push({ type: 'quiz', data: q, qIndex: i }));
slides.push({ type: 'result' });

const quizAnswers = new Array(quizData.length).fill(null);

const slideContent = document.getElementById('slide-content');
const progressFill = document.getElementById('progress-fill');
const slideCounter = document.getElementById('slide-counter');
const sectionPill = document.getElementById('section-pill');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let current = 0;

function esc(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function toggleCodeReveal() {
  const codeBox = document.getElementById('code-box');
  const revealBtn = document.getElementById('reveal-btn');
  if (!codeBox || !revealBtn) return;
  codeBox.classList.toggle('open');
  revealBtn.textContent = codeBox.classList.contains('open') ? 'اقفل صندوق الكود 🔒' : 'افتح صندوق الكود ✨';
}

function renderSlide() {
  const s = slides[current];
  let html = '';

  setWhaleVisible(s.type === 'intro' || s.type === 'quizintro' || s.type === 'result');
  setActiveFish(s.type === 'fish' ? s.fIndex : null);

  if (s.type === 'intro') {
    sectionPill.textContent = 'مقدمة';
    html = `
      <div class="intro-slide">
        <div class="whale-bubble">هاي! 👋 أنا كودي الحوت</div>
        <div class="slide-title">جاهز نغوص سوا؟</div>
        <div class="slide-text">هنغوص لقاع البحر، وكل سمكة هناخد بالنا منها هتعلمنا حاجة جديدة عن HTML و CSS. دوس "التالي" عشان نبدأ الرحلة! 🤿</div>
      </div>`;
  }

  else if (s.type === 'fish') {
    sectionPill.textContent = 'مدرسة السمك';
    const f = s.data;
    html = `
      <div class="fish-slide" style="--fish-color:${f.color}">
        <div class="slide-title">${f.emoji} ${esc(f.title)}</div>
        <div class="slide-text">${esc(f.desc)}</div>
        <button class="reveal-btn" id="reveal-btn">افتح صندوق الكود ✨</button>
        <div class="code-box" id="code-box"><pre><code>${f.code}</code></pre></div>
      </div>`;
  }

  else if (s.type === 'quizintro') {
    sectionPill.textContent = 'قبل اللعب';
    html = `
      <div class="quiz-intro-slide">
        <div class="slide-title">🏆 جهز نفسك للعب!</div>
        <div class="slide-text">دلوقتي هنلعب لعبة فيها 20 سؤال عن كل حاجة اتعلمناها مع السمك. جاوب صح واكسب نجوم، ولو غلطت مش هتفرق حاجة، هتتعلم من كودي الحوت وتكمل. يلا بينا! 🎮</div>
      </div>`;
  }

  else if (s.type === 'quiz') {
    sectionPill.textContent = `لعبة الأسئلة (${s.qIndex + 1}/${quizData.length})`;
    const item = s.data;
    const chosen = quizAnswers[s.qIndex];
    html = `
      <div class="quiz-slide">
        <div class="quiz-progress">السؤال ${s.qIndex + 1} من ${quizData.length}</div>
        <div class="quiz-question">${esc(item.q)}</div>
        <div class="quiz-options">
          ${item.options.map((opt, i) => `<button class="quiz-option" data-i="${i}" ${chosen !== null ? 'disabled' : ''}>${esc(opt)}</button>`).join('')}
        </div>
        <div class="quiz-feedback" id="quiz-feedback"></div>
      </div>`;
  }

  else if (s.type === 'result') {
    sectionPill.textContent = 'النتيجة';
    const score = quizAnswers.filter((a, i) => a === quizData[i].correct).length;
    let emoji, title, msg;
    if (score >= 18) { emoji = '🏆'; title = 'بطل الأكواد الأسطوري!'; msg = 'مستحيل! انت فاهم HTML و CSS زي المحترفين. كودي الحوت فخور بيك جدًا 🐋💙'; }
    else if (score >= 12) { emoji = '🐬'; title = 'غواص محترف!'; msg = 'شغل حلو أوي! فاهم أغلب الحاجات، كمّل كده وهتبقى بطل قريب.'; }
    else if (score >= 6) { emoji = '🐠'; title = 'لسه بتتعلم، برافو عليك!'; msg = 'خطوة كويسة! جرّب ترجع تقرا كلام الأسماك تاني وتحاول من جديد.'; }
    else { emoji = '🐟'; title = 'يلا بينا نغوص تاني!'; msg = 'مفيش مشكلة، كل بطل بيقع الأول. ارجع لمدرسة السمك وذاكر الدروس تاني ثم جرب من جديد.'; }

    html = `
      <div class="result-slide">
        <div class="result-emoji">${emoji}</div>
        <div class="result-title">${title}</div>
        <div class="result-score">نتيجتك: ${score} من ${quizData.length}</div>
        <div class="result-msg">${msg}</div>
        <button class="retry-btn" id="retry-btn">إلعب تاني 🔄</button>
      </div>`;
  }

  slideContent.innerHTML = html;
  slideContent.classList.remove('slide');
  void slideContent.offsetWidth;
  slideContent.classList.add('slide');

  attachSlideEvents(s);
  updateNav();
}

function attachSlideEvents(s) {
  if (s.type === 'fish') {
    document.getElementById('reveal-btn').addEventListener('click', toggleCodeReveal);
  }

  if (s.type === 'quiz') {
    const buttons = slideContent.querySelectorAll('.quiz-option');
    const item = s.data;
    const chosen = quizAnswers[s.qIndex];
    const feedback = document.getElementById('quiz-feedback');

    if (chosen !== null) {
      buttons.forEach((b, i) => {
        if (i === item.correct) b.classList.add('correct');
        else if (i === chosen) b.classList.add('wrong');
      });
      feedback.textContent = chosen === item.correct ? 'صح! برافو عليك 🎉' : 'شوف الإجابة الصح باللون الأخضر 🐠';
      feedback.style.color = chosen === item.correct ? '#06A77D' : '#FF6B6B';
    } else {
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const choice = parseInt(btn.dataset.i);
          quizAnswers[s.qIndex] = choice;
          buttons.forEach(b => b.disabled = true);
          if (choice === item.correct) {
            btn.classList.add('correct');
            feedback.textContent = 'صح! برافو عليك 🎉';
            feedback.style.color = '#06A77D';
          } else {
            btn.classList.add('wrong');
            buttons[item.correct].classList.add('correct');
            feedback.textContent = 'مش قلق، شوف الإجابة الصح باللون الأخضر 🐠';
            feedback.style.color = '#FF6B6B';
          }
          updateNav();
        });
      });
    }
  }

  if (s.type === 'result') {
    document.getElementById('retry-btn').addEventListener('click', () => {
      quizAnswers.fill(null);
      current = slides.findIndex(sl => sl.type === 'quizintro');
      renderSlide();
    });
    const score = quizAnswers.filter((a, i) => a === quizData[i].correct).length;
    if (score >= 12) launchConfetti();
  }
}

function updateNav() {
  const s = slides[current];
  prevBtn.disabled = current === 0;

  if (s.type === 'quiz' && quizAnswers[s.qIndex] === null) nextBtn.disabled = true;
  else if (s.type === 'result') nextBtn.disabled = true;
  else nextBtn.disabled = false;

  const nextSlide = slides[current + 1];
  nextBtn.textContent = (nextSlide && nextSlide.type === 'result') ? 'شوف نتيجتي 🏆' : 'التالي ⬅';

  slideCounter.textContent = `شريحة ${current + 1} من ${slides.length}`;
  progressFill.style.width = `${((current + 1) / slides.length) * 100}%`;
}

prevBtn.addEventListener('click', () => { if (current > 0) { current--; renderSlide(); } });
nextBtn.addEventListener('click', () => { if (current < slides.length - 1) { current++; renderSlide(); } });

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && !nextBtn.disabled) nextBtn.click();
  if (e.key === 'ArrowRight' && !prevBtn.disabled) prevBtn.click();
});

let touchStartX = null;
document.querySelector('.slide-viewport').addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; });
document.querySelector('.slide-viewport').addEventListener('touchend', (e) => {
  if (touchStartX === null) return;
  const diff = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diff) > 60) {
    if (diff < 0 && !nextBtn.disabled) nextBtn.click();
    if (diff > 0 && !prevBtn.disabled) prevBtn.click();
  }
  touchStartX = null;
});

renderSlide();

/* ============================================================
   6) احتفال بالكونفيتي
============================================================ */
function launchConfetti() {
  const layer = document.getElementById('confetti');
  const colors = ['#FFB627', '#2EC4B6', '#FF6B6B', '#06A77D', '#4CC9F0'];
  for (let i = 0; i < 90; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.width = (6 + Math.random() * 6) + 'px';
    piece.style.height = (10 + Math.random() * 10) + 'px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2.5 + Math.random() * 2) + 's';
    piece.style.animationDelay = (Math.random() * 0.6) + 's';
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 5500);
  }
}