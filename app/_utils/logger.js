export const logger = {
  log: (...args) => {
    // Gửi log đến server qua API
    fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "log", args }),
    }).catch(() => {});
    // Vẫn giữ log ở browser
    console.log(...args);
  },
  error: (...args) => {
    fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "error", args }),
    }).catch(() => {});
    console.error(...args);
  },
};
