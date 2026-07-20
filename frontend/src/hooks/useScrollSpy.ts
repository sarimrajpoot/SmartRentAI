import { useState, useEffect } from "react";

export function useScrollSpy(ids: string[], offset: number = 80) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Determine which section is currently active based on scroll position
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset + 10; // Extra padding for detection

      let currentId = "";

      for (const id of ids) {
        const element = document.getElementById(id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          // element is considered active if it is intersecting the top portion of the screen
          // top + window.scrollY gives absolute position
          const elementTop = top + window.scrollY;
          const elementBottom = bottom + window.scrollY;

          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            currentId = id;
            break; // Stop when the first visible section is found
          }
        }
      }

      // If at the very top of the page, default to the first id
      if (window.scrollY === 0 && ids.length > 0) {
        currentId = ids[0];
      }

      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ids, offset]);

  return activeId;
}
