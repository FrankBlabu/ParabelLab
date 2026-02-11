/**
 * FeedbackMessage component
 *
 * Shows contextual feedback for exercise steps.
 */

import React, { useEffect } from 'react';

export type FeedbackVariant = 'correct' | 'incorrect' | 'hint';

export interface FeedbackMessageProps {
  readonly variant: FeedbackVariant;
  readonly message?: string;
  readonly onDismiss?: () => void;
  readonly autoDismissMs?: number;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = function FeedbackMessage({
  variant,
  message,
  onDismiss,
  autoDismissMs = 4000,
}: FeedbackMessageProps) {
  useEffect(() => {
    if (!onDismiss || autoDismissMs <= 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      onDismiss();
    }, autoDismissMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [autoDismissMs, onDismiss]);

  let styles = 'bg-green-50 border-green-400 text-green-800';
  let icon = '✓';
  let defaultMessage = 'Richtig! Gut gemacht.';

  if (variant === 'incorrect') {
    styles = 'bg-red-50 border-red-400 text-red-800';
    icon = '✗';
    defaultMessage = 'Leider falsch. Versuche es nochmal.';
  } else if (variant === 'hint') {
    styles = 'bg-yellow-50 border-yellow-400 text-yellow-900';
    icon = '💡';
    defaultMessage = 'Hinweis anzeigen.';
  }

  return (
    <div
      className={`flex items-start gap-3 border-2 rounded-lg p-4 ${styles}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      data-testid="feedback-message"
    >
      <span className="text-xl" aria-hidden="true">
        {icon}
      </span>
      <div className="flex-1 text-sm md:text-base">
        {message ?? defaultMessage}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-sm font-semibold hover:underline"
        >
          Schliessen
        </button>
      )}
    </div>
  );
};

export default FeedbackMessage;
