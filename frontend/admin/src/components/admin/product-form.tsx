'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Product, Category } from '@/types'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassInput } from '@/components/ui/glass-input'
import { GlassButton } from '@/components/ui/glass-button'
import { X, Check, Upload, Cloud, Image as ImageIcon, Loader2 } from 'lucide-react'
import { uploadImageToCloudflare } from '@/lib/api'
import { toast } from 'sonner'

interface ProductFormProps {
  product?: Product
  categories: Category[]
  onSubmit: (product: Partial<Product>) => Promise<void> | void
  onCancel: () => void
}

export function ProductForm({ product, categories, onSubmit, onCancel }: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      tamilName: '',
      price: 40,
      unit: 'kg',
      categoryId: categories[0]?.id || '',
      imageUrl: '',
      emoji: '🥬',
      description: '',
      inStock: true,
      isPopular: false,
      discount: 0,
    }
  )

  const emojis = ['🥬', '🍅', '🧅', '🥔', '🥕', '🍆', '🧄', '🥦', '🥒', '🌶️', '🥥', '🍄', '🍋', '🫑', '🫛', '🥢']
  const units = ['kg', 'g', 'piece', 'bunch']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : type === 'number' ? Number(value) : value
    }))
  }

  // Upload image to Cloudflare R2
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      toast.loading('Uploading photo to Cloudflare R2...', { id: 'cf-upload' })
      
      const cloudflareUrl = await uploadImageToCloudflare(file)
      
      setFormData(prev => ({ ...prev, imageUrl: cloudflareUrl }))
      toast.success('Image saved to Cloudflare! URL stored.', { id: 'cf-upload' })
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Upload failed', { id: 'cf-upload' })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.tamilName || formData.price === undefined) {
      toast.error('Please fill required fields')
      return
    }
    await onSubmit(formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm overflow-y-auto"
    >
      <GlassCard className="w-full max-w-2xl bg-white/90 p-6 relative my-8 shadow-2xl border border-white/60 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          {product ? 'Edit Product' : 'Add New Product'} 📦
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cloudflare Image Upload Section */}
          <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-200/60 flex flex-col sm:flex-row items-center gap-4">
            {/* Image Preview */}
            <div className="w-24 h-24 rounded-2xl bg-white border-2 border-dashed border-sky-300 flex items-center justify-center overflow-hidden shrink-0 relative group shadow-sm">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Product"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-4xl">{formData.emoji || '🥬'}</span>
              )}
            </div>

            {/* Cloudflare Upload Controls */}
            <div className="flex-1 w-full space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-sky-900 flex items-center gap-1.5">
                  <Cloud size={16} className="text-sky-600" />
                  Cloudflare Image Storage
                </span>
                {formData.imageUrl && (
                  <span className="text-[11px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-medium">
                    URL Stored in DB
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <GlassButton
                  type="button"
                  size="sm"
                  variant="primary"
                  className="bg-sky-600 hover:bg-sky-700 text-white"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-1.5" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={16} className="mr-1.5" /> Upload to Cloudflare
                    </>
                  )}
                </GlassButton>
              </div>

              {/* Direct URL input */}
              <input
                type="url"
                name="imageUrl"
                placeholder="Or paste Cloudflare / web image URL..."
                value={formData.imageUrl || ''}
                onChange={handleChange}
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-sky-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-slate-700"
              />
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">English Name *</label>
              <GlassInput required name="name" value={formData.name || ''} onChange={handleChange} placeholder="e.g. Country Tomato" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tamil Name (தமிழ் பெயர்) *</label>
              <GlassInput required name="tamilName" value={formData.tamilName || ''} onChange={handleChange} placeholder="e.g. நாட்டு தக்காளி" />
            </div>
          </div>

          {/* Price, Unit, Discount */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹) *</label>
              <GlassInput required type="number" min="0" name="price" value={formData.price ?? 40} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unit *</label>
              <select 
                name="unit" 
                value={formData.unit || 'kg'} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-white/40 bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-slate-800"
              >
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Discount %</label>
              <GlassInput type="number" min="0" max="100" name="discount" value={formData.discount || ''} onChange={handleChange} placeholder="0" />
            </div>
          </div>

          {/* Category & Emoji */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select 
                name="categoryId" 
                value={formData.categoryId || (categories[0]?.id || '')} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-white/40 bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-slate-800"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name} ({c.tamilName})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Emoji Icon</label>
              <div className="flex items-center gap-2">
                <GlassInput name="emoji" value={formData.emoji || '🥬'} onChange={handleChange} className="w-16 text-center text-xl" />
                <div className="flex flex-wrap gap-1">
                  {emojis.slice(0, 7).map(e => (
                    <button type="button" key={e} onClick={() => setFormData({...formData, emoji: e})} className="p-1.5 hover:bg-white/60 rounded-md transition-colors text-xl">
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              name="description" 
              value={formData.description || ''} 
              onChange={handleChange as any} 
              rows={2}
              placeholder="Freshly sourced quality vegetable details..."
              className="w-full px-4 py-2.5 rounded-xl border border-white/40 bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-slate-800 resize-none text-sm"
            />
          </div>

          <div className="flex items-center gap-6 py-2 border-y border-slate-200/50">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="inStock" checked={formData.inStock ?? true} onChange={handleChange} className="w-5 h-5 rounded text-sky-500 focus:ring-sky-500" />
              <span className="text-sm font-medium text-slate-700">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isPopular" checked={formData.isPopular ?? false} onChange={handleChange} className="w-5 h-5 rounded text-sky-500 focus:ring-sky-500" />
              <span className="text-sm font-medium text-slate-700">Mark as Popular</span>
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <GlassButton type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" className="bg-sky-600 hover:bg-sky-700 text-white border-sky-400">
              <Check size={18} className="mr-2" />
              {product ? 'Save Changes' : 'Add Product'}
            </GlassButton>
          </div>
        </form>
      </GlassCard>
    </motion.div>
  )
}
