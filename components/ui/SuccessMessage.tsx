/**
 * Componente de Mensagem de Sucesso
 * Exibe mensagens de sucesso
 */

import { CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export default function SuccessMessage({
  message,
  onDismiss,
  className = '',
}: SuccessMessageProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-green-700 dark:text-green-400 ${className}`}
      role="alert"
    >
      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 rounded-md p-1 text-green-700 dark:text-green-400 hover:bg-green-500/20 transition-colors"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}




