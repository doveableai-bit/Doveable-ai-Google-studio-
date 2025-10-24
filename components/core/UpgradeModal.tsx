import React from 'react';
import { DoveIcon, CloseIcon } from '../ui/Icons';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// In a real application, this would come from a database and be managed by an admin.
const subscriptionPlans = [
  { id: 1, coins: 20, price: 1, price_id: 'price_basic_20' },
  { id: 2, coins: 30, price: 2, price_id: 'price_pro_30' },
];

// This should also be configurable in an admin panel.
const paymentLinkBase = "https://buy.stripe.com/your_test_mode_link";

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-secondary rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700 relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <CloseIcon className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-6">
          <div className="inline-block bg-primary p-3 rounded-xl mb-4">
            <DoveIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Daily Limit Reached</h2>
          <p className="text-gray-400 mt-1">You've used today's free coins. Upgrade to keep building.</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-300 uppercase">Upgrade Fee</p>
          {subscriptionPlans.map((plan) => (
             <div key={plan.id} className="bg-primary p-4 rounded-lg border border-gray-600 flex justify-between items-center">
                <div>
                    <p className="text-lg font-bold text-white">{plan.coins} credits</p>
                    <p className="text-sm text-gray-400">Purchased coins never expire.</p>
                </div>
                <a 
                    href={`${paymentLinkBase}_${plan.price_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-2 rounded-lg transition"
                >
                    ${plan.price}
                </a>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
            <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-300">
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
