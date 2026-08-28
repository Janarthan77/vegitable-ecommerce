'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Category } from '@/types'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { Plus, Edit, Trash2, FolderTree, X, Check, RefreshCw } from 'lucide-react'
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
  const colors = ['emerald', 'orange', 'rose', 'purple', 'sky', 'yellow', 'lime']

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await fetchCategories()
      setCategories(data)
    } catch (err: any) {
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
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Categories 📁</h1>
          <p className="text-slate-500 font-medium">Organize vegetables by category</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <GlassButton onClick={loadCategories} size="sm" variant="secondary">
            <RefreshCw size={16} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </GlassButton>
          <GlassButton 
            onClick={() => openForm()}
            className="bg-sky-600 hover:bg-sky-700 text-white border-sky-400 flex-1 sm:flex-none"
          >
            <Plus size={18} className="mr-1.5" /> Add Category
          </GlassButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {categories.map(category => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
              key={category.id}
            >
              <GlassCard className={`p-5 flex items-center gap-4 border-l-4 border-l-sky-500 group`}>
                <div className={`w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0`}>
                  {category.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-lg truncate">{category.name}</h3>
                  <p className="text-sm font-medium text-slate-500 truncate">{category.tamilName}</p>
                  {category._count && (
                    <span className="text-xs text-sky-600 font-medium">{category._count.products} products</span>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button 
                    onClick={() => openForm(category)}
                    className="p-2 rounded-xl text-slate-400 hover:bg-sky-50 hover:text-sky-500 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-2 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={18} />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm"
          >
            <GlassCard className="w-full max-w-md bg-white/90 p-6 relative shadow-2xl">
              <button 
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                {editingCategory ? 'Edit Category' : 'Add Category'} 📁
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name (English) *</label>
                  <GlassInput 
                    required 
                    value={formData.name || ''} 
                    onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} 
                    placeholder="e.g. Root Vegetables" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name (Tamil) *</label>
                  <GlassInput required value={formData.tamilName || ''} onChange={e => setFormData({...formData, tamilName: e.target.value})} placeholder="e.g. கிழங்கு வகைகள்" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug *</label>
                  <GlassInput required value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="e.g. root-vegetables" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Emoji *</label>
                  <div className="grid grid-cols-8 gap-2 p-3 bg-white/50 rounded-xl border border-white/40">
                    {emojis.map(e => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setFormData({...formData, emoji: e})}
                        className={`text-xl p-1 rounded-lg transition-colors ${formData.emoji === e ? 'bg-sky-100 scale-110' : 'hover:bg-white/80'}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <GlassButton type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>
                    Cancel
                  </GlassButton>
                  <GlassButton type="submit" variant="primary" className="bg-sky-600 hover:bg-sky-700 text-white border-sky-400">
                    <Check size={18} className="mr-2" />
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
