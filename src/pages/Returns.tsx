import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { format } from 'date-fns';
import { Package, Image, Check, X, FileText } from 'lucide-react';

interface ReturnRequest {
  id: string;
  order_id: string;
  product_name: string;
  reason: string;
  customer_email: string;
  photo_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  notes: string | null;
  created_at: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  let variant: 'default' | 'destructive' | 'outline' | 'secondary' = 'default';
  let label = status.charAt(0).toUpperCase() + status.slice(1);
  
  switch (status) {
    case 'pending':
      variant = 'secondary';
      break;
    case 'approved':
      variant = 'default';
      break;
    case 'rejected':
      variant = 'destructive';
      break;
    default:
      variant = 'outline';
  }
  
  return <Badge variant={variant}>{label}</Badge>;
};

const Returns = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [notes, setNotes] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Fetch returns for the merchant
  useEffect(() => {
    const fetchReturns = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('returns')
          .select('*')
          .eq('merchant_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setReturns(data || []);
      } catch (error) {
        console.error('Error fetching returns:', error);
        toast({
          title: 'Error',
          description: 'Failed to load return requests.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReturns();
  }, [user, toast]);
  
  // Handle status change
  const handleStatusChange = async (returnId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('returns')
        .update({ status: newStatus })
        .eq('id', returnId);
        
      if (error) throw error;
      
      // Update local state
      setReturns(returns.map(item => 
        item.id === returnId ? { ...item, status: newStatus } : item
      ));
      
      toast({
        title: 'Status updated',
        description: `Return request marked as ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Update failed',
        description: 'Could not update the return status.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle notes update
  const handleNotesUpdate = async () => {
    if (!selectedReturn) return;
    
    try {
      const { error } = await supabase
        .from('returns')
        .update({ notes })
        .eq('id', selectedReturn.id);
        
      if (error) throw error;
      
      // Update local state
      setReturns(returns.map(item => 
        item.id === selectedReturn.id ? { ...item, notes } : item
      ));
      
      setDialogOpen(false);
      toast({
        title: 'Notes updated',
        description: 'Return notes have been saved',
      });
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        title: 'Update failed',
        description: 'Could not save the notes.',
        variant: 'destructive',
      });
    }
  };
  
  const openNotesDialog = (returnItem: ReturnRequest) => {
    setSelectedReturn(returnItem);
    setNotes(returnItem.notes || '');
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Layout showSidebar merchantName={user?.store_name}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar merchantName={user?.store_name}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Return Requests</h1>
        </div>
        
        {returns.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No return requests yet</h3>
            <p className="text-gray-500">
              When customers submit return requests, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableCaption>A list of your return requests.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returns.map((returnItem) => (
                  <TableRow key={returnItem.id}>
                    <TableCell className="font-medium">{returnItem.order_id}</TableCell>
                    <TableCell>{returnItem.product_name}</TableCell>
                    <TableCell>{returnItem.customer_email}</TableCell>
                    <TableCell>{format(new Date(returnItem.created_at), 'dd MMM yyyy')}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={returnItem.status}
                        onValueChange={(value) => 
                          handleStatusChange(
                            returnItem.id, 
                            value as 'pending' | 'approved' | 'rejected'
                          )
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue>
                            <StatusBadge status={returnItem.status} />
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">
                            <div className="flex items-center">
                              <span className="bg-gray-200 rounded-full h-2 w-2 mr-2"></span>
                              <span>Pending</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="approved">
                            <div className="flex items-center">
                              <Check className="h-4 w-4 mr-2 text-green-500" />
                              <span>Approved</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="rejected">
                            <div className="flex items-center">
                              <X className="h-4 w-4 mr-2 text-red-500" />
                              <span>Rejected</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog open={dialogOpen && selectedReturn?.id === returnItem.id} onOpenChange={(open) => !open && setDialogOpen(false)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openNotesDialog(returnItem)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Notes
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Return Notes</DialogTitle>
                              <DialogDescription>
                                Add internal notes about this return request.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <p className="text-sm font-medium mb-1">Order: {selectedReturn?.order_id}</p>
                                <p className="text-sm text-gray-500 mb-4">Product: {selectedReturn?.product_name}</p>
                              </div>
                              <Textarea
                                placeholder="Add your internal notes here..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={5}
                              />
                            </div>
                            <div className="flex justify-end gap-3">
                              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleNotesUpdate}>
                                Save Notes
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {returnItem.photo_url && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Image className="h-4 w-4 mr-1" />
                                Photo
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Return Photo</DialogTitle>
                              </DialogHeader>
                              <div className="p-4">
                                <img 
                                  src={returnItem.photo_url} 
                                  alt="Return item" 
                                  className="w-full rounded-md"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Package className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Return Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <h4 className="text-sm font-medium mb-1">Order ID</h4>
                                <p className="text-sm text-gray-700">{returnItem.order_id}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">Product</h4>
                                <p className="text-sm text-gray-700">{returnItem.product_name}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">Customer</h4>
                                <p className="text-sm text-gray-700">{returnItem.customer_email}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">Return Reason</h4>
                                <p className="text-sm text-gray-700">{returnItem.reason}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">Status</h4>
                                <StatusBadge status={returnItem.status} />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">Date Submitted</h4>
                                <p className="text-sm text-gray-700">
                                  {format(new Date(returnItem.created_at), 'PPP')}
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Returns;
