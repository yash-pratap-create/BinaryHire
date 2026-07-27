import React, { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const BinaryWatermark: React.FC = () => {
  const { isDark } = useTheme();

  const rows = useMemo(() => {
    const bits = "01";
    const result: string[] = [];
    for (let r = 0; r < 12; r++) {
      let row = "";
      for (let c = 0; c < 28; c++) {
        row += bits[Math.floor(Math.random() * 2)] + " ";
      }
      result.push(row);
    }
    return result;
  }, []);

  return (
    <div
      className="pointer-events-none select-none absolute inset-0 overflow-hidden z-0"
      style={{
        fontFamily: "'Space Grotesk', monospace",
        fontSize: "56px",
        fontWeight: 600,
        lineHeight: "72px",
        letterSpacing: "10px",
        color: isDark ? "#c94dff" : "#9333ea",
        opacity: isDark ? 0.14 : 0.16,
        filter: isDark ? "blur(2.5px)" : "blur(1.5px)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 40%, transparent 90%)",
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 40%, transparent 90%)",
      }}
    >
      {rows.map((row, i) => (
        <div key={i}>{row}</div>
      ))}
    </div>
  );
};
