import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

function ContinueReading() {
  const { pathname } = useLocation();
  const [savedPosition, setSavedPosition] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const key = `scroll-position:${pathname}`;
    const saved = sessionStorage.getItem(key);

    if (!saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSavedPosition(null);
      setVisible(false);
      return;
    }

    const position = Number(saved);

    if (position > 400) {
      setSavedPosition(position);
      setVisible(true);
    } else {
      sessionStorage.removeItem(key);
      setSavedPosition(null);
      setVisible(false);
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const key = `scroll-position:${pathname}`;

      sessionStorage.setItem(key, String(window.scrollY));
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const continueReading = () => {
    if (savedPosition === null) {
      return;
    }

    window.scrollTo({
      top: savedPosition,
      behavior: "smooth",
    });

    sessionStorage.removeItem(`scroll-position:${pathname}`);
    setVisible(false);
  };

  const dismiss = () => {
    sessionStorage.removeItem(`scroll-position:${pathname}`);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed right-6 bottom-20 z-50 flex items-center gap-1 rounded-full border bg-background p-1 shadow-lg">
      <Button variant="ghost" size="sm" onClick={continueReading} className="rounded-full gap-2">
        <RotateCcw className="h-4 w-4" />
        Continue where you left off
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={dismiss}
        aria-label="Dismiss"
        className="h-8 w-8 rounded-full"
      >
        ×
      </Button>
    </div>
  );
}

export default ContinueReading;
