import { useEffect, useRef, useState } from 'react';

const FloatingCard = ({ children, className = '' }) => {
    const cardRef = useRef(null);
    const [transform, setTransform] = useState('');
    const [glareStyle, setGlareStyle] = useState({});

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
        setGlareStyle({
            opacity: 0.15,
            background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.25), transparent 60%)`,
        });
    };

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
        setGlareStyle({ opacity: 0 });
    };

    return (
        <div
            ref={cardRef}
            className={`floating-card-wrapper ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform,
                transition: 'transform 0.15s ease-out',
                transformStyle: 'preserve-3d',
                position: 'relative',
            }}
        >
            {children}
            <div
                className="card-glare"
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'inherit',
                    pointerEvents: 'none',
                    transition: 'opacity 0.3s ease',
                    ...glareStyle,
                }}
            />
        </div>
    );
};

export default FloatingCard;
