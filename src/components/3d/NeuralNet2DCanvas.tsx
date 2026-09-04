import React, { useRef, useEffect, useState } from 'react';

interface Node2D {
  id: string;
  layer: number;
  index: number;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  glowColor: string;
  activation: number;
  floatPhase: number;
}

interface Connection2D {
  from: Node2D;
  to: Node2D;
}

interface Pulse2D {
  fromNode: Node2D;
  toNode: Node2D;
  progress: number;
  speed: number;
  color: string;
}

export default function NeuralNet2DCanvas({
  isReducedMotion,
  isVisible,
}: {
  isReducedMotion: boolean;
  isVisible: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 450;

    // Layer definitions: Input (3), Hidden 1 (4), Hidden 2 (4), Output (2)
    const layerSizes = [3, 4, 4, 2];
    const layerXFractions = [0.14, 0.38, 0.62, 0.86];
    const layerColors = ['#8C4A1B', '#A6632B', '#A6632B', '#C77A38'];
    const glowColors = [
      'rgba(140, 74, 27, 0.4)',
      'rgba(166, 99, 43, 0.4)',
      'rgba(166, 99, 43, 0.4)',
      'rgba(199, 122, 56, 0.5)',
    ];

    let nodes: Node2D[] = [];
    let connections: Connection2D[] = [];
    let pulses: Pulse2D[] = [];

    const initNetwork = () => {
      nodes = [];
      connections = [];
      pulses = [];

      layerSizes.forEach((count, layerIdx) => {
        const x = width * layerXFractions[layerIdx];
        const spacing = height / (count + 1);

        for (let i = 0; i < count; i++) {
          const y = (i + 1) * spacing;
          nodes.push({
            id: `l${layerIdx}-n${i}`,
            layer: layerIdx,
            index: i,
            baseX: x,
            baseY: y,
            x,
            y,
            radius: layerIdx === 0 || layerIdx === 3 ? 12 : 10,
            color: layerColors[layerIdx],
            glowColor: glowColors[layerIdx],
            activation: 0,
            floatPhase: Math.random() * Math.PI * 2,
          });
        }
      });

      // Build connections between adjacent layers
      for (let l = 0; l < layerSizes.length - 1; l++) {
        const currentLayer = nodes.filter((n) => n.layer === l);
        const nextLayer = nodes.filter((n) => n.layer === l + 1);

        currentLayer.forEach((src) => {
          nextLayer.forEach((dst) => {
            connections.push({ from: src, to: dst });
          });
        });
      }

      // Initialize 8 running pulses
      for (let i = 0; i < 8; i++) {
        const randConn = connections[Math.floor(Math.random() * connections.length)];
        pulses.push({
          fromNode: randConn.from,
          toNode: randConn.to,
          progress: Math.random(),
          speed: 0.006 + Math.random() * 0.01,
          color: '#C77A38',
        });
      }
    };

    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initNetwork();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    // Mouse movement
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // On Click: trigger a burst of pulses from Input layer
    const onClick = () => {
      const inputNodes = nodes.filter((n) => n.layer === 0);
      inputNodes.forEach((src) => {
        src.activation = 1.0;
        const validConns = connections.filter((c) => c.from.id === src.id);
        validConns.forEach((c) => {
          pulses.push({
            fromNode: c.from,
            toNode: c.to,
            progress: 0,
            speed: 0.012 + Math.random() * 0.008,
            color: '#A6632B',
          });
        });
      });
      setPulseCount((c) => c + 1);
    };

    canvas.addEventListener('mousemove', onMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', onMouseLeave, { passive: true });
    canvas.addEventListener('click', onClick);

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min(time - lastTime, 50);
      lastTime = time;

      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Parallax mouse factors
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const hasMouse = mouseRef.current.active;

      // Update Node positions with smooth floating motion & mouse repulsion/attraction
      nodes.forEach((node) => {
        if (!isReducedMotion) {
          const floatY = Math.sin(time * 0.0018 + node.floatPhase) * 4;
          const floatX = Math.cos(time * 0.0014 + node.floatPhase) * 3;

          let targetX = node.baseX + floatX;
          let targetY = node.baseY + floatY;

          if (hasMouse) {
            const dx = mouseX - node.baseX;
            const dy = mouseY - node.baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
              const force = (1 - dist / 180) * 8;
              targetX += (dx / dist) * force;
              targetY += (dy / dist) * force;
              node.activation = Math.max(node.activation, 0.4 * (1 - dist / 180));
            }
          }

          node.x += (targetX - node.x) * 0.08;
          node.y += (targetY - node.y) * 0.08;
        } else {
          node.x = node.baseX;
          node.y = node.baseY;
        }

        // Decay activation
        node.activation = Math.max(0, node.activation - dt * 0.0015);
      });

      // 1. Draw Connections
      connections.forEach((conn) => {
        const src = conn.from;
        const dst = conn.to;
        const baseAlpha = 0.22;
        const activeAlpha = Math.max(src.activation, dst.activation) * 0.4;
        const finalAlpha = Math.min(0.8, baseAlpha + activeAlpha);

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        // Curved line for aesthetic organic neural look
        const midX = (src.x + dst.x) / 2;
        ctx.bezierCurveTo(midX, src.y, midX, dst.y, dst.x, dst.y);

        ctx.strokeStyle = `rgba(166, 99, 43, ${finalAlpha})`;
        ctx.lineWidth = 1.2 + (src.activation + dst.activation) * 0.8;
        ctx.stroke();
      });

      // 2. Update & Draw Pulses
      if (!isReducedMotion) {
        for (let i = pulses.length - 1; i >= 0; i--) {
          const pulse = pulses[i];
          pulse.progress += pulse.speed;

          if (pulse.progress >= 1) {
            // Pulse reached destination: activate node
            pulse.toNode.activation = 1.0;

            // Chain pulse forward if not on final layer
            if (pulse.toNode.layer < layerSizes.length - 1) {
              const forwardConns = connections.filter((c) => c.from.id === pulse.toNode.id);
              if (forwardConns.length > 0) {
                const nextConn = forwardConns[Math.floor(Math.random() * forwardConns.length)];
                pulse.fromNode = nextConn.from;
                pulse.toNode = nextConn.to;
                pulse.progress = 0;
                pulse.speed = 0.008 + Math.random() * 0.01;
                continue;
              }
            }

            // Otherwise pick any connection to restart
            const randConn = connections[Math.floor(Math.random() * connections.length)];
            pulse.fromNode = randConn.from;
            pulse.toNode = randConn.to;
            pulse.progress = 0;
            pulse.speed = 0.006 + Math.random() * 0.01;
          }

          // Calculate pulse coordinate along bezier curve
          const src = pulse.fromNode;
          const dst = pulse.toNode;
          const midX = (src.x + dst.x) / 2;
          const t = pulse.progress;

          // Cubic Bezier interpolation
          const p0x = src.x;
          const p0y = src.y;
          const p1x = midX;
          const p1y = src.y;
          const p2x = midX;
          const p2y = dst.y;
          const p3x = dst.x;
          const p3y = dst.y;

          const cx = 3 * (p1x - p0x);
          const bx = 3 * (p2x - p1x) - cx;
          const ax = p3x - p0x - cx - bx;

          const cy = 3 * (p1y - p0y);
          const by = 3 * (p2y - p1y) - cy;
          const ay = p3y - p0y - cy - by;

          const px = ax * t * t * t + bx * t * t + cx * t + p0x;
          const py = ay * t * t * t + by * t * t + cy * t + p0y;

          // Draw Glowing Pulse Orb
          const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, 8);
          glowGrad.addColorStop(0, 'rgba(255, 248, 240, 0.95)');
          glowGrad.addColorStop(0.4, 'rgba(199, 122, 56, 0.8)');
          glowGrad.addColorStop(1, 'rgba(140, 74, 27, 0)');

          ctx.beginPath();
          ctx.arc(px, py, 7, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#FFF8F0';
          ctx.fill();
        }
      }

      // 3. Draw Nodes with Glowing Halos & Inner Core
      nodes.forEach((node) => {
        const effectiveRadius = node.radius + node.activation * 3;

        // Outer Halo / Aura
        const haloGrad = ctx.createRadialGradient(
          node.x,
          node.y,
          effectiveRadius * 0.5,
          node.x,
          node.y,
          effectiveRadius * 2.2
        );
        haloGrad.addColorStop(0, node.glowColor);
        haloGrad.addColorStop(1, 'rgba(140, 74, 27, 0)');

        ctx.beginPath();
        ctx.arc(node.x, node.y, effectiveRadius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = haloGrad;
        ctx.fill();

        // Node Inner Body (Gradient)
        const bodyGrad = ctx.createRadialGradient(
          node.x - effectiveRadius * 0.3,
          node.y - effectiveRadius * 0.3,
          1,
          node.x,
          node.y,
          effectiveRadius
        );
        bodyGrad.addColorStop(0, node.activation > 0.3 ? '#FCEBD9' : '#D6945A');
        bodyGrad.addColorStop(0.7, node.color);
        bodyGrad.addColorStop(1, '#4A2A14');

        ctx.beginPath();
        ctx.arc(node.x, node.y, effectiveRadius, 0, Math.PI * 2);
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        // Delicate crisp border ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, effectiveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = node.activation > 0.3 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(214, 197, 179, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
    };
  }, [isReducedMotion, isVisible]);

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-pointer select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
