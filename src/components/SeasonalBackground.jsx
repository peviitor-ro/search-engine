import { useEffect, useRef } from "react";
import { useSeasonalTheme } from "../context/seasonalThemeContext";

const NUM_STARS = 250;
const MILKY_WAY_STAR_COUNT = 600;
const HOVER_RADIUS = 150;
const MAX_FADE_OPACITY = 0.2;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function generateStarColor() {
  const spectralType = Math.random();
  let r, g, b;
  if (spectralType < 0.1) {
    r = 160;
    g = 190;
    b = 255;
  } else if (spectralType < 0.2) {
    r = 255;
    g = 100;
    b = 100;
  } else if (spectralType < 0.8) {
    r = 255;
    g = 255;
    b = 255;
  } else {
    r = 255;
    g = 230;
    b = 150;
  }
  return `${r}, ${g}, ${b}`;
}

const SeasonalBackground = () => {
  const { isWinter } = useSeasonalTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isWinter) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let rafId = null;
    const mouse = { x: null, y: null };
    const mouseNormalized = { x: 0, y: 0 };
    let parallaxX = 0;
    let parallaxY = 0;

    let snowflakes = [];
    let stars = [];
    let milkyWayStars = [];

    const milkyWay = {
      centerX: 0,
      centerY: 0,
      width: 0,
      length: 0,
      angle: -Math.PI / 20
    };

    // Pre-render a single blurred snowflake sprite to reuse across particles
    const snowTemplate = document.createElement("canvas");
    snowTemplate.width = 30;
    snowTemplate.height = 30;
    const tCtx = snowTemplate.getContext("2d");
    if (tCtx) {
      tCtx.filter = "blur(3px)";
      tCtx.fillStyle = "white";
      tCtx.beginPath();
      tCtx.arc(15, 15, 8, 0, Math.PI * 2);
      tCtx.fill();
    }

    const getFadeOpacity = (x, y) => {
      if (mouse.x === null) return 1;
      const dx = x - mouse.x;
      const dy = y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < HOVER_RADIUS) {
        return (
          MAX_FADE_OPACITY + (dist / HOVER_RADIUS) * (1 - MAX_FADE_OPACITY)
        );
      }
      return 1;
    };

    class Snowflake {
      constructor(layer = 1, initial = false) {
        this.reset(layer, initial);
      }

      reset(layer = 1, initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : Math.random() * -height;
        this.layer = layer;
        this.radius = Math.random() * (2 / layer) + 1.2;
        this.speedY = Math.random() * 1.5 * layer + 0.5;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.opacity = Math.random() * 0.4 + 0.5;
        this.windOffset = Math.random() * 100;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01 + this.windOffset) * 0.5;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 200) {
            const force = (1 - dist / 200) * 0.15;
            const angle = Math.atan2(dy, dx) + Math.PI / 2;
            this.x += Math.cos(angle) * force * 15;
            this.y += Math.sin(angle) * force * 15;
          }
        }

        if (this.y > height) {
          this.reset(this.layer);
          this.y = 0;
        }
        if (this.x > width || this.x < 0) {
          this.x = (this.x + width) % width;
        }
      }

      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(
          snowTemplate,
          this.x - this.radius * 2,
          this.y - this.radius * 2,
          this.radius * 4,
          this.radius * 4
        );
        ctx.globalAlpha = 1;
      }
    }

    const createStar = () => {
      const biasedY = Math.pow(Math.random(), 2.5) * height;
      return {
        x: Math.random() * width,
        y: biasedY,
        radius: Math.random() * 1.2 + 0.3,
        baseOpacity: Math.random() * 0.3 + 0.3,
        opacity: 0,
        flickerSpeed: Math.random() * 0.04 + 0.01,
        flickerPhase: Math.random() * Math.PI * 2,
        color: generateStarColor(),
        glow: Math.random() < 0.4
      };
    };

    const createMilkyWayStar = () => {
      const posX = (Math.random() - 0.5) * milkyWay.length;
      const posY =
        0.00002 * posX * posX + (Math.random() - 0.5) * milkyWay.width;

      const rotatedX =
        posX * Math.cos(milkyWay.angle) - posY * Math.sin(milkyWay.angle);
      const rotatedY =
        posX * Math.sin(milkyWay.angle) + posY * Math.cos(milkyWay.angle);

      return {
        x: milkyWay.centerX + rotatedX,
        y: height * 0.25 + rotatedY,
        radius: Math.random() * 0.7 + 0.2,
        baseOpacity: Math.random() * 0.4 + 0.2,
        opacity: 0,
        flickerSpeed: Math.random() * 0.05 + 0.02,
        flickerPhase: Math.random() * Math.PI * 2,
        color: generateStarColor(),
        glow: Math.random() < 0.4
      };
    };

    const drawStarInstance = (star, offsetX = 0, offsetY = 0) => {
      const x = star.x + offsetX;
      const y = star.y + offsetY;
      if (star.glow) {
        const glowRadius = star.radius * 4;
        const grad = ctx.createRadialGradient(
          x,
          y,
          star.radius,
          x,
          y,
          glowRadius
        );
        grad.addColorStop(0, `rgba(${star.color}, ${star.opacity * 0.3})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.fillStyle = `rgba(${star.color}, ${star.opacity})`;
      ctx.arc(x, y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      milkyWay.centerX = width / 2;
      milkyWay.centerY = height / 2 + 50;
      milkyWay.width = height / 4;
      milkyWay.length = width * 1.2;

      stars = Array.from({ length: NUM_STARS }, createStar);
      milkyWayStars = Array.from(
        { length: MILKY_WAY_STAR_COUNT },
        createMilkyWayStar
      );
      const snowMultiplier = width < 768 ? 0.4 : width >= 1024 ? 1.3 : 1;
      snowflakes = [];
      [
        [600, 1],
        [100, 2],
        [25, 3]
      ].forEach(([count, layer]) => {
        const scaledCount = Math.round(count * snowMultiplier);
        for (let i = 0; i < scaledCount; i++) {
          snowflakes.push(new Snowflake(layer, true));
        }
      });
    };

    const renderFrame = (shouldUpdate) => {
      ctx.clearRect(0, 0, width, height);

      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, "#0B1F3F");
      skyGrad.addColorStop(0.5, "#1A3B6F");
      skyGrad.addColorStop(1, "#4A90E2");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      if (shouldUpdate) {
        parallaxX += (mouseNormalized.x * 50 - parallaxX) * 0.01;
        parallaxY += (mouseNormalized.y * 30 - parallaxY) * 0.01;
      }

      [stars, milkyWayStars].forEach((group, idx) => {
        const factor = idx === 0 ? 0.3 : 0.2;
        for (const s of group) {
          if (shouldUpdate) {
            s.flickerPhase += s.flickerSpeed;
          }
          const baseOp = clamp(
            s.baseOpacity + Math.sin(s.flickerPhase) * 0.1,
            0.05,
            1
          );
          const ox = parallaxX * s.radius * factor;
          const oy = parallaxY * s.radius * factor;
          s.opacity = baseOp * getFadeOpacity(s.x + ox, s.y + oy);
          drawStarInstance(s, ox, oy);
        }
      });

      for (const flake of snowflakes) {
        if (shouldUpdate) {
          flake.update();
        }
        flake.draw();
      }
    };

    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animate = () => {
      renderFrame(true);
      rafId = window.requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouseNormalized.x = (e.clientX / width) * 2 - 1;
      mouseNormalized.y = (e.clientY / height) * 2 - 1;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleResize = () => {
      resize();
      if (reducedMotion) {
        renderFrame(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    resize();
    if (reducedMotion) {
      renderFrame(false);
    } else {
      animate();
    }

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isWinter]);

  if (!isWinter) return null;

  return (
    <>
      <canvas
        id="snow-canvas"
        ref={canvasRef}
        className="winter-snow-canvas"
        aria-hidden="true"
      />
      <div className="winter-lens-blur" aria-hidden="true" />
    </>
  );
};

export default SeasonalBackground;
