"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const [startY, setStartY] = useState(0);
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const maxPull = 120;
  const threshold = 60;

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only start if we are at the very top of the container
      if (containerRef.current && containerRef.current.scrollTop <= 0) {
        setStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY === 0 || refreshing) return;
      
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;

      // If pulling down
      if (diff > 0) {
        // Prevent native scrolling and native pull-to-refresh on mobile
        if (e.cancelable) {
          e.preventDefault();
        }
        setPulling(true);
        // Add resistance
        setPullDistance(Math.min(diff * 0.4, maxPull));
      } else {
        // Scrolling up, reset
        setPulling(false);
        setPullDistance(0);
      }
    };

    const handleTouchEnd = () => {
      if (pulling) {
        if (pullDistance >= threshold) {
          setRefreshing(true);
          // Hard reload or router refresh depending on preference
          window.location.reload();
          
          setTimeout(() => {
            setRefreshing(false);
            setPullDistance(0);
          }, 1000);
        } else {
          setPullDistance(0);
        }
        setPulling(false);
        setStartY(0);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true });
      container.addEventListener("touchmove", handleTouchMove, { passive: false });
      container.addEventListener("touchend", handleTouchEnd, { passive: true });
      
      return () => {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [startY, pulling, pullDistance, refreshing, router]);

  return (
    <div 
      ref={containerRef} 
      className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0 z-10 bg-transparent relative overscroll-none touch-pan-y"
    >
      {/* Pull Indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex justify-center z-50 pointer-events-none"
        style={{ 
          height: `${threshold}px`,
          transform: `translateY(${(refreshing ? threshold : pullDistance) - threshold}px)`,
          transition: pulling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        <div className="flex items-center justify-center mt-4 w-10 h-10 bg-card rounded-full shadow-lg border border-border">
          <Loader2 
            className={`w-5 h-5 text-primary ${refreshing ? "animate-spin" : ""}`} 
            style={!refreshing ? { transform: `rotate(${pullDistance * 4}deg)` } : {}}
          />
        </div>
      </div>
      
      <div 
        className="flex flex-col flex-1"
        style={{ 
          transform: `translateY(${refreshing ? threshold : pullDistance}px)`,
          transition: pulling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
