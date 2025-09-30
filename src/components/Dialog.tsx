import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X, ChevronLeft, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog.Root>
  );
};

export const DialogTrigger = RadixDialog.Trigger;

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  badge?: string;
  onBack?: () => void;
}

export const DialogContent: React.FC<DialogContentProps> = ({ 
  children, 
  className,
  title,
  badge,
  onBack
}) => {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
      <RadixDialog.Content 
        className={cn(
          "fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-secondary rounded-lg shadow-xl",
          className
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-secondary">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 hover:bg-hover rounded-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-text-secondary" />
              </button>
            )}
            {title && (
              <h2 className="text-lg font-medium text-text-primary flex items-center gap-2">
                {title}
                {badge && (
                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded">
                    {badge}
                  </span>
                )}
              </h2>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onBack && (
              <button className="p-1.5 hover:bg-hover rounded-md transition-colors">
                <Check className="w-5 h-5 text-text-secondary" />
              </button>
            )}
            <RadixDialog.Close asChild>
              <button className="p-1.5 hover:bg-hover rounded-md transition-colors">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </RadixDialog.Close>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
};