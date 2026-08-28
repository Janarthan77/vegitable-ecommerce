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
              'relative px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              isSelected ? 'text-white' : 'bg-white/40 backdrop-blur-sm border border-white/30 text-gray-700 hover:bg-white/60'
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="weight-indicator"
                className="absolute inset-0 bg-emerald-500 rounded-xl -z-10"
                initial={false}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            )}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
