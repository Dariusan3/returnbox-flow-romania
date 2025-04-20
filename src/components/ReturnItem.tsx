
import React from 'react';
import { format } from 'date-fns';
import { ReturnStatus } from './StatusBadge';
import StatusBadge from './StatusBadge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, X, MoreHorizontal, Truck } from 'lucide-react';

export interface ReturnItemProps {
  id: string;
  customerName: string;
  orderNumber: string;
  productName: string;
  status: ReturnStatus;
  dateRequested: Date;
  onSelectItem: (id: string) => void;
}

const ReturnItem = ({
  id,
  customerName,
  orderNumber,
  productName,
  status,
  dateRequested,
  onSelectItem,
}: ReturnItemProps) => {
  return (
    <div
      onClick={() => onSelectItem(id)}
      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer"
    >
      <div className="md:flex md:justify-between md:items-center">
        <div className="space-y-2 md:space-y-0 md:grid md:grid-cols-4 md:gap-4 md:items-center md:w-4/5">
          <div>
            <h3 className="font-medium">{customerName}</h3>
            <p className="text-sm text-gray-500">Order #{orderNumber}</p>
          </div>
          
          <div className="md:hidden text-xs text-gray-500">
            {format(dateRequested, 'PPP')}
          </div>
          
          <div className="truncate max-w-[200px]">
            {productName}
          </div>
          
          <div className="hidden md:block">
            {format(dateRequested, 'PPP')}
          </div>
          
          <StatusBadge status={status} />
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          {status === 'pending' && (
            <>
              <Button size="sm" variant="ghost" className="text-green-600">
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button size="sm" variant="ghost" className="text-red-600">
                <X className="h-4 w-4 mr-1" />
                Deny
              </Button>
            </>
          )}
          
          {status === 'approved' && (
            <Button size="sm" variant="outline" className="text-returnbox-blue">
              <Truck className="h-4 w-4 mr-1" />
              Generate AWB
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                Contact Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ReturnItem;
