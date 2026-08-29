'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Product, Category } from '@/types'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassInput } from '@/components/ui/glass-input'
import { GlassButton } from '@/components/ui/glass-button'
import { X, Check, Upload, ImageIcon, Loader2 } from 'lucide-react'
import { uploadImage } from '@/lib/api'
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

  // Upload product image
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      toast.loading('Uploading photo...', { id: 'upload-img' })
      
      const uploadedUrl = await uploadImage(file)
      
      setFormData(prev => ({ ...prev, imageUrl: uploadedUrl }))
      toast.success('Photo uploaded successfully!', { id: 'upload-img' })
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Upload failed', { id: 'upload-img' })
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto"
    >
      <GlassCard className="w-full max-w-2xl bg-white p-6 relative my-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
        
        <h2 className="font-display text-2xl font-bold text-[#1A1A1A] mb-5 flex items-center gap-2">
          {product ? 'Edit Product' : 'Add New Product'} 📦
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Image Upload Section */}
          <div className="p-4 bg-[#FAFAF6] rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center gap-4">
            {/* Image Preview */}
            <div className="w-22 h-22 rounded-2xl bg-white border-2 border-dashed border-stone-300 flex items-center justify-center overflow-hidden shrink-0 relative shadow-sm">
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

            {/* Image Upload Controls */}
            <div className="flex-1 w-full space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#14532D] flex items-center gap-1.5 uppercase tracking-wider font-sans">
                  <ImageIcon size={15} className="text-[#14532D]" />
                  Product Photo
                </span>
                {formData.imageUrl && (
                  <span className="text-[10px] bg-[#DCFCE7] text-[#14532D] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Photo Added
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
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-3.5 py-1.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={14} /> Upload Photo
                    </>
                  )}
                </button>
              </div>

              {/* Direct URL input */}
              <input
                type="url"
                name="imageUrl"
                placeholder="Or paste direct image URL..."
                value={formData.imageUrl || ''}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#14532D] focus:ring-1 focus:ring-[#14532D] text-stone-800 placeholder:text-stone-400"
              />
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <GlassInput required label="English Name *" name="name" value={formData.name || ''} onChange={handleChange} placeholder="e.g. Country Tomato" />
            </div>
            <div>
              <GlassInput required label="Tamil Name (தமிழ் பெயர்) *" name="tamilName" value={formData.tamilName || ''} onChange={handleChange} placeholder="e.g. நாட்டு தக்காளி" />
            </div>
          </div>

          {/* Price, Unit, Discount */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div>
              <GlassInput required label="Price (₹) *" type="number" min="0" name="price" value={formData.price ?? 40} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5 font-sans">Unit *</label>
              <select 
                name="unit" 
                value={formData.unit || 'kg'} 
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/10 text-sm text-[#1A1A1A]"
              >
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <GlassInput label="Discount %" type="number" min="0" max="100" name="discount" value={formData.discount || ''} onChange={handleChange} placeholder="0" />
            </div>
          </div>

          {/* Category & Emoji */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5 font-sans">Category *</label>
              <select 
                name="categoryId" 
                value={formData.categoryId || (categories[0]?.id || '')} 
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/10 text-sm text-[#1A1A1A]"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name} ({c.tamilName})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5 font-sans">Emoji Icon</label>
              <div className="flex items-center gap-2">
                <GlassInput name="emoji" value={formData.emoji || '🥬'} onChange={handleChange} className="w-16 text-center text-xl" />
                <div className="flex flex-wrap gap-1">
                  {emojis.slice(0, 7).map(e => (
                    <button type="button" key={e} onClick={() => setFormData({...formData, emoji: e})} className="p-1 hover:bg-stone-100 rounded-md transition-colors text-lg cursor-pointer">
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5 font-sans">Description</label>
            <textarea 
              name="description" 
              value={formData.description || ''} 
              onChange={handleChange as any} 
              rows={2}
              placeholder="Freshly sourced quality vegetable details..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/10 text-sm text-[#1A1A1A] resize-none placeholder:text-stone-400"
            />
          </div>

          <div className="flex items-center gap-6 py-2 border-y border-stone-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="inStock" checked={formData.inStock ?? true} onChange={handleChange} className="w-4 h-4 rounded text-[#14532D] accent-[#14532D]" />
              <span className="text-xs font-medium text-stone-700">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isPopular" checked={formData.isPopular ?? false} onChange={handleChange} className="w-4 h-4 rounded text-[#14532D] accent-[#14532D]" />
              <span className="text-xs font-medium text-stone-700">Mark as Popular</span>
            </label>
          </div>

          <div className="flex gap-2.5 justify-end pt-2">
            <GlassButton type="button" variant="secondary" size="sm" onClick={onCancel}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" size="sm">
              <Check size={16} className="mr-1.5" />
              {product ? 'Save Changes' : 'Add Product'}
            </GlassButton>
          </div>
        </form>
      </GlassCard>
    </motion.div>
  )
}
