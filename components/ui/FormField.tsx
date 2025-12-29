/**
 * Componente de Campo de Formulário
 * Com validação em tempo real e feedback visual
 */

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  validate?: (value: string) => string | null;
  className?: string;
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error: externalError,
  required = false,
  placeholder,
  validate,
  className = '',
}: FormFieldProps) {
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const error = externalError || internalError;
  const isValid = touched && !error && value.length > 0;

  useEffect(() => {
    if (touched && validate) {
      const validationError = validate(value);
      setInternalError(validationError);
    }
  }, [value, touched, validate]);

  const handleBlur = () => {
    setTouched(true);
    if (validate) {
      const validationError = validate(value);
      setInternalError(validationError);
    }
    onBlur?.();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            error
              ? 'border-destructive focus:border-destructive focus:ring-destructive'
              : isValid
              ? 'border-green-500 focus:border-green-500'
              : 'border-input bg-background'
          } ${className}`}
        />
        {touched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {error ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : isValid ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : null}
          </div>
        )}
      </div>
      {touched && error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}




