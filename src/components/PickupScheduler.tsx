import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { toast } from '@/hooks/use-toast';

type Pickup = Database['public']['Tables']['pickups']['Insert'];

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning (9:00 - 12:00)' },
  { id: 'afternoon', label: 'Afternoon (12:00 - 17:00)' },
  { id: 'evening', label: 'Evening (17:00 - 20:00)' },
];

const PACKAGE_SIZES = [
  { id: 'small', label: 'Small (up to 2kg)' },
  { id: 'medium', label: 'Medium (2-5kg)' },
  { id: 'large', label: 'Large (5-10kg)' },
];

interface PickupSchedulerProps {
  returnId: string;
  onScheduled: () => void;
}

export function PickupScheduler({ returnId, onScheduled }: PickupSchedulerProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<Pickup>>({
    pickup_date: '',
    time_slot: 'morning',
    address: user?.address || '',
    city: user?.city || '',
    postal_code: user?.postal_code || '',
    package_size: 'medium',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user) throw new Error('User not authenticated');

      // Mock courier API call
      const mockCourierResponse = await mockScheduleCourier({
        date: formData.pickup_date!,
        timeSlot: formData.time_slot!,
        address: formData.address!,
      });

      const pickup: Pickup = {
        user_id: user.id,
        return_id: returnId || crypto.randomUUID(),
        pickup_date: formData.pickup_date!,
        time_slot: formData.time_slot!,
        address: formData.address!,
        city: formData.city!,
        postal_code: formData.postal_code!,
        package_size: formData.package_size!,
        courier_tracking_number: mockCourierResponse.trackingNumber,
        notes: formData.notes,
      };

      const { error: insertError } = await supabase
        .from('pickups')
        .insert([pickup]);

      if (insertError) throw insertError;

      onScheduled();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule pickup');
    } finally {
      setLoading(false);
      toast({
        title: 'Success',
        description: 'Your pickup has been successfully scheduled.',
        variant: 'default',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Mock courier API integration
  const mockScheduleCourier = async (data: { date: string; timeSlot: string; address: string }) => {
    // Simulate API call delay
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Date
          </label>
          <input
            type="date"
            name="pickup_date"
            value={formData.pickup_date}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Slot
          </label>
          <select
            name="time_slot"
            value={formData.time_slot}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            {TIME_SLOTS.map(slot => (
              <option key={slot.id} value={slot.id}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Package Size
          </label>
          <select
            name="package_size"
            value={formData.package_size}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            {PACKAGE_SIZES.map(size => (
              <option key={size.id} value={size.id}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Scheduling...' : 'Schedule Pickup'}
        </button>
      </form>
    </div>
  );
}