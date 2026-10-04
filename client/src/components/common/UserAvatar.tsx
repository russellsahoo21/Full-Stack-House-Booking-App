import React from 'react';

interface UserAvatarProps {
  name?: string;
  avatar?: string | null;
  className?: string;
  textClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const sizeClasses: Record<string, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-7 h-7 text-xs',
  md: 'w-10 h-10 text-sm font-bold',
  lg: 'w-12 h-12 text-base font-bold',
  xl: 'w-16 h-16 text-xl font-bold',
  '2xl': 'w-20 h-20 sm:w-24 sm:h-24 text-2xl sm:text-3xl font-extrabold',
};

// Gradient color palettes deterministic by initial letter
const initialGradients = [
  'from-[#FF5A5F] via-[#FF7A59] to-[#FFB347]',
  'from-[#6366F1] via-[#8B5CF6] to-[#D946EF]',
  'from-[#06B6D4] via-[#0EA5E9] to-[#3B82F6]',
  'from-[#10B981] via-[#059669] to-[#047857]',
  'from-[#F59E0B] via-[#D97706] to-[#B45309]',
  'from-[#EC4899] via-[#F43F5E] to-[#E11D48]',
  'from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9]',
];

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = '',
  avatar = '',
  className = '',
  textClassName = '',
  size = 'md',
}) => {
  const initial = (name?.trim()?.[0] || 'U').toUpperCase();

  // Deterministically select gradient so user's letter color stays steady
  const charCode = initial.charCodeAt(0) || 0;
  const gradient = initialGradients[charCode % initialGradients.length];

  const baseSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white shrink-0 select-none shadow-sm uppercase font-display tracking-wider ${baseSize} ${className}`}
      title={name || 'User'}
    >
      <span className={textClassName}>{initial}</span>
    </div>
  );
};

export default UserAvatar;
