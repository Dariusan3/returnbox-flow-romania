
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { toast } from '@/hooks/use-toast';
import { ReturnSelector } from './pickup/ReturnSelector';
import { PickupForm } from './pickup/PickupForm';
import type { ReturnItemProps } from './ReturnItem';

type Pickup = Database['public']['Tables']['pickups']['Insert'];
type Return = Database['public']['Tables']['returns']['Row'];
type TimeSlot = 'morning' | 'afternoon' | 'evening';
type PackageSize = 'small' | 'medium' | 'large';

interface PickupSchedulerProps {
  returnId?: string;
  onScheduled: () => void;
  approvedReturns?: Omit<ReturnItemProps, 'onSelectItem'>[] | Return[];
}

export function PickupScheduler({ returnId, onScheduled, approvedReturns = [] }: PickupSchedulerProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchedReturns, setFetchedReturns] = useState<Return[]>([]);
  const [selectedReturnId, setSelectedReturnId] = useState(returnId || '');

  const [formData, setFormData] = useState({
    pickup_date: '',
    time_slot: 'morning' as TimeSlot,
    address: user?.address || '',
    city: user?.city || '',
    postal_code: user?.postal_code || '',
    package_size: 'medium' as PackageSize,
    notes: '',
  });

  useEffect(() => {
    const fetchApprovedReturns = async () => {
      if (!user || approvedReturns.length > 0) return;

      try {
        const { data, error } = await supabase
          .from('returns')
          .select('*')
          .eq('merchant_id', user.id)
          .eq('status', 'approved');

        if (error) throw error;
        setFetchedReturns(data || []);
      } catch (err) {
        console.error('Error fetching approved returns:', err);
        toast({
          title: 'Error',
          description: 'Failed to load approved returns.',
          variant: 'destructive',
        });
      }
    };

    fetchApprovedReturns();
  }, [user, approvedReturns]);

  // Use provided returns or fetched returns
  const returnsToDisplay = approvedReturns.length > 0 ? approvedReturns : fetchedReturns;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturnId) {
      toast({
        title: "Error",
        description: "Please select a return to schedule pickup for",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!user) throw new Error('User not authenticated');

      // Mock courier API call
      const mockCourierResponse = await mockScheduleCourier({
        date: formData.pickup_date,
        timeSlot: formData.time_slot,
        address: formData.address,
      });

      const pickup: Pickup = {
        user_id: user.id,
        return_id: selectedReturnId,
        pickup_date: formData.pickup_date,
        time_slot: formData.time_slot,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code,
        package_size: formData.package_size,
        courier_tracking_number: mockCourierResponse.trackingNumber,
        notes: formData.notes,
      };

      // Create pickup record
      const { error: insertError } = await supabase
        .from('pickups')
        .insert([pickup]);

      if (insertError) throw insertError;

      // Update return status to shipped
      const { error: updateError } = await supabase
        .from('returns')
        .update({ status: 'shipped' })
        .eq('id', selectedReturnId);

      if (updateError) throw updateError;

      onScheduled();
      toast({
        title: 'Success',
        description: 'Your pickup has been successfully scheduled.',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule pickup');
      toast({
        title: 'Error',
        description: 'Failed to schedule pickup. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  // Mock courier API integration
  const mockScheduleCourier = async (data: { date: string; timeSlot: TimeSlot; address: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      trackingNumber: `TR${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    };
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Schedule Pickup</h2>
      
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <ReturnSelector
          approvedReturns={returnsToDisplay as Return[]}
          selectedReturnId={selectedReturnId}
          onReturnSelect={setSelectedReturnId}
        />

        <PickupForm 
          formData={formData}
          onChange={handleInputChange}
        />

        <button
          type="submit"
          disabled={loading || !selectedReturnId}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Scheduling...' : 'Schedule Pickup'}
        </button>
      </form>
    </div>
  );
}
