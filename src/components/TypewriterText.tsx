import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  showCursor?: boolean;
}

// Project color palette — blues, indigos, sky tones matching SwiftRemit
const COLORS = [
  "#ffffff", // white
  "#93c5fd", // blue-300
  "#60a5fa", // blue-400 / primary-400
  "#3b82f6", // blue-500 / primary-500
  "#7b9cff", // stellar-light
  "#a5b4fc", // indigo-300
  "#818cf8", // indigo-400
  "#60a5fa", // back to blue-400
  "#bfdbfe", // blue-200
  "#ffffff", // white again
];

export default function TypewriterText({
  text,
  speed = 120,
  delay = 400,
  className = "",
  showCursor = true,
}: TypewriterTextProps) {
  // Store each character with its assigned color
  const [chars, setChars] = useState<{ char: string; color: string }[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        const char = text[i];
        // Pick color based on position, cycling through palette
        const color = COLORS[i % COLORS.length];
        setChars((prev) => [...prev, { char, color }]);
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      setChars([]);
      setDone(false);
    };
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {chars.map((c, idx) => (
        <span
          key={idx}
          style={{
            color: c.color,
            transition: "color 0.3s ease",
          }}
        >
          {c.char}
        </span>
      ))}
      {/* Cursor only visible while typing */}
      {showCursor && !done && (
        <span className="inline-block w-[3px] h-[0.85em] ml-1 align-middle rounded-sm bg-blue-400 opacity-100" />
      )}
    </span>
  );
}
