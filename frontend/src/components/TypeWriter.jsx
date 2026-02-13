import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TypeWriter = ({ texts, className = '' }) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentFullText = texts[currentTextIndex];
        let timeout;

        if (!isDeleting && displayedText === currentFullText) {
            timeout = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && displayedText === '') {
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        } else {
            timeout = setTimeout(
                () => {
                    setDisplayedText(
                        isDeleting
                            ? currentFullText.substring(0, displayedText.length - 1)
                            : currentFullText.substring(0, displayedText.length + 1)
                    );
                },
                isDeleting ? 30 : 60
            );
        }

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, currentTextIndex, texts]);

    return (
        <span className={`typewriter ${className}`}>
            {displayedText}
            <motion.span
                className="typewriter-cursor"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
            >
                |
            </motion.span>
        </span>
    );
};

export default TypeWriter;
