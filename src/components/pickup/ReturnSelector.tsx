
import React from 'react';
import type { Database } from '@/types/supabase';
import type { ReturnItemProps } from '@/components/ReturnItem';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Return = Database['public']['Tables']['returns']['Row'];
type ReturnItem = Omit<ReturnItemProps, 'onSelectItem'>;

interface ReturnSelectorProps {
  approvedReturns: Return[] | ReturnItem[];
  selectedReturnId: string;
  onReturnSelect: (returnId: string) => void;
}

export const ReturnSelector = ({
  approvedReturns = [],
  selectedReturnId,
  onReturnSelect,
}: ReturnSelectorProps) => {
  // Helper function to determine whether the object is a ReturnItem or a Return
  const isReturnItem = (item: Return | ReturnItem): item is ReturnItem => {
    return 'productName' in item;
  };

  // Extract display information based on return type
  const getReturnDisplayInfo = (returnItem: Return | ReturnItem) => {
    if (isReturnItem(returnItem)) {
      // ReturnItem from ReturnItemProps
      return {
        orderId: returnItem.orderNumber || 'Unknown',
        productName: returnItem.productName || 'Unknown Product'
      };
    } else {
      // Database Return object
      return {
        orderId: returnItem.order_id || 'Unknown',
        productName: returnItem.product_name || 'Unknown Product'
      };
    }
  };

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
            approvedReturns.map((returnItem) => {
              const { orderId, productName } = getReturnDisplayInfo(returnItem);
              return (
                <SelectItem key={returnItem.id} value={returnItem.id}>
                  Order #{orderId} - {productName}
                </SelectItem>
              );
            })
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
