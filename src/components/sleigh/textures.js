import * as THREE from 'three';

function makeCanvas(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return { canvas, ctx: canvas.getContext('2d') };
}

function finalizeTexture(canvas, repeatX = 1, repeatY = 1, isColor = true) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  if (isColor) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Textură procedurală de lemn (diffuse + bump)
 */
export function createWoodTextures(baseHex = '#8c1515', grainHex = '#4a0808', repeatX = 2, repeatY = 2) {
  const { canvas: colC, ctx: col } = makeCanvas(512, 512);
  const { canvas: bmpC, ctx: bmp } = makeCanvas(512, 512);

  col.fillStyle = baseHex;
  col.fillRect(0, 0, 512, 512);
  bmp.fillStyle = '#808080';
  bmp.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 240; i++) {
    const y = Math.random() * 512;
    const h = 1 + Math.random() * 4;
    const alpha = 0.08 + Math.random() * 0.22;
    col.fillStyle = grainHex;
    col.globalAlpha = alpha;
    col.fillRect(0, y, 512, h);

    const gVal = Math.floor(90 + Math.random() * 75);
    bmp.fillStyle = `rgb(${gVal},${gVal},${gVal})`;
    bmp.globalAlpha = 0.35;
    bmp.fillRect(0, y, 512, h);
  }
  col.globalAlpha = 1;
  bmp.globalAlpha = 1;

  // Fibre fine ondulate
  col.strokeStyle = grainHex;
  bmp.strokeStyle = '#606060';
  for (let i = 0; i < 60; i++) {
    const y0 = (i / 60) * 512;
    col.globalAlpha = 0.14;
    bmp.globalAlpha = 0.22;
    col.beginPath();
    bmp.beginPath();
    for (let x = 0; x <= 512; x += 16) {
      const dy = Math.sin(x * 0.02 + i * 0.6) * 5;
      if (x === 0) {
        col.moveTo(x, y0 + dy);
        bmp.moveTo(x, y0 + dy);
      } else {
        col.lineTo(x, y0 + dy);
        bmp.lineTo(x, y0 + dy);
      }
    }
    col.stroke();
    bmp.stroke();
  }

  return {
    map: finalizeTexture(colC, repeatX, repeatY, true),
    bumpMap: finalizeTexture(bmpC, repeatX, repeatY, false),
  };
}

/**
 * Textură catifea matlasată (tufted diamond velvet) pentru banchete
 */
export function createTuftedVelvetTextures() {
  const { canvas: colC, ctx: col } = makeCanvas(512, 512);
  const { canvas: bmpC, ctx: bmp } = makeCanvas(512, 512);

  col.fillStyle = '#7f1116';
  col.fillRect(0, 0, 512, 512);
  bmp.fillStyle = '#c8c8c8';
  bmp.fillRect(0, 0, 512, 512);

  // Zgomot fin de catifea
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    col.fillStyle = Math.random() > 0.5 ? 'rgba(255,180,180,0.05)' : 'rgba(20,0,0,0.07)';
    col.fillRect(x, y, 2, 2);
  }

  // Cusături romboidale
  const step = 64;
  col.strokeStyle = 'rgba(35, 4, 8, 0.55)';
  col.lineWidth = 3;
  bmp.strokeStyle = '#303030';
  bmp.lineWidth = 6;

  for (let i = -512; i <= 1024; i += step) {
    col.beginPath();
    col.moveTo(i, 0);
    col.lineTo(i + 512, 512);
    col.stroke();

    col.beginPath();
    col.moveTo(i, 0);
    col.lineTo(i - 512, 512);
    col.stroke();

    bmp.beginPath();
    bmp.moveTo(i, 0);
    bmp.lineTo(i + 512, 512);
    bmp.stroke();

    bmp.beginPath();
    bmp.moveTo(i, 0);
    bmp.lineTo(i - 512, 512);
    bmp.stroke();
  }

  // Nasturi adânciți la intersecții
  for (let y = 0; y <= 512; y += step / 2) {
    for (let x = 0; x <= 512; x += step / 2) {
      if ((Math.round(x / (step / 2)) + Math.round(y / (step / 2))) % 2 === 0) {
        const grad = bmp.createRadialGradient(x, y, 1, x, y, 10);
        grad.addColorStop(0, '#101010');
        grad.addColorStop(1, 'rgba(200,200,200,0)');
        bmp.fillStyle = grad;
        bmp.beginPath();
        bmp.arc(x, y, 10, 0, Math.PI * 2);
        bmp.fill();

        col.fillStyle = '#450a0a';
        col.beginPath();
        col.arc(x, y, 4.5, 0, Math.PI * 2);
        col.fill();
      }
    }
  }

  return {
    map: finalizeTexture(colC, 2, 1, true),
    bumpMap: finalizeTexture(bmpC, 2, 1, false),
  };
}

/**
 * Textură pânză de sac (burlap / iută țesută) pentru sacul cu cadouri
 */
