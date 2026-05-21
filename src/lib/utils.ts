import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Reusable utility to merge class names dynamically (using clsx and tailwind-merge)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
