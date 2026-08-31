'use client'

import { Search, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { fetchProducts } from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export function SearchBar() {
  const [query, setQuery]   = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(() => {
      fetchProducts({ search: query.trim() })
        .then((items) => {
          if (items && Array.isArray(items)) {
            setResults(items.slice(0, 6))
          }
        })
        .catch(() => setResults([]))
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Input */}
      <div
        className="flex items-center w-full h-12 rounded-xl overflow-hidden transition-all duration-200"
        style={{
          background: '#ffffff',
          border: `1.5px solid ${focused ? '#14532D' : '#E7E5E4'}`,
          boxShadow: focused ? '0 0 0 3px rgba(20,83,45,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        <div className="grid place-items-center w-12 h-full flex-shrink-0">
          <Search className="w-4 h-4 text-stone-400" />
        </div>
        <input
          className="h-full w-full outline-none text-sm text-[#1A1A1A] bg-transparent placeholder:text-stone-400 font-sans font-medium pr-2"
          type="text"
          placeholder="Search vegetables, herbs..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
          onFocus={() => { setFocused(true); setIsOpen(true) }}
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.12 }}
              onClick={() => { setQuery(''); setIsOpen(false) }}
              className="grid place-items-center w-10 h-full flex-shrink-0 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl overflow-hidden z-50 border border-stone-100"
          >
            {results.map((product, idx) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                onClick={() => { setIsOpen(false); setQuery('') }}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-[#FAFAF6] transition-colors ${
                  idx < results.length - 1 ? 'border-b border-stone-50' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#F5F5F0] flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    product.emoji
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-semibold text-[#1A1A1A] truncate">{product.name}</p>
                  {product.tamilName && (
                    <p className="text-[10px] text-stone-400 font-sans">{product.tamilName}</p>
                  )}
                </div>
                <span className="text-sm font-bold text-[#B45309] flex-shrink-0">
                  {formatPrice(product.price)}
                </span>
              </Link>
            ))}
          </motion.div>
        )}

        {isOpen && query.length >= 2 && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl z-50 border border-stone-100 p-6 text-center"
          >
            <p className="text-3xl mb-2">🔍</p>
            <p className="font-display text-sm font-semibold text-[#1A1A1A]">No results for "{query}"</p>
            <p className="text-xs text-stone-400 mt-1">Try searching in Tamil or English</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