export function createBurlapTextures() {
  const { canvas: colC, ctx: col } = makeCanvas(512, 512);
  const { canvas: bmpC, ctx: bmp } = makeCanvas(512, 512);

  col.fillStyle = '#8b5a2b';
  col.fillRect(0, 0, 512, 512);
  bmp.fillStyle = '#808080';
  bmp.fillRect(0, 0, 512, 512);

  const spacing = 6;
  for (let y = 0; y < 512; y += spacing) {
    const shade = 125 + Math.floor(Math.random() * 25);
    col.fillStyle = `rgb(${shade}, ${Math.floor(shade * 0.66)}, ${Math.floor(shade * 0.34)})`;
    col.fillRect(0, y, 512, 3);
    bmp.fillStyle = '#b5b5b5';
    bmp.fillRect(0, y, 512, 3);
  }

  for (let x = 0; x < 512; x += spacing) {
    const shade = 110 + Math.floor(Math.random() * 30);
    col.fillStyle = `rgba(${shade}, ${Math.floor(shade * 0.62)}, ${Math.floor(shade * 0.3)}, 0.72)`;
    col.fillRect(x, 0, 3, 512);
    bmp.fillStyle = 'rgba(220,220,220,0.6)';
    bmp.fillRect(x, 0, 3, 512);
  }

  // Pete organice subtile de uzură
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 18 + Math.random() * 45;
    const g = col.createRadialGradient(x, y, 2, x, y, r);
    g.addColorStop(0, 'rgba(65, 35, 12, 0.14)');
    g.addColorStop(1, 'rgba(65, 35, 12, 0)');
    col.fillStyle = g;
    col.beginPath();
    col.arc(x, y, r, 0, Math.PI * 2);
    col.fill();
  }

  return {
    map: finalizeTexture(colC, 3, 3, true),
    bumpMap: finalizeTexture(bmpC, 3, 3, false),
  };
}

/**
 * Textură stofă de lână / blană moale (bump map + zgomot subtil)
 */
export function createFabricBumpTexture(repeat = 4) {
  const { canvas, ctx } = makeCanvas(256, 256);
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 12000; i++) {
    const v = 90 + Math.floor(Math.random() * 85);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  return finalizeTexture(canvas, repeat, repeat, false);
}

/**
 * Hârtie de împachetat festivă (dungi, stele sau carouri)
 */
