export const PLAYER_OPTIONS = {
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
  settings: ['captions', 'quality', 'speed'],
  speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
  keyboard: {
    focused: true,
    global: true,
    bindings: {
      arrowLeft: {
        key: 37,
        handler: (player) => {
          const event = new CustomEvent('previousVideo');
          player.elements.container.dispatchEvent(event);
        }
      },
      arrowRight: {
        key: 39,
        handler: (player) => {
          const event = new CustomEvent('nextVideo');
          player.elements.container.dispatchEvent(event);
        }
      }
    }
  }
}; 