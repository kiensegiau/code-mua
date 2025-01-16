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
      'rewind',
      'play',
      'fast-forward',
      'progress',
      'current-time',
      'duration',
      'mute',
      'volume',
      'settings',
      'fullscreen'
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
    },
    events: [
      'ready',
      'play',
      'pause',
      'ended',
      'loadeddata',
      'loadedmetadata',
      'error'
    ]
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

  return (
    <div className="w-full h-full">
      <Plyr
        ref={playerRef}
        source={source}
        options={options}
        autoPlay={autoPlay}
        onReady={handleReady}
        onLoadedData={handleLoadedData}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          console.log('Video ended');
          onEnded?.();
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
