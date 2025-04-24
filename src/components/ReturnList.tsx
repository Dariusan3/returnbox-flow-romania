
import React, { useState } from 'react';
import ReturnItem, { ReturnItemProps } from './ReturnItem';
import ReturnDetails from './ReturnDetails';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

// Mock data
const mockReturns: Omit<ReturnItemProps, 'onSelectItem'>[] = [
  {
    id: '1',
    customerName: 'Ana Popescu',
    orderNumber: '34521',
    productName: 'Summer Floral Dress',
    status: 'pending',
    dateRequested: new Date('2025-04-18'),
    merchantId: 'merchant-123', // Added merchantId
  },
  {
    id: '2',
    customerName: 'Ion Marin',
    orderNumber: '34492',
    productName: 'Leather Sneakers - White',
    status: 'approved',
    dateRequested: new Date('2025-04-17'),
    merchantId: 'merchant-123', // Added merchantId
  },
  {
    id: '3',
    customerName: 'Maria Ionescu',
    orderNumber: '34487',
    productName: 'Denim Jacket - Medium',
    status: 'denied',
    dateRequested: new Date('2025-04-15'),
    merchantId: 'merchant-123', // Added merchantId
  },
  {
    id: '4',
    customerName: 'Andrei Popescu',
    orderNumber: '34456',
    productName: 'Winter Gloves - Black',
    status: 'completed',
    dateRequested: new Date('2025-04-12'),
    merchantId: 'merchant-123', // Added merchantId
  },
  {
    id: '5',
    customerName: 'Elena Dragomir',
    orderNumber: '34442',
    productName: 'Cotton T-Shirt - Blue',
    status: 'approved',
    dateRequested: new Date('2025-04-10'),
    merchantId: 'merchant-123', // Added merchantId
  },
];

const ReturnList = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
  };
  
  const filteredReturns = mockReturns.filter((item) => {
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesSearch = 
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.orderNumber.includes(searchQuery) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });
  
  const selectedItem = mockReturns.find((item) => item.id === selectedItemId);
  
  return (
    <div className="animate-fade-in">
      {selectedItem ? (
        <ReturnDetails 
          returnItem={selectedItem} 
          onBack={() => setSelectedItemId(null)} 
        />
      ) : (
        <>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
            <h1 className="text-2xl font-semibold">Return Requests</h1>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search returns..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400 h-4 w-4" />
                <Select value={selectedStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredReturns.length > 0 ? (
              filteredReturns.map((item) => (
                <ReturnItem
                  key={item.id}
                  {...item}
                  onSelectItem={handleSelectItem}
                />
              ))
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">No return requests found.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReturnList;
