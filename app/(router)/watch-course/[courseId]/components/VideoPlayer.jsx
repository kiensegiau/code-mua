import { useEffect, useRef, useState } from 'react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

export default function VideoPlayer({
  fileId,
  onEnded,
  onTimeUpdate,
  onNext,
  onPrevious,
  autoPlay = true,
}) {
  const playerRef = useRef(null);

  useEffect(() => {
    console.log('VideoPlayer mounted/updated with fileId:', fileId);
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
  }, [fileId]);

  const options = {
    controls: [
      'play-large',
      'play',
      'progress',
      'current-time',
      'duration',
      'mute',
      'volume',
      'settings',
      'fullscreen'
    ],
    customControls: [
      {
        type: 'button',
        id: 'previousVideo',
        position: 'center',
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
        click: () => onPrevious?.()
      },
      {
        type: 'button',
        id: 'nextVideo',
        position: 'center',
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
        click: () => onNext?.()
      }
    ],
    settings: ['captions', 'quality', 'speed'],
    speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
    keyboard: { focused: true, global: true },
    tooltips: { controls: true, seek: true },
    invertTime: false,
    quality: {
      default: 1080,
      options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]
    },
    i18n: {
      restart: 'Restart',
      rewind: 'Rewind {seektime}s',
      play: 'Play',
      pause: 'Pause',
      fastForward: 'Forward {seektime}s',
      seek: 'Seek',
      played: 'Played',
      buffered: 'Buffered',
      currentTime: 'Current time',
      duration: 'Duration',
      volume: 'Volume',
      mute: 'Mute',
      unmute: 'Unmute',
      enableCaptions: 'Enable captions',
      disableCaptions: 'Disable captions',
      enterFullscreen: 'Enter fullscreen',
      exitFullscreen: 'Exit fullscreen',
      frameTitle: 'Player for {title}',
      settings: 'Settings',
      speed: 'Speed',
      normal: 'Normal',
      quality: 'Quality',
      loop: 'Loop',
      start: 'Start',
      end: 'End',
      all: 'All',
      reset: 'Reset',
      disabled: 'Disabled',
      advertisement: 'Ad',
      previousVideo: 'Video trước',
      nextVideo: 'Video tiếp theo',
    },
    keyboard: {
      focused: true,
      global: true,
      bindings: {
        arrowLeft: {
          key: 37,
          handler: () => onPrevious?.()
        },
        arrowRight: {
          key: 39,
          handler: () => onNext?.()
        }
      }
    }
  };

  const videoUrl = fileId.startsWith('http') 
    ? fileId 
    : `${process.env.NEXT_PUBLIC_API_URL}${fileId}`;
  
  console.log('Constructed video URL:', videoUrl);

  const source = {
    type: 'video',
    sources: [{
      src: videoUrl,
      type: 'video/mp4',
    }]
  };

  const handleReady = () => {
    console.log('Player is ready');
  };

  const handleLoadedData = () => {
    console.log('Video data loaded');
  };

  const handleLoadedMetadata = () => {
    console.log('Video metadata loaded');
  };

  useEffect(() => {
    // Đợi một chút để đảm bảo player đã được render
    setTimeout(() => {
      // Tìm controls container
      const controlsContainer = document.querySelector('.plyr__controls');
      if (controlsContainer) {
        const playButton = controlsContainer.querySelector('button[data-plyr="play"]');
        if (playButton) {
          // Kiểm tra xem nút đã tồn tại chưa để tránh tạo duplicate
          const existingPrevButton = controlsContainer.querySelector('.plyr__control--prev');
          const existingNextButton = controlsContainer.querySelector('.plyr__control--next');

          if (!existingPrevButton) {
            const prevButton = document.createElement('button');
            prevButton.type = 'button';
            prevButton.className = 'plyr__control plyr__control--prev';
            prevButton.innerHTML = options.customControls[0].html;
            prevButton.onclick = options.customControls[0].click;
            playButton.parentNode.insertBefore(prevButton, playButton);
          }

          if (!existingNextButton) {
            const nextButton = document.createElement('button');
            nextButton.type = 'button';
            nextButton.className = 'plyr__control plyr__control--next';
            nextButton.innerHTML = options.customControls[1].html;
            nextButton.onclick = options.customControls[1].click;
            playButton.parentNode.insertBefore(nextButton, playButton.nextSibling);
          }
        }
      }
    }, 100); // Đợi 100ms

    // Cleanup function
    return () => {
      const prevButton = document.querySelector('.plyr__control--prev');
      const nextButton = document.querySelector('.plyr__control--next');
      if (prevButton) prevButton.remove();
      if (nextButton) nextButton.remove();
    };
  }, [playerRef.current, onNext, onPrevious]);

  return (
    <div className="w-full h-full relative group">
      {/* Nút Previous lớn */}
      <button 
        onClick={onPrevious}
        className="hidden group-hover:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/50 hover:bg-[#ff4d4f]/80 transition-all duration-200 z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="m12 19-7-7 7-7"/>
          <path d="M19 12H5"/>
        </svg>
      </button>

      {/* Nút Next lớn */}
      <button 
        onClick={onNext}
        className="hidden group-hover:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/50 hover:bg-[#ff4d4f]/80 transition-all duration-200 z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M5 12h14"/>
          <path d="m12 5 7 7-7 7"/>
        </svg>
      </button>

      <Plyr
        ref={playerRef}
        source={source}
        options={options}
        autoPlay={autoPlay}
        onReady={handleReady}
        onLoadedData={handleLoadedData}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          console.log('Video ended, auto playing next video');
          onNext?.();
        }}
        onTimeUpdate={(e) => {
          const time = e.target.currentTime;
          console.log('Time update:', time);
          onTimeUpdate?.(time);
        }}
        onError={(error) => {
          console.error('Plyr error:', error);
        }}
      />
    </div>
  );
}
