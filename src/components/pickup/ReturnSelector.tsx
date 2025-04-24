
import React from 'react';
import type { Database } from '@/types/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Return = Database['public']['Tables']['returns']['Row'];

interface ReturnSelectorProps {
  approvedReturns: Return[];
  selectedReturnId: string;
  onReturnSelect: (returnId: string) => void;
}

export const ReturnSelector = ({
  approvedReturns = [],
  selectedReturnId,
  onReturnSelect,
}: ReturnSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Select Return
      </label>
      <Select value={selectedReturnId} onValueChange={onReturnSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an approved return" />
        </SelectTrigger>
        <SelectContent>
          {approvedReturns && approvedReturns.length > 0 ? (
            approvedReturns.map((returnItem) => (
              <SelectItem key={returnItem.id} value={returnItem.id}>
                Order #{returnItem.order_id} - {returnItem.product_name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-returns" disabled>
              No approved returns available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

