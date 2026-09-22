import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AnimatedFormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  showCharCount?: boolean;
  validation?: (value: string) => { valid: boolean; error?: string };
  required?: boolean;
  autoComplete?: string;
}

export const AnimatedFormInput: React.FC<AnimatedFormInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  maxLength,
  showCharCount = false,
  validation,
  required = false,
  autoComplete,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validationResult = validation ? validation(value) : { valid: true };
  const hasError = validation && !validationResult.valid;
  const charPercent = maxLength ? (value.length / maxLength) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      {/* Label */}
      <motion.label
        className="block text-sm font-semibold text-text mb-2"
        animate={{
          color: isFocused ? 'rgb(34, 197, 94)' : 'rgb(226, 232, 240)',
        }}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </motion.label>

      {/* Input wrapper */}
      <div className="relative">
        <motion.div
          className="relative"
          animate={{
            boxShadow: isFocused
              ? '0 0 0 3px rgba(0, 196, 154, 0.1), 0 0 20px rgba(0, 196, 154, 0.2)'
              : hasError
              ? '0 0 0 3px rgba(239, 68, 68, 0.1), 0 0 20px rgba(239, 68, 68, 0.1)'
              : '0 0 0 1px rgba(51, 65, 85, 0.3)',
          }}
          transition={{ duration: 0.3 }}
        >
          <input
            ref={inputRef}
            type={type === 'password' && !showPassword ? 'password' : 'text'}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            maxLength={maxLength}
            autoComplete={autoComplete}
            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-transparent text-white placeholder-slate-400 outline-none transition-colors duration-300 font-medium text-base"
          />

          {/* Password toggle */}
          {type === 'password' && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors p-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </motion.button>
          )}

          {/* Status icons */}
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            animate={{ scale: isFocused || value ? 1 : 0, opacity: isFocused || value ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {value && !hasError && validation && validationResult.valid && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
            {hasError && (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
          </motion.div>
        </motion.div>

        {/* Character counter */}
        {showCharCount && maxLength && (
          <div className="mt-2 flex items-center gap-2">
            <motion.div
              className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden"
              animate={{ opacity: isFocused || value ? 1 : 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                initial={{ width: '0%' }}
                animate={{ width: `${charPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.span
              className="text-xs text-muted"
              animate={{ color: charPercent > 90 ? 'rgb(239, 68, 68)' : 'rgb(148, 163, 184)' }}
            >
              {value.length}/{maxLength}
            </motion.span>
          </div>
        )}
      </div>

      {/* Error message with animation */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{
          opacity: hasError ? 1 : 0,
          y: hasError ? 0 : -5,
        }}
        transition={{ duration: 0.2 }}
        className="mt-2 text-sm text-red-400 flex items-center gap-1"
      >
        {hasError && (
          <>
            <AlertCircle className="w-4 h-4" />
            {validationResult.error}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedFormInput;
