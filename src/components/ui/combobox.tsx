import * as React from 'react';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import { cn } from 'src/lib/utils';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';

type ComboboxProps = {
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
  searchPlaceholder?: string;
  emptyText?: string;
  clearLabel?: string;
  className?: string;
  getOptionLabel?: (option: string) => string;
};

export function Combobox({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder = 'Search…',
  emptyText = 'No results.',
  clearLabel = 'Clear',
  className,
  getOptionLabel = (option) => option,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const rootRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => getOptionLabel(option).toLowerCase().includes(q));
  }, [getOptionLabel, options, query]);

  React.useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    const focusTimer = window.setTimeout(() => searchRef.current?.focus(), 0);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn('relative w-full', className)}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn(
          'h-8 w-full justify-between font-normal',
          !value && 'text-muted-foreground',
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="truncate">{value ? getOptionLabel(value) : placeholder}</span>
        <span className="ml-2 flex shrink-0 items-center gap-1">
          {value && (
            <span
              role="button"
              tabIndex={0}
              aria-label={clearLabel}
              className="rounded-sm p-0.5 opacity-60 hover:bg-white/10 hover:opacity-100"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(null);
                }
              }}
            >
              <XIcon className="size-3.5" />
            </span>
          )}
          <ChevronsUpDownIcon className="size-3.5 opacity-50" />
        </span>
      </Button>

      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-[100] w-full min-w-[14rem] rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-md ring-1 ring-foreground/10">
          <Input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="mb-2"
          />
          <div className="max-h-60 overflow-y-auto overscroll-contain">
            {filtered.length === 0 ? (
              <p className="px-2 py-3 text-center text-sm text-muted-foreground">{emptyText}</p>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {filtered.map((option) => {
                  const selected = value === option;
                  return (
                    <li key={option}>
                      <button
                        type="button"
                        className={cn(
                          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground',
                          selected && 'bg-accent/60',
                        )}
                        onClick={() => {
                          onChange(selected ? null : option);
                          setOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn('size-4 shrink-0', selected ? 'opacity-100' : 'opacity-0')}
                        />
                        <span className="truncate">{getOptionLabel(option)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
