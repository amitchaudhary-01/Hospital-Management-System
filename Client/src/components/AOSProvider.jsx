// src/components/AOSProvider.jsx
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSProvider({ children }) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false, // Animation happens only once while scrolling down if true
    });
  }, []);

  return <>{children}</>;
}