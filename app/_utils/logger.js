export const logToServer = (message, data) => {
    fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, data }),
    });
  };