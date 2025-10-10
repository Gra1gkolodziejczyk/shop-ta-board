import React from 'react';

interface AvatarProps {
  firstname: string;
  lastname: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({firstname, lastname, size = 'md', className = ''}) => {
  const initials = `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full bg-gradient-to-br from-blue-500 to-purple-600
        flex items-center justify-center
        text-white font-semibold
        shadow-md
        ${className}
      `}
    >
      {initials}
    </div>
  );
};
