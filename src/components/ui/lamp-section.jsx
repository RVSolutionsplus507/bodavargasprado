import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LampSection = ({
  children,
  className,
}) => {
  return (
    <div className={cn("relative flex min-h-screen flex-col items-center justify-center overflow-hidden w-full", className)}>
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: "conic-gradient(var(--wedding-primary) 0%, transparent 40%)",
          }}
          className="absolute inset-auto h-56 w-[30rem] bg-gradient-conic from-wedding-primary via-transparent to-transparent [--wedding-primary:rgb(var(--wedding-primary))] animate-pulse"
        />
        <div className="absolute inset-auto z-30 h-40 w-[30rem] bg-wedding-background dark:bg-wedding-background-dark [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}; 