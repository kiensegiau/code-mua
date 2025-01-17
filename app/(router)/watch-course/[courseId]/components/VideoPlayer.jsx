import { useEffect, useRef, useState, useCallback } from 'react';
import Plyr from 'plyr-react';
import { toast } from 'sonner';
import { useControlsVisibility } from '../hooks/useControlsVisibility';
import { PLAYER_OPTIONS } from '../constants/playerOptions';
import { PreviousIcon, NextIcon } from './icons/NavigationIcons';
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
  const { 
    isControlsVisible, 
    handleMouseMove, 
    handleMouseLeave 
  } = useControlsVisibility();

  const videoUrl = useCallback(() => {
    if (!fileId) return '';
    return fileId.startsWith('http') 
      ? fileId 
      : `${process.env.NEXT_PUBLIC_API_URL}/api/proxy/files?id=${fileId}`;
  }, [fileId]);

  const handleError = useCallback((error) => {
    console.error('Player error:', error);
    toast.error('Có lỗi khi phát video');
  }, []);

  const handleVideoEnd = useCallback(() => {
    console.log('Video ended, playing next video');
    onNext?.();
  }, [onNext]);

  const handleTimeUpdate = useCallback((e) => {
    const time = e.target.currentTime;
    onTimeUpdate?.(time);
  }, [onTimeUpdate]);

  useEffect(() => {
    const container = playerRef.current?.elements?.container;
    if (!container) return;

    const handlePreviousVideo = () => onPrevious?.();
    const handleNextVideo = () => onNext?.();

    container.addEventListener('previousVideo', handlePreviousVideo);
    container.addEventListener('nextVideo', handleNextVideo);

    return () => {
      container.removeEventListener('previousVideo', handlePreviousVideo);
      container.removeEventListener('nextVideo', handleNextVideo);
    };
  }, [onPrevious, onNext]);

  return (
    <div 
      className={`w-full h-full relative group ${!isControlsVisible ? 'plyr--hide-controls' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <NavigationButton
        direction="previous"
        onClick={onPrevious}
        className="left-4"
      />
      <NavigationButton
        direction="next"
        onClick={onNext}
        className="right-4"
      />

      <Plyr
        ref={playerRef}
        source={{
          type: 'video',
          sources: [{
            src: videoUrl(),
            type: 'video/mp4',
          }]
        }}
        options={PLAYER_OPTIONS}
        autoPlay={autoPlay}
        onReady={() => console.log('Player ready')}
        onLoadedData={() => console.log('Video data loaded')}
        onLoadedMetadata={() => console.log('Video metadata loaded')}
        onEnded={handleVideoEnd}
        onTimeUpdate={handleTimeUpdate}
        onError={handleError}
      />
    </div>
  );
}

const NavigationButton = ({ direction, onClick, className }) => (
  <button 
    onClick={onClick}
    className={`hidden group-hover:flex absolute top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/50 hover:bg-[#ff4d4f]/80 transition-all duration-200 z-10 ${className}`}
  >
    {direction === 'previous' ? <PreviousIcon /> : <NextIcon />}
  </button>
);
