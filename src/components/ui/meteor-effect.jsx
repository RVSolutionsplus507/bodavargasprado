import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const Meteors = ({
  number = 20,
  className,
}) => {
  const [meteorStyles, setMeteorStyles] = useState([]);

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      top: Math.floor(Math.random() * 100) + "%",
      left: Math.floor(Math.random() * 100) + "%",
      delay: Math.random() * 1 + "s",
      duration: Math.random() * 3 + 2 + "s",
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <div className={cn("fixed inset-0 overflow-hidden pointer-events-none", className)}>
      {meteorStyles.map((style, idx) => (
        <span
          key={"meteor" + idx}
          className="absolute h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-wedding-primary/50 shadow-[0_0_0_1px_#ffffff10]"
          style={{
            top: style.top,
            left: style.left,
            animationDelay: style.delay,
            animationDuration: style.duration,
          }}
        >
          <span className="absolute top-1/2 -translate-y-1/2 w-[50px] h-[1px] -right-[50px] bg-gradient-to-r from-wedding-primary to-transparent" />
        </span>
      ))}
    </div>
  );
}; 