import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export default function AnimatedNumber({
  value,
  duration = 1800,
  prefix = "",
  suffix = "",
  decimals,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const frame = useRef<number | null>(null);

  const inView = useInView(ref, {
    once: false,
    amount: 0.6,
  });

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start: number | null = null;

    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;

      const progress = Math.min((timestamp - start) / duration, 1);

      const eased = easeOutQuint(progress);

      setDisplayValue(value * eased);

      if (progress < 1) {
        frame.current = requestAnimationFrame(animate);
      }
    };

    frame.current = requestAnimationFrame(animate);

    return () => {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, [value, duration, inView]);

  const fractionDigits =
    decimals ??
    (Number.isInteger(value)
      ? 0
      : value.toString().split(".")[1]?.length ?? 1);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      })}
      {suffix}
    </span>
  );
}