'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product, Category } from '@/types'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { ProductForm } from '@/components/admin/product-form'
import { Plus, Search, Edit, Trash2, Package, RefreshCw } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  toggleStock,
  deleteProduct,
} from '@/lib/api'
import { toast } from 'sonner'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const [prods, cats] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ])
      setProducts(prods)
      setCategories(cats)
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to load products from API')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tamilName.includes(search)
    const categorySlug = typeof p.category === 'string' ? p.category : p.category?.slug
    const matchesCategory = selectedCategory === 'all' || categorySlug === selectedCategory || p.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id)
        setProducts(prev => prev.filter(p => p.id !== id))
        toast.success('Product deleted from database')
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete')
      }
    }
  }

  const handleToggleStock = async (id: string) => {
    try {
      const updated = await toggleStock(id)
      setProducts(prev => prev.map(p => p.id === id ? updated : p))
      toast.success(updated.inStock ? 'Marked In Stock' : 'Marked Out of Stock')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update stock')
    }
  }

  const handleSubmit = async (formData: Partial<Product>) => {
    try {
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, formData)
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p))
        toast.success('Product updated in database')
      } else {
        const created = await createProduct(formData)
        setProducts(prev => [created, ...prev])
        toast.success('New product saved successfully!')
      }
      setIsFormOpen(false)
      setEditingProduct(undefined)
    } catch (err: any) {
      toast.error(err.message || 'Save failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1A1A1A]">Vegetable Products 📦</h1>
          <p className="text-stone-500 font-sans text-sm mt-0.5">Manage vegetable inventory, pricing, and produce stock</p>
        </div>
        <div className="flex gap-2.5 w-full sm:w-auto">
          <GlassButton onClick={loadData} size="sm" variant="secondary">
            <RefreshCw size={15} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </GlassButton>
          <GlassButton 
            onClick={() => { setEditingProduct(undefined); setIsFormOpen(true) }}
            variant="primary"
            size="sm"
            className="flex-1 sm:flex-none"
          >
            <Plus size={16} className="mr-1.5" /> Add Product
          </GlassButton>
        </div>
      </div>

      <GlassCard className="p-3.5 sm:p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
            <input 
              type="text" 
              placeholder="Search products by English or Tamil name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/10 transition-all text-sm text-[#1A1A1A] placeholder:text-stone-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all' 
                  ? 'bg-[#14532D] text-white shadow-sm' 
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              All Items
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === c.slug 
                    ? 'bg-[#14532D] text-white shadow-sm' 
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <span>{c.emoji}</span> {c.name}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map(product => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              key={product.id}
            >
              <GlassCard className="p-4 flex flex-col h-full hover:border-[#14532D]/30 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-13 h-13 bg-[#F5F5F0] rounded-xl flex items-center justify-center overflow-hidden border border-stone-100 shrink-0 relative">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-2xl">{product.emoji}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-[#1A1A1A] text-sm line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs font-medium text-stone-400 font-sans mt-0.5">{product.tamilName}</p>
                    </div>
                  </div>
                  <GlassBadge variant={product.inStock ? 'success' : 'danger'} size="sm">
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </GlassBadge>
                </div>

                <div className="mt-auto pt-3.5 flex items-center justify-between border-t border-stone-100">
                  <div>
                    <span className="font-display font-bold text-[#B45309] text-base">{formatPrice(product.price)}</span>
                    <span className="text-xs text-stone-400 ml-1 font-sans">/ {product.unit}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => handleToggleStock(product.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        product.inStock 
                          ? 'text-stone-400 hover:bg-rose-50 hover:text-rose-500' 
                          : 'text-stone-400 hover:bg-emerald-50 hover:text-[#14532D]'
                      }`}
                      title={product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                    >
                      <Package size={17} />
                    </button>
                    <button 
                      onClick={() => { setEditingProduct(product); setIsFormOpen(true) }}
                      className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-[#14532D] transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit size={17} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12 text-stone-400">
          <Package size={42} className="mx-auto mb-3 opacity-30 text-[#14532D]" />
          <p className="font-sans text-sm">No products found matching your filter.</p>
        </div>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <ProductForm
            product={editingProduct}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => { setIsFormOpen(false); setEditingProduct(undefined) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
