"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DisableDevTools() {
  const router = useRouter();

  useEffect(() => {
    // Phát hiện DevTools bằng debugger
    function detectDebugger() {
      const startTime = new Date();
      debugger;
      const endTime = new Date();
      if (endTime - startTime > 100) {
        document.body.innerHTML = "Không được phép mở DevTools!";
      }
    }

    // Phát hiện DevTools bằng performance
    function checkDevTools() {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      if (widthThreshold || heightThreshold) {
        document.body.innerHTML = "Không được phép mở DevTools!";
      }

      // Kiểm tra performance
      const timeThreshold = 10;
      const t1 = performance.now();
      for (let i = 0; i < 100; i++) {
        console.log(i);
      }
      const t2 = performance.now();

      if (t2 - t1 > timeThreshold) {
        document.body.innerHTML = "Không được phép mở DevTools!. Nếu cần tải xuống hãy liên hệ admin";
      }
    }

    // Phát hiện phím tắt
    function handleKeyDown(e) {
      const forbiddenKeys = [
        123, // F12
        73, // I
        74, // J
        67, // C
        85, // U
        80, // P
        82, // R
        83, // S
      ];

      if (
        forbiddenKeys.includes(e.keyCode) &&
        (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey)
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Vô hiệu hóa chuột phải và phím tắt
    function disableRightClick(e) {
      e.preventDefault();
      return false;
    }

    // Vô hiệu hóa copy/paste
    function disableCopyPaste(e) {
      e.preventDefault();
      return false;
    }

    // Vô hiệu hóa console
    function disableConsole() {
      const methods = [
        "log",
        "debug",
        "info",
        "warn",
        "error",
        "table",
        "trace",
        "clear",
        "group",
        "groupEnd",
        "groupCollapsed",
        "assert",
        "count",
        "countReset",
        "time",
        "timeEnd",
        "timeLog",
        "profile",
        "profileEnd",
      ];

      methods.forEach((method) => {
        console[method] = () => {};
      });

      // Ghi đè console với getter
      Object.defineProperty(window, "console", {
        get: function () {
          return {
            log: () => {},
            debug: () => {},
            info: () => {},
            warn: () => {},
            error: () => {},
          };
        },
        set: function () {},
      });
    }

    // Vô hiệu hóa source code
    function disableSourceView() {
      document.addEventListener("keydown", function (e) {
        if (e.ctrlKey && e.key === "u") {
          e.preventDefault();
          return false;
        }
      });
    }

    // Thêm các event listeners
    const interval = setInterval(checkDevTools, 1000);
    setInterval(detectDebugger, 1000);

    window.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("copy", disableCopyPaste);
    document.addEventListener("cut", disableCopyPaste);
    document.addEventListener("paste", disableCopyPaste);

    disableConsole();
    disableSourceView();

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("copy", disableCopyPaste);
      document.removeEventListener("cut", disableCopyPaste);
      document.removeEventListener("paste", disableCopyPaste);
    };
  }, []);

  return null;
}
