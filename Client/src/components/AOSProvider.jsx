import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

let aosInitialized = false;

export default function AOSProvider({ children }) {
  const location = useLocation();

  useEffect(() => {
    if (!aosInitialized) {
      AOS.init({
        duration: 600,
        easing: "ease-in-out",
        once: true,
        mirror: false,
        offset: 80,
      });
      aosInitialized = true;
    }

    AOS.refresh();
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [location.pathname]);

  return children;
}
