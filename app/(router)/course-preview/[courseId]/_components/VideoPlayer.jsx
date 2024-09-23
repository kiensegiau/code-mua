import React, { forwardRef, useEffect } from 'react'
import ReactPlayer from 'react-player'

const VideoPlayer = forwardRef(({ videoUrl, poster }, ref) => {
  console.log('VideoPlayer received props:', { videoUrl, poster });
  
  useEffect(() => {
    console.log('VideoPlayer useEffect triggered');
  }, [videoUrl]);

  return (
    <div className='player-wrapper fixed-size'>
      {videoUrl ? (
        <ReactPlayer
          ref={ref}
          className='react-player'
          url={videoUrl}
          width='100%'
          height='100%'
          controls={true}
          light={poster}
        />
      ) : (
        <div className='flex items-center justify-center h-full bg-black text-gray-500'>
          Không có video
        </div>
      )}
    </div>
  )
});

export default VideoPlayer