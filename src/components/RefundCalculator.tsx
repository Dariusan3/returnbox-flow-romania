import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type RefundPolicy = Database['public']['Tables']['refund_policies']['Row'];

interface RefundCalculatorProps {
  merchantId: string;
  itemPrice: number;
  onConditionSelect?: (condition: string) => void;
}

export function RefundCalculator({ merchantId, itemPrice, onConditionSelect }: RefundCalculatorProps) {
  const [policies, setPolicies] = useState<RefundPolicy[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refundAmount, setRefundAmount] = useState<number>(0);

  useEffect(() => {
    fetchRefundPolicies();
  }, [merchantId]);

  const fetchRefundPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('refund_policies')
        .select('*')
        .eq('merchant_id', merchantId);

      if (error) throw error;
      setPolicies(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch refund policies');
    } finally {
      setLoading(false);
    }
  };

  const calculateRefund = (condition: string) => {
    const policy = policies.find(p => p.item_condition === condition);
    if (!policy) return 0;

    const refundAmount = (itemPrice * policy.refund_percentage) / 100;
    return Math.round(refundAmount * 100) / 100; // Round to 2 decimal places
  };

  const handleConditionChange = (condition: string) => {
    setSelectedCondition(condition);
    const calculatedRefund = calculateRefund(condition);
    setRefundAmount(calculatedRefund);
    onConditionSelect?.(condition);
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Estimated Refund Calculator</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Condition
          </label>
          <div className="grid grid-cols-1 gap-3">
            {policies.map((policy) => (
              <label
                key={policy.item_condition}
                className={`
                  flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                  ${selectedCondition === policy.item_condition
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'}
                `}
              >
                <input
                  type="radio"
                  name="condition"
                  value={policy.item_condition}
                  checked={selectedCondition === policy.item_condition}
                  onChange={(e) => handleConditionChange(e.target.value)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">
                      {policy.item_condition}
                    </span>
                    <span className="text-sm text-gray-500">
                      {policy.refund_percentage}% refund
                    </span>
                  </div>
                  {policy.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {policy.description}
                    </p>
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
    </div>
  );
}