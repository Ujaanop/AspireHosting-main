import { useInView } from "framer-motion";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number;
  startValue?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  variant?: "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "custom";
  customColor?: string;
}

export function NumberTicker({
  value,
  direction = "up",
  className,
  delay = 0,
  startValue = 0,
  decimalPlaces = 0,
  prefix = "",
  suffix = "",
  variant = "primary",
  customColor,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(startValue);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        const start = startValue;
        const end = value;
        const duration = 2000; // 2 seconds
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentValue = start + (end - start) * easeOutQuart;
          
          setDisplayValue(Number(currentValue.toFixed(decimalPlaces)));
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      }, delay * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [inView, value, startValue, decimalPlaces, delay]);

  // Define color classes based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "ticker-primary";
      case "secondary":
        return "ticker-secondary";
      case "accent":
        return "ticker-accent";
      case "success":
        return "ticker-success";
      case "warning":
        return "ticker-warning";
      case "error":
        return "ticker-error";
      case "custom":
        return "";
      default:
        return "ticker-primary";
    }
  };

  const variantClasses = getVariantClasses();
  const customStyle = variant === "custom" && customColor ? { color: customColor } : {};

  return (
    <span 
      className={cn(variantClasses, className)} 
      ref={ref}
      style={customStyle}
    >
      {prefix}{displayValue}{suffix}
    </span>
  );
}