export function createWrappingPaperTexture(bgHex, accentHex, pattern = 'stripes') {
  const { canvas, ctx } = makeCanvas(256, 256);
  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = accentHex;
  ctx.strokeStyle = accentHex;

  if (pattern === 'stripes') {
    ctx.lineWidth = 10;
    for (let i = -256; i < 512; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 256, 256);
      ctx.stroke();
    }
  } else if (pattern === 'plaid') {
    ctx.globalAlpha = 0.45;
    for (let i = 0; i < 256; i += 32) {
      ctx.fillRect(i, 0, 10, 256);
      ctx.fillRect(0, i, 256, 10);
    }
    ctx.globalAlpha = 1;
  } else {
    // Stele / buline aurii
    for (let y = 16; y < 256; y += 32) {
      for (let x = 16; x < 256; x += 32) {
        const ox = (Math.floor(y / 32) % 2) * 16;
        ctx.beginPath();
        ctx.arc((x + ox) % 256, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  return finalizeTexture(canvas, 1, 1, true);
}

/**
 * Textură realistă de piele (pori fini, variații tonale calde)
 */
export function createSkinTextures(baseHex = '#eec1a3', blushHex = '#d97b6c') {
  const { canvas: colC, ctx: col } = makeCanvas(512, 512);
  const { canvas: bmpC, ctx: bmp } = makeCanvas(512, 512);

  col.fillStyle = baseHex;
  col.fillRect(0, 0, 512, 512);
  bmp.fillStyle = '#808080';
  bmp.fillRect(0, 0, 512, 512);

  // Variații subtile organice de pigment
  for (let i = 0; i < 160; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 10 + Math.random() * 36;
    const g = col.createRadialGradient(x, y, 1, x, y, r);
    g.addColorStop(0, i % 3 === 0 ? 'rgba(215, 120, 105, 0.06)' : 'rgba(255, 235, 215, 0.05)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    col.fillStyle = g;
    col.beginPath();
    col.arc(x, y, r, 0, Math.PI * 2);
    col.fill();
  }

  // Roșeață naturală pe obraji/nas (zona frontală a UV-ului sferei, u ~ 0.25, v ~ 0.5)
  const addFlush = (cx, cy, rad, alpha) => {
    const g = col.createRadialGradient(cx, cy, 2, cx, cy, rad);
    g.addColorStop(0, blushHex);
    g.addColorStop(1, 'rgba(217,123,108,0)');
    col.globalAlpha = alpha;
    col.fillStyle = g;
    col.beginPath();
    col.arc(cx, cy, rad, 0, Math.PI * 2);
    col.fill();
    col.globalAlpha = 1;
  };
  addFlush(128, 270, 55, 0.22);

  // Pori fini în bump map
  for (let i = 0; i < 9000; i++) {
    const v = 112 + Math.floor(Math.random() * 32);
    bmp.fillStyle = `rgb(${v},${v},${v})`;
    bmp.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5);
  }

  return {
    map: finalizeTexture(colC, 1, 1, true),
    bumpMap: finalizeTexture(bmpC, 2, 2, false),
  };
}

/**
 * Textură procedurală de fire de păr / barbă pieptănată (diffuse + bump)
 */
export function createHairStrandTextures(baseHex = '#f1f5f9', shadowHex = '#cbd5e1') {
  const { canvas: colC, ctx: col } = makeCanvas(512, 512);
  const { canvas: bmpC, ctx: bmp } = makeCanvas(512, 512);

  col.fillStyle = baseHex;
  col.fillRect(0, 0, 512, 512);
  bmp.fillStyle = '#808080';
  bmp.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 650; i++) {
    const x = Math.random() * 512;
    const w = 1 + Math.random() * 2.4;
    col.strokeStyle = i % 2 === 0 ? shadowHex : baseHex;
    col.globalAlpha = 0.25 + Math.random() * 0.4;
    col.lineWidth = w;
    col.beginPath();
    col.moveTo(x, 0);
    for (let y = 0; y <= 512; y += 32) {
      col.lineTo(x + Math.sin(y * 0.03 + i) * 3.5, y);
    }
    col.stroke();

    const gVal = 70 + Math.floor(Math.random() * 140);
    bmp.strokeStyle = `rgb(${gVal},${gVal},${gVal})`;
    bmp.globalAlpha = 0.55;
    bmp.lineWidth = w;
    bmp.beginPath();
    bmp.moveTo(x, 0);
    for (let y = 0; y <= 512; y += 32) {
      bmp.lineTo(x + Math.sin(y * 0.03 + i) * 3.5, y);
    }
    bmp.stroke();
  }
  col.globalAlpha = 1;
  bmp.globalAlpha = 1;

  return {
    map: finalizeTexture(colC, 2, 2, true),
    bumpMap: finalizeTexture(bmpC, 2, 2, false),
  };
}

/**
 * Textură moale, rotundă și curată de fulg (alb pur — nuanța aurie e aplicată o singură dată în shader)
 */
export function createSnowflakeTexture() {
  const size = 128;
  const { canvas, ctx } = makeCanvas(size, size);
  const cx = size / 2;
  const cy = size / 2;

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 52);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.38, 'rgba(255, 255, 255, 0.92)');
  grad.addColorStop(0.68, 'rgba(255, 255, 255, 0.35)');
  grad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Plăcuță festivă aurie cu text clar pentru spatele saniei
 */
export function createBackSignTexture(text = 'JOBURI LA SAC!') {
  const w = 1024;
  const h = 440;
  const { canvas, ctx } = makeCanvas(w, h);

  ctx.clearRect(0, 0, w, h);

  // Ramă festivă aurie cu colțuri rotunjite
  const pad = 28;
  const r = 42;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(pad + r, pad);
  ctx.lineTo(w - pad - r, pad);
  ctx.quadraticCurveTo(w - pad, pad, w - pad, pad + r);
  ctx.lineTo(w - pad, h - pad - r);
  ctx.quadraticCurveTo(w - pad, h - pad, w - pad - r, h - pad);
  ctx.lineTo(pad + r, h - pad);
  ctx.quadraticCurveTo(pad, h - pad, pad, h - pad - r);
  ctx.lineTo(pad, pad + r);
  ctx.quadraticCurveTo(pad, pad, pad + r, pad);
  ctx.closePath();

  // Fundal subtil vișiniu închis pentru contrast excelent
  ctx.fillStyle = 'rgba(72, 8, 14, 0.72)';
  ctx.fill();

  // Chenar dublu auriu
  const goldGrad = ctx.createLinearGradient(0, 0, w, h);
  goldGrad.addColorStop(0, '#fde68a');
  goldGrad.addColorStop(0.5, '#f59e0b');
  goldGrad.addColorStop(1, '#fef08a');
  ctx.lineWidth = 10;
  ctx.strokeStyle = goldGrad;
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.55)';
  ctx.strokeRect(pad + 18, pad + 18, w - (pad + 18) * 2, h - (pad + 18) * 2);
  ctx.restore();

  // Stele mici decorative în colțuri
  const drawStar = (cx, cy, rad) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 === 0 ? rad : rad * 0.45;
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      if (i === 0) ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
      else ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  drawStar(86, 86, 18);
  drawStar(w - 86, 86, 18);
  drawStar(86, h - 86, 18);
  drawStar(w - 86, h - 86, 18);

  // Text principal mare, clar și ușor de citit
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 94px "Segoe UI", Arial, sans-serif';

  // Umbră pentru lizibilitate maximă
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 6;

  // Contur subtil + umplere crem-aurie luminoasă
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#5c120b';
  ctx.strokeText(text, w / 2, h / 2 + 4, w - 160);

  const textGrad = ctx.createLinearGradient(0, h * 0.3, 0, h * 0.72);
  textGrad.addColorStop(0, '#fffbeb');
  textGrad.addColorStop(0.55, '#fde68a');
  textGrad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = textGrad;
  ctx.fillText(text, w / 2, h / 2 + 4, w - 160);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
