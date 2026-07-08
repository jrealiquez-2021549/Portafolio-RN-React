import { useEffect, useRef, useState } from 'react';
import { PROJECT_TECHNOLOGIES } from '../data/projectTechData';

function TechRow({ item }) {
    return (
        <div className="tech__row">
        <span className="tech__icon">
            <iconify-icon icon={item.icon} width="22" height="22"></iconify-icon>
        </span>
        <div className="tech__info">
            <span className="tech__name">{item.name}</span>
            <p className="tech__desc">{item.use}</p>
        </div>
        </div>
    );
}

const getColumnsPerView = () => {
    const width = window.innerWidth;
    if (width <= 560) return 1;
    if (width <= 900) return 2;
    return 3;
};

function chunkIntoColumns(items, rows = 2) {
    const columns = [];
    for (let i = 0; i < items.length; i += rows) {
        columns.push(items.slice(i, i + rows));
    }
    return columns;
}

export default function ProjectTechStack({ projectId }) {
    const technologies = PROJECT_TECHNOLOGIES[projectId] || [];
    const columns = chunkIntoColumns(technologies, 2);

    const gridRef = useRef(null);
    const [colIndex, setColIndex] = useState(0);
    const [transform, setTransform] = useState('translateX(0px)');

    const getMaxIndex = () => Math.max(0, columns.length - getColumnsPerView());

    const renderCarousel = (index) => {
        const grid = gridRef.current;
        if (!grid) return;
        const colEls = grid.querySelectorAll('.tech__column');
        if (!colEls.length) return;

        const maxIndex = getMaxIndex();
        const clampedIndex = Math.min(index, maxIndex);

        const colWidth = colEls[0].getBoundingClientRect().width;
        const gap =
        parseFloat(getComputedStyle(grid).columnGap || getComputedStyle(grid).gap) || 0;
        setTransform(`translateX(-${clampedIndex * (colWidth + gap)}px)`);

        return clampedIndex;
    };

    // Reinicia el carrusel cada vez que se cambia de proyecto.
    useEffect(() => {
        setColIndex(0);
        setTransform('translateX(0px)');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    useEffect(() => {
        const applied = renderCarousel(colIndex);
        if (applied !== undefined && applied !== colIndex) setColIndex(applied);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colIndex, projectId]);

    useEffect(() => {
        const handleResize = () => renderCarousel(colIndex);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colIndex]);

    if (columns.length === 0) return null;

    const goToColumn = (index) => {
        setColIndex(Math.min(Math.max(index, 0), getMaxIndex()));
    };

    const maxIndex = getMaxIndex();
    const needsArrows = maxIndex > 0;

    return (
        <div className="tech__stack">
        <span className="section__eyebrow tech__eyebrow">Tecnologías utilizadas</span>

        <div className="tech__carousel">
            <button
            className={`tech__arrow tech__arrow--prev${!needsArrows ? ' is-hidden' : ''}`}
            type="button"
            aria-label="Tecnologías anteriores"
            disabled={colIndex === 0}
            onClick={() => goToColumn(colIndex - 1)}
            >
            ‹
            </button>

            <div className="tech__viewport">
            <div className="tech__grid" ref={gridRef} style={{ transform }}>
                {columns.map((column, i) => (
                <div className="tech__column" key={`${projectId}-col-${i}`}>
                    {column.map((item) => (
                    <TechRow key={item.name} item={item} />
                    ))}
                </div>
                ))}
            </div>
            </div>

            <button
            className={`tech__arrow tech__arrow--next${!needsArrows ? ' is-hidden' : ''}`}
            type="button"
            aria-label="Siguientes tecnologías"
            disabled={colIndex >= maxIndex}
            onClick={() => goToColumn(colIndex + 1)}
            >
            ›
            </button>
        </div>
        </div>
    );
}