import React, { useState } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { Button } from '../components/Button';
import { CircularProgress } from '../components/CircularProgress';
import { ChevronLeft, Check, X } from 'lucide-react';

interface HCPTargetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
}

export const HCPTargetingDialog: React.FC<HCPTargetingDialogProps> = ({
  open,
  onOpenChange,
  onDone
}) => {
  const [currentStep, setCurrentStep] = useState<'setup' | 'details'>('setup');

  const currentValueItems = [
    { label: 'Odaiazol, Breast Cancer, HRE2+ 2L Therapy, XPO TRx', checked: true },
    { label: 'OncoThera Copay Card PSP Claims', checked: false }
  ];

  const potentialItems = [
    { label: 'Odaiazol, Breast Cancer, HRE2+ 2L Therapy, XPO TRx', checked: true },
    { label: 'OncoThera Copay Card PSP Claims', checked: false }
  ];

  const competitiveStrategyItems = [
    { label: '20% importance on 2L Therapy HER+ Overall Market, XPO TRx', checked: true },
    { label: '50% importance on 2L Therapy HER+ submarket 1, XPO TRx', checked: true },
    { label: '30% importance on 2L Therapy HER+ submarket 2, XPO TRx', checked: true },
    { label: '10% importance on competitive brand PixelTron, XPO NBRx', checked: true }
  ];

  const patientMixItems = [
    { label: '20% 1L Therapy HER+ Market, XPO TRx', checked: true },
    { label: '80% Payer mix: Medicaid, Medicare', checked: true }
  ];

  if (currentStep === 'details') {
    return (
      <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
        <RadixDialog.Portal>
          <RadixDialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
          <RadixDialog.Content 
            className="fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] bg-bg-secondary rounded-lg shadow-xl"
            aria-describedby="dialog-description-details"
          >
            <RadixDialog.Title className="sr-only">Value Engine: HCP Targeting Details</RadixDialog.Title>
            <RadixDialog.Description id="dialog-description-details" className="sr-only">
              Configure HCP targeting value engine settings in detail
            </RadixDialog.Description>

            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentStep('setup')}
                  className="p-1.5 hover:bg-bg-hover rounded-md transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                  Value Engine: HCP Targeting
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

            <div className="p-6">
              <div className="flex gap-8">
                <div className="flex-shrink-0">
                  <CircularProgress value={70} max={30} size="md" label="Current Value / Potential" />
                  
                  <div className="mt-6 text-center">
                    <h3 className="text-sm font-medium text-white mb-2">PowerScore Setup: HCP Value definition</h3>
                    <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                      Set the weight of historic performance (current value) and potential, factor in 
                      competitive market dynamics and patient mix, and generate a PowerScore to 
                      guide your targeting.
                    </p>
                    <div className="flex items-center justify-center mt-3">
                      <Check className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-xs text-gray-400">Using Established Product Default</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">Current Value: 70%</h3>
                      <p className="text-xs text-gray-400 mb-3">
                        Current value of an HCP based on historical writing of Odaiazol
                      </p>
                      <div className="space-y-2">
                        {currentValueItems.map((item, index) => (
                          <label key={index} className="flex items-start gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              className="mt-0.5 w-4 h-4 bg-bg-dark border-gray-700 rounded"
                              readOnly
                            />
                            <span className="text-gray-400">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">Potential: 30%</h3>
                      <p className="text-xs text-gray-400 mb-3">
                        Potential based on HCPs competitive writing and patient mix
                      </p>
                      <div className="space-y-2">
                        {potentialItems.map((item, index) => (
                          <label key={index} className="flex items-start gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              className="mt-0.5 w-4 h-4 bg-bg-dark border-gray-700 rounded"
                              readOnly
                            />
                            <span className="text-gray-400">{item.label}</span>
                          </label>
                        ))}
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-xs font-medium text-white mb-2">Competitive Strategy: 80%</h4>
                        <div className="space-y-2">
                          {competitiveStrategyItems.map((item, index) => (
                            <label key={index} className="flex items-start gap-2 text-xs">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                className="mt-0.5 w-4 h-4 bg-bg-dark border-gray-700 rounded"
                                readOnly
                              />
                              <span className="text-gray-400">{item.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-xs font-medium text-white mb-2">Patient Mix: 20%</h4>
                        <div className="space-y-2">
                          {patientMixItems.map((item, index) => (
                            <label key={index} className="flex items-start gap-2 text-xs">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                className="mt-0.5 w-4 h-4 bg-bg-dark border-gray-700 rounded"
                                readOnly
                              />
                              <span className="text-gray-400">{item.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={onDone} variant="primary">
                      Done
                    </Button>
                    <Button onClick={() => {}} variant="secondary">
                      Advanced Edit
                    </Button>
                    <Button onClick={() => onOpenChange(false)} variant="ghost">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </RadixDialog.Content>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    );
  }

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
        <RadixDialog.Content 
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-bg-secondary rounded-lg shadow-xl"
          aria-describedby="dialog-description"
        >
          <RadixDialog.Title className="sr-only">Value Engine: HCP Targeting</RadixDialog.Title>
          <RadixDialog.Description id="dialog-description" className="sr-only">
            Configure HCP targeting value engine settings
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
                Value Engine: HCP Targeting
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

          <div className="p-6">
            <div className="text-center mb-8">
              <CircularProgress value={70} max={30} size="lg" label="Current Value / Potential" />
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-lg font-medium text-white mb-2">PowerScore Setup: HCP Value definition</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Set the weight of historic performance (current value) and potential, factor in 
                competitive market dynamics and patient mix, and generate a PowerScore to 
                guide your targeting.
              </p>
              <div className="flex items-center justify-center mt-4">
                <Check className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm text-gray-400">Using Established Product Default</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-base font-medium text-white mb-2">Current Value: 70%</h3>
                <p className="text-sm text-gray-400">
                  Current value of an HCP based on historical writing of Odaiazol
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-white mb-2">Potential: 30%</h3>
                <p className="text-sm text-gray-400">
                  Potential based on HCPs competitive writing and patient mix
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setCurrentStep('details')} variant="primary">
                View Details
              </Button>
              <Button onClick={onDone} variant="secondary">
                Done
              </Button>
              <Button onClick={() => onOpenChange(false)} variant="ghost">
                Cancel
              </Button>
            </div>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};