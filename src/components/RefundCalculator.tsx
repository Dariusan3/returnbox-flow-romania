
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type RefundPolicy = Database['public']['Tables']['refund_policies']['Row'];

interface RefundCalculatorProps {
  merchantId: string;
  itemPrice: number;
  onConditionSelect?: (condition: string) => void;
}

const CONDITIONS = [
  { id: 'new', label: 'New with tags', percentage: 100 },
  { id: 'like_new', label: 'Like new', percentage: 90 },
  { id: 'good', label: 'Good condition', percentage: 75 },
  { id: 'fair', label: 'Fair condition', percentage: 50 },
  { id: 'poor', label: 'Poor condition', percentage: 25 },
];

export function RefundCalculator({ merchantId, itemPrice, onConditionSelect }: RefundCalculatorProps) {
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [refundAmount, setRefundAmount] = useState<number>(0);

  const calculateRefund = (condition: string) => {
    const policy = CONDITIONS.find(p => p.id === condition);
    if (!policy) return 0;
    return (itemPrice * policy.percentage) / 100;
  };

  const handleConditionChange = (condition: string) => {
    setSelectedCondition(condition);
    const calculatedRefund = calculateRefund(condition);
    setRefundAmount(calculatedRefund);
    onConditionSelect?.(condition);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Estimated Refund Calculator</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select the condition of your item to see the estimated refund amount.
        </p>
        <div className="space-y-3">
          {CONDITIONS.map((condition) => (
            <label
              key={condition.id}
              className={`
                flex items-center p-4 border rounded-lg cursor-pointer transition-colors
                ${selectedCondition === condition.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'}
              `}
            >
              <input
                type="radio"
                name="condition"
                value={condition.id}
                checked={selectedCondition === condition.id}
                onChange={(e) => handleConditionChange(e.target.value)}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {condition.label}
                  </span>
                  <span className="text-sm text-gray-500">
                    {condition.percentage}% refund
                  </span>
                </div>
                {selectedCondition === condition.id && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-700">
                      Expected refund amount: ${calculateRefund(condition.id).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {selectedCondition && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Original Price:</span>
            <span className="font-medium">${itemPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Estimated Refund:</span>
            <span className="font-bold text-lg text-green-600">
              ${refundAmount.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
