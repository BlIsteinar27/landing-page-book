'use client';

import { motion } from 'motion/react';

interface NavigationDotsProps {
  count: number;
  activeIndex: number;
  onIndexChange: (index: number) => void;
  size?: 'small' | 'medium' | 'large';
  showTooltips?: boolean;
  tooltips?: string[];
  tooltipPosition?: 'left' | 'right';
  orientation?: 'horizontal' | 'vertical';
}

const sizeConfig = {
  small: { default: 'w-2 h-2', active: 'w-4' },
  medium: { default: 'w-3 h-3', active: 'w-6' },
  large: { default: 'w-4 h-4', active: 'w-8' },
};

export default function NavigationDots({
  count,
  activeIndex,
  onIndexChange,
  size = 'medium',
  showTooltips = false,
  tooltips = [],
  tooltipPosition = 'right',
  orientation = 'horizontal',
}: NavigationDotsProps) {
  const config = sizeConfig[size];
  const tooltipClass = tooltipPosition === 'left'
    ? 'absolute right-full mr-3 top-1/2 -translate-y-1/2'
    : 'absolute left-full ml-3 top-1/2 -translate-y-1/2';
  const containerClass = orientation === 'vertical'
    ? 'flex flex-col items-center gap-3'
    : 'flex justify-center gap-2';

  return (
    <div className={containerClass}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="relative group">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onIndexChange(index)}
            aria-label={`Navegar a ${tooltips[index] || `elemento ${index + 1}`}`}
            className={`rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base ${
              index === activeIndex
                ? `bg-accent ${config.active}`
                : `bg-ink-muted hover:bg-ink-tertiary ${config.default}`
            }`}
          />
          {showTooltips && tooltips[index] && (
            <div className={`${tooltipClass} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap`}>
              <div className="bg-surface-1 border border-border-default rounded-lg px-3 py-1.5 shadow-xl">
                <p className="text-xs text-ink-primary">{tooltips[index]}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
