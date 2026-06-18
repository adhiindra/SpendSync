"use client";

import { useEffect } from "react";
import { mountToaster } from "gooey-toast";
import "gooey-toast/styles.css";

export function ToastProvider() {
  useEffect(() => {
    const handle = mountToaster({
      position: "top-center",
    });
    return () => handle.unmount();
  }, []);

  return null;
}
