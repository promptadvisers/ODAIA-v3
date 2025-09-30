import React, { useState } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { Button } from '../components/Button';
import { ChevronLeft, Check, X } from 'lucide-react';

interface BrandAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
}

export const BrandAccessDialog: React.FC<BrandAccessDialogProps> = ({
  open,
  onOpenChange,
  onDone
}) => {
  const [pspProgram, setPspProgram] = useState('OncoConnect PSP');
  const [finicalSupport, setFinicalSupport] = useState('OncoThera Copay Card');

  const handleDone = () => {
    onDone();
  };

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
        <RadixDialog.Content 
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-bg-secondary rounded-lg shadow-xl"
          aria-describedby="dialog-description"
        >
          <RadixDialog.Title className="sr-only">Brand Access Strategy</RadixDialog.Title>
          <RadixDialog.Description id="dialog-description" className="sr-only">
            Configure brand access strategy settings
          </RadixDialog.Description>
          
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenChange(false)}
                className="p-1.5 hover:bg-bg-hover rounded-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <h2 className="text-lg font-medium text-white flex items-center gap-2">
                Brand Access Strategy
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded">
                  Missing info
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-bg-hover rounded-md transition-colors">
                <Check className="w-5 h-5 text-gray-400" />
              </button>
              <RadixDialog.Close asChild>
                <button className="p-1.5 hover:bg-bg-hover rounded-md transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </RadixDialog.Close>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                PSP Program
              </label>
              <input
                value={pspProgram}
                onChange={(e) => setPspProgram(e.target.value)}
                className="w-full px-3 py-2 bg-bg-dark text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter PSP Program"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Finical Support
              </label>
              <input
                value={finicalSupport}
                onChange={(e) => setFinicalSupport(e.target.value)}
                className="w-full px-3 py-2 bg-bg-dark text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Finical Support"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Web Portal
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-bg-dark border border-red-500/50 rounded-md">
                <span className="w-5 h-5 rounded-full border-2 border-gray-500 flex items-center justify-center">
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                </span>
                <span className="text-white">None</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Market Access
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-bg-dark border border-red-500/50 rounded-md">
                <span className="w-5 h-5 rounded-full border-2 border-gray-500 flex items-center justify-center">
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                </span>
                <span className="text-white">None</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleDone} variant="primary">
                Done
              </Button>
              <Button onClick={() => onOpenChange(false)} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};