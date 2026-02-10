import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text';
  children: React.ReactNode;
  icon?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, icon, className, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center px-8 py-3 text-sm tracking-widest uppercase transition-all duration-300 ease-out font-medium";
  
  const variants = {
    primary: "bg-stone-900 text-stone-50 hover:bg-accent hover:text-white shadow-lg hover:shadow-xl",
    outline: "border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-stone-50",
    text: "text-stone-900 hover:text-accent underline decoration-1 underline-offset-4"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className || ''}`}
      {...props}
    >
      {children}
      {icon && <ArrowRight className="ml-2 w-4 h-4" />}
    </motion.button>
  );
};