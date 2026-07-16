import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

type ClearableFieldProps = {
  hasValue: boolean;
  onClear: () => void;
  /** Extra right padding / clear-button offset for trailing icons (e.g. select chevron). */
  trailing?: 'none' | 'select' | 'combobox';
  clearLabel?: string;
  className?: string;
  children: React.ReactNode;
};

const ClearableField: React.FC<ClearableFieldProps> = ({
  hasValue,
  onClear,
  trailing = 'none',
  clearLabel = 'Clear',
  className,
  children,
}) => {
  const clearRight = trailing === 'select' ? 'right-8' : trailing === 'combobox' ? 'right-9' : 'right-2';

  return (
    <div className={cn('relative w-full', className)}>
      {children}
      {hasValue && (
        <button
          type="button"
          aria-label={clearLabel}
          className={cn(
            'absolute top-1/2 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground',
            clearRight,
          )}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClear();
          }}
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
};

export default ClearableField;
