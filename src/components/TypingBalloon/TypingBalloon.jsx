import React, { useState, useEffect } from 'react';
import styles from './TypingBalloon.module.css';

function TypingBalloon({ text, displayDuration = 5000 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Reseta a digitação sempre que o texto externo mudar.
    setDisplayedText('');
    setIndex(0);
    setIsVisible(true); // Garante que o balão está visível novamente se estava oculto.
  }, [text]);

  useEffect(() => {
    if (text && index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(index + 1);
      }, 40);
      return () => clearTimeout(timer);
    } else if (index === text.length) {
      setTimeout(() => {
        setIsVisible(false); // Esconde o balão após um tempo após a mensagem ser completamente digitada.
      }, displayDuration); // Usa o valor passado como prop ou o valor padrão de 2000ms.
    }
  }, [text, index, displayDuration]);

  if (!isVisible) return null;

  return (
    <div className={styles.balloon}>
      <p>{displayedText}</p>
    </div>
  );
}

export default TypingBalloon;
