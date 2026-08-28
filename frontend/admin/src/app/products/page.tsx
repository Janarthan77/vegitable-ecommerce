'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product, Category } from '@/types'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { ProductForm } from '@/components/admin/product-form'
import { Plus, Search, Edit, Trash2, Package, Cloud, RefreshCw } from 'lucide-react'
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
        toast.success('New product saved with Cloudflare image URL!')
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
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Vegetable Products 📦</h1>
          <p className="text-slate-500 font-medium">Manage vegetable prices, stock, and Cloudflare images</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <GlassButton onClick={loadData} size="sm" variant="secondary">
            <RefreshCw size={16} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </GlassButton>
          <GlassButton 
            onClick={() => { setEditingProduct(undefined); setIsFormOpen(true) }}
            className="bg-sky-600 hover:bg-sky-700 text-white border-sky-400 flex-1 sm:flex-none"
          >
            <Plus size={18} className="mr-1.5" /> Add Product
          </GlassButton>
        </div>
      </div>

      <GlassCard className="p-3 sm:p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products by English or Tamil name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/40 bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-sm text-slate-800"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === 'all' ? 'bg-sky-100 text-sky-700 border border-sky-200' : 'bg-white/50 text-slate-600 border border-white/40 hover:bg-white/80'}`}
            >
              All Items
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${selectedCategory === c.slug ? 'bg-sky-100 text-sky-700 border border-sky-200' : 'bg-white/50 text-slate-600 border border-white/40 hover:bg-white/80'}`}
              >
                <span>{c.emoji}</span> {c.name}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map(product => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
              key={product.id}
            >
              <GlassCard className="p-4 flex flex-col h-full border-t-4 border-t-transparent hover:border-t-sky-400 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white/70 rounded-xl flex items-center justify-center overflow-hidden shadow-sm border border-white/60 shrink-0 relative">
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
                      <h3 className="font-bold text-slate-800 line-clamp-1 flex items-center gap-1">
                        {product.name}
                        {product.imageUrl && (
                          <span title="Cloudflare Image URL active">
                            <Cloud size={12} className="text-sky-500" />
                          </span>
                        )}
                      </h3>
                      <p className="text-xs font-medium text-slate-500">{product.tamilName}</p>
                    </div>
                  </div>
                  <GlassBadge variant={product.inStock ? 'success' : 'danger'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </GlassBadge>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100/50">
                  <div>
                    <span className="font-bold text-slate-800 text-lg">{formatPrice(product.price)}</span>
                    <span className="text-xs text-slate-500 ml-1">/ {product.unit}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleToggleStock(product.id)}
                      className={`p-1.5 rounded-lg transition-colors ${product.inStock ? 'text-slate-400 hover:bg-rose-50 hover:text-rose-500' : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-500'}`}
                      title={product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                    >
                      <Package size={18} />
                    </button>
                    <button 
                      onClick={() => { setEditingProduct(product); setIsFormOpen(true) }}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-sky-50 hover:text-sky-500 transition-colors"
                      title="Edit Product & Cloudflare Photo"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12 text-slate-500">
          <Package size={48} className="mx-auto mb-4 opacity-20" />
          <p>No products found matching your filter.</p>
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
