
import React from 'react';
import { TIME_SLOTS, PACKAGE_SIZES } from './pickupConstants';

interface PickupFormProps {
  formData: {
    pickup_date: string;
    time_slot: string;
    address: string;
    city: string;
    postal_code: string;
    package_size: string;
    notes?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const PickupForm = ({ formData, onChange }: PickupFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pickup Date
        </label>
        <input
          type="date"
          name="pickup_date"
          value={formData.pickup_date}
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
          rows={3}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
    </div>
  );
};
