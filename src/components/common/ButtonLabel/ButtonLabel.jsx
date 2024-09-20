import React from 'react';
import styles from './ButtonLabel.module.css';

export function ButtonLabel({ text, deactivate = 'activate' }) {
    const className = deactivate === 'deactivate' ? styles.deactivated : styles.container;
    return (
        <div className={`${className} ${styles.disable}`}><span>{text.toUpperCase()}</span></div>
    );
}
 