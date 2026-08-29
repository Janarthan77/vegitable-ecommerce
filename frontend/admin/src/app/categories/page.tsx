'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Category } from '@/types'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { Plus, Edit, Trash2, X, Check, RefreshCw } from 'lucide-react'
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api'
import { toast } from 'sonner'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState<Partial<Category>>({
    name: '', tamilName: '', emoji: '🥬', slug: '', color: 'emerald'
  })

  const emojis = ['🥬', '🍅', '🧅', '🥔', '🥕', '🍆', '🧄', '🥦', '🥒', '🌶️', '🥥', '🍄', '🍋', '🍇', '🍉', '🍎']

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await fetchCategories()
      setCategories(data)
    } catch {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const openForm = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat)
      setFormData(cat)
    } else {
      setEditingCategory(undefined)
      setFormData({ name: '', tamilName: '', emoji: '🥬', slug: '', color: 'emerald' })
    }
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id)
        setCategories(prev => prev.filter(c => c.id !== id))
        toast.success('Category deleted')
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.tamilName || !formData.slug) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, formData)
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? updated : c))
        toast.success('Category updated successfully')
      } else {
        const created = await createCategory(formData)
        setCategories(prev => [...prev, created])
        toast.success('Category added successfully')
      }
      setIsFormOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Save failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1A1A1A]">Categories 📁</h1>
          <p className="text-stone-500 font-sans text-sm mt-0.5">Organize farm vegetables by category and groups</p>
        </div>
        <div className="flex gap-2.5 w-full sm:w-auto">
          <GlassButton onClick={loadCategories} size="sm" variant="secondary">
            <RefreshCw size={15} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </GlassButton>
          <GlassButton 
            onClick={() => openForm()}
            variant="primary"
            size="sm"
            className="flex-1 sm:flex-none"
          >
            <Plus size={16} className="mr-1.5" /> Add Category
          </GlassButton>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <AnimatePresence mode="popLayout">
          {categories.map(category => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              key={category.id}
            >
              <GlassCard className="p-4 flex items-center gap-3.5 group">
                <div className="w-13 h-13 bg-[#F5F5F0] rounded-xl flex items-center justify-center text-3xl shadow-sm shrink-0 border border-stone-100">
                  {category.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-[#1A1A1A] text-base truncate">{category.name}</h3>
                  <p className="text-xs text-stone-400 font-sans truncate mt-0.5">{category.tamilName}</p>
                  {category._count && (
                    <span className="text-[11px] text-[#14532D] font-semibold font-sans">{category._count.products} products</span>
                  )}
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button 
                    onClick={() => openForm(category)}
                    className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-[#14532D] transition-colors cursor-pointer"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          >
            <GlassCard className="w-full max-w-md bg-white p-6 relative shadow-2xl border border-stone-200">
              <button 
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
              
              <h2 className="font-display text-xl font-bold text-[#1A1A1A] mb-5 flex items-center gap-2">
                {editingCategory ? 'Edit Category' : 'Add Category'} 📁
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <GlassInput 
                    required 
                    label="Name (English) *"
                    value={formData.name || ''} 
                    onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} 
                    placeholder="e.g. Root Vegetables" 
                  />
                </div>
                <div>
                  <GlassInput 
                    required 
                    label="Name (Tamil) *"
                    value={formData.tamilName || ''} 
                    onChange={e => setFormData({...formData, tamilName: e.target.value})} 
                    placeholder="e.g. கிழங்கு வகைகள்" 
                  />
                </div>
                <div>
                  <GlassInput 
                    required 
                    label="URL Slug *"
                    value={formData.slug || ''} 
                    onChange={e => setFormData({...formData, slug: e.target.value})} 
                    placeholder="e.g. root-vegetables" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5 font-sans">Emoji Icon *</label>
                  <div className="grid grid-cols-8 gap-1.5 p-2 bg-[#FAFAF6] rounded-xl border border-stone-200">
                    {emojis.map(e => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setFormData({...formData, emoji: e})}
                        className={`text-xl p-1 rounded-lg transition-all cursor-pointer ${formData.emoji === e ? 'bg-white shadow-sm scale-110' : 'hover:bg-white'}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2.5 justify-end pt-3">
                  <GlassButton type="button" variant="secondary" size="sm" onClick={() => setIsFormOpen(false)}>
                    Cancel
                  </GlassButton>
                  <GlassButton type="submit" variant="primary" size="sm">
                    <Check size={16} className="mr-1.5" />
                    Save Category
                  </GlassButton>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
