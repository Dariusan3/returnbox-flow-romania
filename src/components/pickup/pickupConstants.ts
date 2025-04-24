
type TimeSlotOption = {
  id: 'morning' | 'afternoon' | 'evening';
  label: string;
};

type PackageSizeOption = {
  id: 'small' | 'medium' | 'large';
  label: string;
};

export const TIME_SLOTS: TimeSlotOption[] = [
  { id: 'morning', label: 'Morning (9:00 - 12:00)' },
  { id: 'afternoon', label: 'Afternoon (12:00 - 17:00)' },
  { id: 'evening', label: 'Evening (17:00 - 20:00)' },
];

export const PACKAGE_SIZES: PackageSizeOption[] = [
  { id: 'small', label: 'Small (up to 2kg)' },
  { id: 'medium', label: 'Medium (2-5kg)' },
  { id: 'large', label: 'Large (5-10kg)' },
];
