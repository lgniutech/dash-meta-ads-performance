import { ReactNode } from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass";
  animate?: boolean;
}

export function Card({ 
  children, 
  className, 
  variant = "default", 
  animate = true 
}: CardProps) {
  const Component = animate ? motion.div : "div";
  
  return (
    <Component
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true }}
      className={cn(
        "rounded-3xl p-6",
        variant === "default" && "bg-card border border-card-border",
        variant === "glass" && "glass-card",
        className
      )}
    >
      {children}
    </Component>
  );
}
