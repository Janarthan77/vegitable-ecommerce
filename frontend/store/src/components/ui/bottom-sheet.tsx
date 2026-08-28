'use client'

import { Drawer } from 'vaul'
import { ReactNode } from 'react'

interface BottomSheetProps {
  children: ReactNode
  trigger?: ReactNode
  title?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function BottomSheet({
  children,
  trigger,
  title,
  open,
  onOpenChange,
}: BottomSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-t border-white/30 rounded-t-3xl max-h-[85vh] overflow-y-auto outline-none">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" />
          {title && (
            <div className="p-4 pt-0">
              <h2 className="text-lg font-bold text-gray-800">{title}</h2>
            </div>
          )}
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
