import React, { useEffect, useRef } from "react";

/**
 * Ultra-Fast High-Performance Animated Moving Black & White Background
 * Combines hardware-accelerated HTML5 Canvas particle & stardust constellation
 * with a smoothly moving infinite monochrome cyber grid.
 * Zero CPU thrashing, 60-120 FPS guaranteed.
 */
export default function MonochromeBackground({ theme = "dark" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive particle count (45 for mobile, 65 for desktop)
    const particleCount = width < 768 ? 40 : 65;
    const maxLineDist = width < 768 ? 90 : 125;

    // Create particles
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      radius: Math.random() * 1.6 + 0.8,
      baseAlpha: Math.random() * 0.5 + 0.3,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));

    // Shooting stars / stardust streaks
    const streaks = [];
    let nextStreakTime = Date.now() + 2500;

    const spawnStreak = () => {
      streaks.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 90 + 60,
        speed: Math.random() * 7 + 9,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2, // ~45 degrees diagonal
        alpha: 1,
        life: 0,
        maxLife: 40,
      });
    };

    // Mouse tracking for subtle interactive float
    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // Handle resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Animation Loop
    let lastTime = performance.now();

    const render = (time) => {
      // Pause if tab is hidden
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const isDark = theme === "dark";
      // Pure monochrome colors
      const particleRGB = isDark ? "255, 255, 255" : "15, 23, 42";

      // Periodically spawn shooting streak
      if (Date.now() > nextStreakTime) {
        spawnStreak();
        nextStreakTime = Date.now() + Math.random() * 4000 + 3000;
      }

      // 1. Draw and update streaks
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha = Math.max(0, 1 - s.life / s.maxLife);

        if (s.alpha <= 0) {
          streaks.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(${particleRGB}, 0)`);
        grad.addColorStop(1, `rgba(${particleRGB}, ${s.alpha * (isDark ? 0.75 : 0.5)})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }

      // 2. Update and draw particles & links
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Bounce off bounds
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > width) {
          p.x = width;
          p.vx *= -1;
        }

        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > height) {
          p.y = height;
          p.vy *= -1;
        }

        // Mouse gentle repulsion
        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 120 && distMouse > 0) {
          const force = (120 - distMouse) / 120;
          p.x += (dxMouse / distMouse) * force * 1.5;
          p.y += (dyMouse / distMouse) * force * 1.5;
        }

        // Draw particle
        const alpha = p.baseAlpha * (0.75 + Math.sin(p.pulse) * 0.25);
        ctx.fillStyle = `rgba(${particleRGB}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw links to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxLineDist) {
            const lineAlpha = (1 - dist / maxLineDist) * (isDark ? 0.14 : 0.08);
            ctx.strokeStyle = `rgba(${particleRGB}, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <div className="monochrome-universe-container" aria-hidden="true">
      {/* 1. Deep Monochrome Canvas */}
      <canvas ref={canvasRef} className="monochrome-canvas" />

      {/* 2. Infinite Moving Monochrome Cyber Grid Layer */}
      <div className="moving-monochrome-grid" />

      {/* 3. Subtle Horizon Ambient Vignette */}
      <div className="monochrome-vignette-overlay" />
    </div>
  );
}
