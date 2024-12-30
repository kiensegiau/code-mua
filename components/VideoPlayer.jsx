import React, { useState } from 'react';

const VideoPlayer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div className="video-container">
      {isLoading && <div>Đang tải video...</div>}
      {error && <div className="error">{error}</div>}
      <div data-vjs-player>
        <video ref={videoRef} className="video-js" />
      </div>
    </div>
  );
};

export default VideoPlayer; 