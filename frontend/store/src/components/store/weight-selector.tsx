'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { WeightOption } from '@/types'

interface WeightSelectorProps {
  selectedWeight: number
  onWeightChange: (grams: number) => void
  unit?: string
}

export function WeightSelector({ selectedWeight, onWeightChange, unit = 'kg' }: WeightSelectorProps) {
  let options: WeightOption[] = [
    { label: '250g', grams: 250 },
    { label: '500g', grams: 500 },
    { label: '1 kg', grams: 1000 },
    { label: '2 kg', grams: 2000 },
  ]
  
  if (unit === 'piece') {
    options = [
      { label: '1 pc', grams: 1 },
      { label: '2 pc', grams: 2 },
      { label: '3 pc', grams: 3 },
      { label: '4 pc', grams: 4 },
      { label: '5 pc', grams: 5 },
    ]
  } else if (unit === 'bunch') {
    options = [
      { label: '1 bunch', grams: 1 },
      { label: '2 bunch', grams: 2 },
      { label: '3 bunch', grams: 3 },
    ]
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selectedWeight === option.grams
        
        return (
          <button
            key={option.label}
            onClick={() => onWeightChange(option.grams)}
            className={cn(
              'relative px-4 py-2 rounded-xl text-sm font-semibold transition-all',
              isSelected
                ? 'text-white shadow-sm shadow-[#14532D]/20'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="weight-indicator"
                className="absolute inset-0 bg-[#14532D] rounded-xl -z-10"
                initial={false}
                transition={{ type: 'spring', stiffness: 340, damping: 24 }}
              />
            )}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
