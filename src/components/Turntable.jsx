import { useEffect, useRef, useState } from 'react';

const VIDEO_ID = '2mJXVrELK3Q';

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export default function Turntable() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tooltipHtml, setTooltipHtml] = useState('');
  const playerRef = useRef(null);
  const pendingPlayRef = useRef(false);
  const btnRef = useRef(null);

  // Trae título y canal del video con la API pública de oEmbed
  useEffect(() => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${VIDEO_ID}&format=json`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo obtener la información del video');
        return res.json();
      })
      .then((data) => {
        const title = escapeHtml(data.title || 'Canción');
        const author = escapeHtml(data.author_name || '');
        setTooltipHtml(`<strong>${title}</strong><span>${author}</span>`);
      })
      .catch(() => {
        setTooltipHtml('<strong>Música de fondo</strong><span>Click para reproducir</span>');
      });
  }, []);

  const createPlayer = () => {
    playerRef.current = new window.YT.Player('turntableYouTube', {
      height: '1',
      width: '1',
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        loop: 1,
        playlist: VIDEO_ID,
      },
      events: {
        onReady: () => {
          if (pendingPlayRef.current) {
            playerRef.current.playVideo();
            pendingPlayRef.current = false;
          }
        },
        onStateChange: (event) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
        },
      },
    });
  };

  const loadYouTubeAPI = () => {
    if (window.YT && window.YT.Player) {
      createPlayer();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      createPlayer();
    };
  };

  const handleClick = () => {
    if (!playerRef.current) {
      pendingPlayRef.current = true;
      loadYouTubeAPI();
      return;
    }

    const state = playerRef.current.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  return (
    <>
      <div className={`turntable${isPlaying ? ' is-playing' : ''}`} id="turntable">
        <span
          className="turntable__tooltip"
          id="turntableTooltip"
          dangerouslySetInnerHTML={{ __html: tooltipHtml }}
        ></span>

        <button
          className="turntable__disc-btn"
          id="turntableBtn"
          type="button"
          aria-pressed={isPlaying}
          aria-label={isPlaying ? 'Pausar música de fondo' : 'Reproducir música de fondo'}
          ref={btnRef}
          onClick={handleClick}
        >
          <span className="turntable__vinyl">
            <span className="turntable__label"></span>
          </span>
          <span className="turntable__arm"></span>
        </button>
      </div>

      <div id="turntableYouTube" className="turntable__yt" aria-hidden="true"></div>
    </>
  );
}
