import React, { useEffect, useRef } from 'react';
import { Sun, Sparkles, Mountain, CheckCircle2 } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  type: 'gold_leaf' | 'snow_crystal';
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  scaleX: number;
}

interface MountainCelebrationParticlesProps {
  active: boolean;
  onComplete?: () => void;
  title?: string;
  message?: string;
}

export const MountainCelebrationParticles: React.FC<MountainCelebrationParticlesProps> = ({
  active,
  onComplete,
  title = 'Milestone Reached!',
  message = 'Goal unlocked and fully illuminated!',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const count = 120; // balanced for 60fps performance

    // Gold leaf palette (warm golden sunlight hues)
    const goldColors = ['#F5D061', '#E5A952', '#FAD980', '#D4984F', '#FFF0B3', '#D68938'];
    // Mountain snow crystal palette (crisp alpine whites and icy light blues)
    const snowColors = ['#FFFFFF', '#F0F8FF', '#E1EEF6', '#D6EAF8', '#EDF7FC'];

    for (let i = 0; i < count; i++) {
      const isGold = Math.random() > 0.45;
      const type: 'gold_leaf' | 'snow_crystal' = isGold ? 'gold_leaf' : 'snow_crystal';
      const colors = isGold ? goldColors : snowColors;
      const color = colors[Math.floor(Math.random() * colors.length)];

      // Launch particles from upper center or distributed across top half
      const startX = width * 0.5 + (Math.random() - 0.5) * (width * 0.7);
      const startY = height * 0.15 + (Math.random() - 0.5) * 80;

      // Burst velocity with upward arc
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
      const speed = 3 + Math.random() * 7;

      particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // initial upward lift
        size: isGold ? 6 + Math.random() * 7 : 3 + Math.random() * 5,
        color,
        type,
        alpha: 1,
        life: 0,
        maxLife: 180 + Math.random() * 80, // ~3.5 to 4.5 seconds at 60fps
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.03 + Math.random() * 0.05,
        scaleX: 1,
      });
    }

    let animationFrameId: number;
    let isRunning = true;

    const render = () => {
      if (!ctx || !isRunning) return;

      ctx.clearRect(0, 0, width, height);

      let aliveCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;

        if (p.life < p.maxLife) {
          aliveCount++;

          // Physics: gravity + air resistance + wobble
          p.vy += 0.06; // gentle mountain gravity
          p.vx *= 0.985; // atmospheric drag
          p.vy *= 0.99;

          p.wobble += p.wobbleSpeed;
          p.x += p.vx + Math.sin(p.wobble) * 1.2;
          p.y += p.vy;

          p.rotation += p.rotationSpeed;
          p.scaleX = Math.cos(p.rotation * 1.5); // 3D tumbling fluttering effect

          // Fade out near end of life
          const progress = p.life / p.maxLife;
          p.alpha = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(p.scaleX, 1);
          ctx.globalAlpha = Math.max(0, p.alpha);

          if (p.type === 'gold_leaf') {
            // Draw fluttering leaf / golden flake
            ctx.fillStyle = p.color;
            ctx.shadowColor = '#F5D061';
            ctx.shadowBlur = 4;
            ctx.beginPath();
            // Oval-like leaf diamond
            ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Draw mountain snow crystal (delicate multi-point star)
            ctx.fillStyle = p.color;
            ctx.shadowColor = '#D4EAFA';
            ctx.shadowBlur = 3;

            // Draw crisp 6-point snowflake star
            ctx.beginPath();
            for (let arm = 0; arm < 6; arm++) {
              ctx.rotate(Math.PI / 3);
              ctx.moveTo(0, 0);
              ctx.lineTo(0, p.size);
            }
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = p.color;
            ctx.stroke();

            // Center glow circle
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      if (aliveCount > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        isRunning = false;
        if (onComplete) onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-start pt-16 sm:pt-20 px-4">
      {/* 60fps Canvas for Falling Snow Crystals & Golden Leaf Flakes */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Floating Mountain Summit Celebration Banner */}
      <div className="relative z-10 pointer-events-auto rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5A952] shadow-2xl p-4 sm:p-5 max-w-md w-full animate-bounce-short text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FCECD7] via-white to-[#FDF4EA] border border-[#E5A952] text-[#8F5E24] shadow-xs mb-2">
          <Sun className="w-6 h-6 text-[#E5A952] animate-spin-slow" />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8F5E24] mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#E5A952]" />
          <span>{title}</span>
          <Sparkles className="w-3.5 h-3.5 text-[#E5A952]" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-[#132E4A] mb-1">
          {message}
        </h3>

        <p className="text-xs text-[#52728F] flex items-center justify-center gap-1.5 mt-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#3DA35B]" />
          <span>Golden leaves & alpine snow celebrate your milestone</span>
        </p>
      </div>
    </div>
  );
};
