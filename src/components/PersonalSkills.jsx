import { useEffect, useRef, useState } from 'react';
import { PERSONAL_SKILLS } from '../data/personalSkillsData';

function PersonalSkillCard({ item }) {
    return (
        <div className="pskills__card">
        <span className="pskills__icon">
            <iconify-icon icon={item.icon} width="24" height="24"></iconify-icon>
        </span>
        <span className="pskills__name">{item.name}</span>
        <p className="pskills__desc">{item.desc}</p>
        </div>
    );
}

export default function PersonalSkills() {
    const rowRef = useRef(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const updateArrows = () => {
        const row = rowRef.current;
        if (!row) return;
        const maxScroll = row.scrollWidth - row.clientWidth;
        setCanPrev(row.scrollLeft > 4);
        setCanNext(row.scrollLeft < maxScroll - 4);
    };

    useEffect(() => {
        updateArrows();
        const row = rowRef.current;
        if (!row) return;

        row.addEventListener('scroll', updateArrows, { passive: true });
        window.addEventListener('resize', updateArrows);
        return () => {
        row.removeEventListener('scroll', updateArrows);
        window.removeEventListener('resize', updateArrows);
        };
    }, []);

    const scrollByCards = (direction) => {
        const row = rowRef.current;
        if (!row) return;
        const card = row.querySelector('.pskills__card');
        const gap = parseFloat(getComputedStyle(row).columnGap || getComputedStyle(row).gap) || 0;
        const step = card ? (card.getBoundingClientRect().width + gap) * 2 : row.clientWidth * 0.8;
        row.scrollBy({ left: direction * step, behavior: 'smooth' });
    };

    const needsArrows = canPrev || canNext;

    return (
        <div className="pskills">
        <span className="section__eyebrow pskills__eyebrow">Habilidades personales</span>

        <div className="pskills__carousel">
            <button
            className={`pskills__arrow pskills__arrow--prev${!needsArrows ? ' is-hidden' : ''}`}
            type="button"
            aria-label="Habilidades anteriores"
            disabled={!canPrev}
            onClick={() => scrollByCards(-1)}
            >
            ‹
            </button>

            <div className="pskills__viewport">
            <div className="pskills__row" ref={rowRef}>
                {PERSONAL_SKILLS.map((item) => (
                <PersonalSkillCard key={item.name} item={item} />
                ))}
            </div>
            </div>

            <button
            className={`pskills__arrow pskills__arrow--next${!needsArrows ? ' is-hidden' : ''}`}
            type="button"
            aria-label="Siguientes habilidades"
            disabled={!canNext}
            onClick={() => scrollByCards(1)}
            >
            ›
            </button>
        </div>
        </div>
    );
}