'use client'

import { Search, X } from 'lucide-react'
import { useState, useMemo, useEffect, useRef } from 'react'
import { searchProducts } from '@/lib/data/products'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  
  const results = useMemo(() => {
    if (query.trim().length < 2) return []
    return searchProducts(query).slice(0, 5)
  }, [query])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full z-40">
      <div className="relative flex items-center w-full h-12 rounded-2xl bg-white/40 backdrop-blur-lg border border-white/30 overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all">
        <div className="grid place-items-center h-full w-12 text-gray-500">
          <Search className="h-5 w-5" />
        </div>
        <input
          className="peer h-full w-full outline-none text-sm text-gray-700 bg-transparent pr-2"
          type="text"
          id="search"
          placeholder="Search vegetables..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button 
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="grid place-items-center h-full w-12 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl overflow-hidden"
          >
            <ul className="py-2">
              {results.map((product) => (
                <li key={product.id}>
                  <Link 
                    href={`/product/${product.id}`}
                    onClick={() => {
                      setIsOpen(false)
                      setQuery('')
                    }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-white/50 transition-colors"
                  >
                    <span className="text-2xl">{product.emoji}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800">{product.name}</span>
                      <span className="text-xs text-emerald-600 font-medium">{formatPrice(product.price)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
        {isOpen && query.length >= 2 && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl overflow-hidden p-6 text-center text-gray-500 text-sm"
          >
            No vegetables found for "{query}"
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
