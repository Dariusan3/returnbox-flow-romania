import React, { useState } from 'react';
import { ReturnItemProps } from './ReturnItem';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PickupScheduler } from './PickupScheduler';
import { RefundCalculator } from './RefundCalculator';
import LoadingSpinner from './ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, Truck, Check, X, ChevronLeft } from 'lucide-react';

interface ReturnDetailsProps {
  returnItem: Omit<ReturnItemProps, 'onSelectItem'>;
  approvedReturns?: Omit<ReturnItemProps, 'onSelectItem'>[];
  onBack: () => void;
}

const ReturnDetails = ({ returnItem, approvedReturns = [], onBack }: ReturnDetailsProps) => {
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isDenying, setIsDenying] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState('');
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  
  const handleApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      toast({
        title: "Return approved",
        description: "Customer has been notified via email.",
      });
      onBack();
    }, 1500);
  };
  
  const handleDeny = () => {
    setIsDenying(true);
    setTimeout(() => {
      setIsDenying(false);
      toast({
        title: "Return denied",
        description: "Customer has been notified via email.",
      });
      onBack();
    }, 1500);
  };
  
  const handleConditionSelect = (condition: string) => {
    setSelectedCondition(condition);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="text-gray-500"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to list
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Return #{returnItem.orderNumber}</h1>
          <p className="text-gray-500 mb-2">Requested on {format(returnItem.dateRequested, 'PPP')}</p>
          <StatusBadge status={returnItem.status} className="text-sm" />
        </div>
        
        <div className="flex mt-4 md:mt-0">
          {returnItem.status === 'pending' ? (
            <>
              <Button 
                variant="outline" 
                className="mr-2 text-green-600 border-green-600 hover:bg-green-50"
                onClick={handleApprove}
                disabled={isApproving || isDenying}
              >
                {isApproving ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Approving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={handleDeny}
                disabled={isApproving || isDenying}
              >
                {isDenying ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Denying...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Deny
                  </>
                )}
              </Button>
            </>
          ) : returnItem.status === 'approved' ? (
            <Button 
              onClick={() => {}}
              disabled={false}
            >
              <>
                <Truck className="h-4 w-4 mr-2" />
                Generate AWB
              </>
            </Button>
          ) : null}
        </div>
      </div>
      
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {returnItem.status === 'approved' && (
            <TabsTrigger value="pickup">Schedule Pickup</TabsTrigger>
          )}
          <TabsTrigger value="refund">Estimated Refund</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-medium mb-4">Customer Information</h2>
              <div className="bg-returnbox-soft-gray p-4 rounded-lg">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Customer Name</p>
                  <p className="font-medium">{returnItem.customerName}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Email</p>
                  <div className="flex items-center">
                    <p className="font-medium">customer@example.com</p>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <div className="flex items-center">
                    <p className="font-medium">+40 721 234 567</p>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-4">Product Information</h2>
              <div className="bg-returnbox-soft-gray p-4 rounded-lg">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Product</p>
                  <p className="font-medium">{returnItem.productName}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Reason for Return</p>
                  <p className="font-medium">Size Issue</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Additional Details</p>
                  <p>The size is too small for me, I would like to exchange it for a larger size or get a refund.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Internal Notes</h2>
            <Textarea 
              placeholder="Add notes about this return (only visible to you)"
              className="min-h-[100px]"
              value={notes}
              onChange={handleNotesChange}
            />
            <div className="mt-2 text-right">
              <Button variant="outline" size="sm">Save Notes</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pickup">
          {returnItem.status === 'approved' && (
            <div className="border rounded-lg p-4">
              <PickupScheduler 
                returnId={returnItem.id}
                approvedReturns={approvedReturns}
                onScheduled={() => {
                  toast({
                    title: "Pickup scheduled",
                    description: "The pickup has been successfully scheduled.",
                  });
                  onBack();
                }}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="refund">
          <div className="border rounded-lg p-4">
            <RefundCalculator 
              merchantId={returnItem.merchantId}
              itemPrice={100}
              onConditionSelect={handleConditionSelect}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReturnDetails;
