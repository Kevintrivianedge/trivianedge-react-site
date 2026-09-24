import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FormInputAnimatedProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
}

export const FormInputAnimated: React.FC<FormInputAnimatedProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(!!value);

  return (
    <motion.div className="relative mb-6">
      <motion.label
        className="absolute left-4 text-sm font-medium text-text/60 pointer-events-none origin-left"
        animate={{
          y: isFocused || isFilled ? -24 : 0,
          scale: isFocused || isFilled ? 0.85 : 1,
          color: isFocused ? 'rgb(77, 188, 159)' : 'rgb(15, 23, 42, 0.6)',
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </motion.label>

      <motion.input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange?.(e);
          setIsFilled(!!e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setIsFilled(!!e.target.value);
          onBlur?.(e);
        }}
        className={`w-full px-4 py-3 pt-5 bg-white dark:bg-white/5 border rounded-lg transition-colors ${
          error
            ? 'border-red-500 dark:border-red-500/50'
            : 'border-border dark:border-white/10'
        }`}
        animate={{
          borderColor: isFocused
            ? 'rgb(77, 188, 159)'
            : error
              ? 'rgb(239, 68, 68)'
              : undefined,
        }}
        whileFocus={{
          boxShadow: `0 0 0 3px rgba(77, 188, 159, 0.1)`,
        }}
      />

      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-4 mt-1 text-xs text-red-500 font-medium"
        >
          {error}
        </motion.span>
      )}
    </motion.div>
  );
};

export default FormInputAnimated;
