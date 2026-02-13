import { useEffect, useRef } from 'react';

const ParticleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;
        let mouse = { x: null, y: null };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        const particles = [];
        const PARTICLE_COUNT = 80;
        const CONNECTION_DISTANCE = 150;
        const MOUSE_RADIUS = 200;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 2 + 0.5;
                this.baseAlpha = Math.random() * 0.5 + 0.1;
                this.alpha = this.baseAlpha;
                // Random purple/pink/blue hue
                this.hue = Math.random() > 0.5
                    ? 250 + Math.random() * 30 // purple-blue
                    : 310 + Math.random() * 30; // pink
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // React to mouse
                if (mouse.x !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MOUSE_RADIUS) {
                        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                        this.alpha = this.baseAlpha + force * 0.5;
                        this.vx += (dx / dist) * force * 0.3;
                        this.vy += (dy / dist) * force * 0.3;
                    } else {
                        this.alpha += (this.baseAlpha - this.alpha) * 0.05;
                    }
                }

                // Damping
                this.vx *= 0.99;
                this.vy *= 0.99;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECTION_DISTANCE) {
                        const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(168, 130, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            drawConnections();
            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
            }}
        />
    );
};

export default ParticleCanvas;
