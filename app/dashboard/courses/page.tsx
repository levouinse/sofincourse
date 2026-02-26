'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, X, FileText } from 'lucide-react'

interface Course {
  id: string
  slug: string
  title: string
  description: string
  category: string
  thumbnail_url?: string
  order_index: number
  published: boolean
}

export default function CoursesManagement() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({ slug: '', title: '', description: '', category: 'coding', thumbnail_url: '', order_index: 0, published: true })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const loadCourses = useCallback(async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        router.push('/login')
        return
      }
      
      // GET doesn't need auth token - courses are public
      const response = await fetch('/api/admin/courses')
      
      if (!response.ok) {
        console.error('Failed to fetch courses:', response.status)
        setLoading(false)
        return
      }
      
      const data = await response.json()

      setCourses(data.courses || [])
      setLoading(false)
    } catch (error) {
      console.error('Load courses error:', error)
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (!user) router.push('/login')
      else loadCourses()
    })
  }, [router, loadCourses])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      const user = auth.currentUser
      if (!user) return
      
      const token = await user.getIdToken()
      const response = await fetch(`/api/admin/courses/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) setCourses(courses.filter(c => c.id !== id))
      else alert('Failed to delete')
    } catch { alert('Error deleting') }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const user = auth.currentUser
      if (!user) {
        alert('Please login first')
        router.push('/login')
        return
      }
      
      const token = await user.getIdToken()
      const url = editingCourse ? `/api/admin/courses/${editingCourse.id}` : '/api/admin/courses'
      const method = editingCourse ? 'PUT' : 'POST'
      
      // Prepare data - remove empty strings
      const payload = {
        slug: formData.slug,
        title: formData.title,
        description: formData.description || '',
        category: formData.category,
        thumbnail_url: formData.thumbnail_url || '',
        order_index: formData.order_index,
        published: formData.published
      }
      
      const response = await fetch(url, { 
        method, 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }, 
        body: JSON.stringify(payload) 
      })
      
      if (response.ok) {
        await loadCourses()
        setShowModal(false)
        setEditingCourse(null)
        setFormData({ slug: '', title: '', description: '', category: 'coding', thumbnail_url: '', order_index: 0, published: true })
      } else {
        const error = await response.json()
        console.error('Save error:', error)
        alert(error.error || 'Failed to save course')
      }
    } catch (err) { 
      console.error('Save error:', err)
      alert('Error saving course') 
    }
    setSaving(false)
  }

  const openCreate = () => {
    setEditingCourse(null)
    setFormData({ slug: '', title: '', description: '', category: 'coding', thumbnail_url: '', order_index: courses.length, published: true })
    setShowModal(true)
  }

  const openEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({ slug: course.slug, title: course.title, description: course.description || '', category: course.category, thumbnail_url: course.thumbnail_url || '', order_index: course.order_index, published: course.published })
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f14] cyber-grid">
        <nav className="border-b border-[#282d35] bg-[#0f1419]/80 backdrop-blur-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4"><div className="h-8 w-56 bg-[#282d35] animate-pulse rounded"></div></div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-8 w-48 bg-[#282d35] animate-pulse rounded mb-6"></div>
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="bg-[#0f1419] border border-[#282d35] rounded-lg p-6"><div className="h-6 w-3/4 bg-[#282d35] animate-pulse rounded mb-3"></div><div className="h-4 w-full bg-[#282d35] animate-pulse rounded"></div></div>)}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f14] cyber-grid">
      <nav className="border-b border-[#282d35] bg-[#0f1419]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#9bff00] font-mono">&gt; COURSES MANAGEMENT_</h1>
          <Link href="/dashboard"><Button variant="ghost" className="text-gray-400 hover:text-[#9bff00]"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button></Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-200">All Courses ({courses.length})</h2>
          <Button onClick={openCreate} className="bg-[#9bff00] hover:bg-[#7acc00] text-black font-bold"><Plus className="w-4 h-4 mr-2" />Create Course</Button>
        </div>

        <div className="grid gap-4">
          {courses.map(course => (
            <Card key={course.id} className="bg-[#0f1419] border-[#282d35] hover:border-[#9bff00] transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-200">{course.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded font-mono ${course.published ? 'bg-[#9bff00]/10 text-[#9bff00] border border-[#9bff00]/30' : 'bg-gray-500/10 text-gray-500 border border-gray-500/30'}`}>{course.published ? 'PUBLISHED' : 'DRAFT'}</span>
                      <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded font-mono">{course.category?.toUpperCase()}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-2">{course.description}</p>
                    <p className="text-xs text-gray-600 font-mono">Slug: {course.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/courses/${course.id}`}><Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300" title="Manage Lessons"><FileText className="w-4 h-4" /></Button></Link>
                    <Button onClick={() => openEdit(course)} variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300" title="Edit Course"><Edit className="w-4 h-4" /></Button>
                    <Button onClick={() => handleDelete(course.id, course.title)} variant="ghost" size="sm" className="text-red-400 hover:text-red-300" title="Delete Course"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1419] border border-[#282d35] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#282d35] flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#9bff00] font-mono">{editingCourse ? 'EDIT COURSE' : 'CREATE COURSE'}</h2>
              <Button onClick={() => setShowModal(false)} variant="ghost" size="sm" className="text-gray-400 hover:text-red-400"><X className="w-5 h-5" /></Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="course-slug" className="block text-sm text-gray-400 mb-2">Slug *</label>
                <input 
                  id="course-slug"
                  name="slug"
                  type="text"
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} 
                  className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-3 py-2 text-gray-200" 
                  placeholder="intro-to-python" 
                />
              </div>
              <div>
                <label htmlFor="course-title" className="block text-sm text-gray-400 mb-2">Title *</label>
                <input 
                  id="course-title"
                  name="title"
                  type="text"
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-3 py-2 text-gray-200" 
                  placeholder="Introduction to Python" 
                />
              </div>
              <div>
                <label htmlFor="course-description" className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea 
                  id="course-description"
                  name="description"
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-3 py-2 text-gray-200 h-24" 
                  placeholder="Learn Python basics..." 
                />
              </div>
              <div>
                <label htmlFor="course-category" className="block text-sm text-gray-400 mb-2">Category *</label>
                <select 
                  id="course-category"
                  name="category"
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-3 py-2 text-gray-200"
                >
                  <option value="coding">Coding</option>
                  <option value="security">Security</option>
                  <option value="language">Language</option>
                </select>
              </div>
              <div>
                <label htmlFor="course-thumbnail" className="block text-sm text-gray-400 mb-2">Thumbnail URL</label>
                <input 
                  id="course-thumbnail"
                  name="thumbnail_url"
                  type="url"
                  value={formData.thumbnail_url} 
                  onChange={e => setFormData({...formData, thumbnail_url: e.target.value})} 
                  className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-3 py-2 text-gray-200" 
                  placeholder="https://..." 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="course-order" className="block text-sm text-gray-400 mb-2">Order</label>
                  <input 
                    id="course-order"
                    name="order_index"
                    type="number" 
                    value={formData.order_index} 
                    onChange={e => setFormData({...formData, order_index: parseInt(e.target.value) || 0})} 
                    className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-3 py-2 text-gray-200" 
                  />
                </div>
                <div>
                  <label htmlFor="course-published" className="block text-sm text-gray-400 mb-2">Published</label>
                  <select 
                    id="course-published"
                    name="published"
                    value={formData.published ? 'true' : 'false'} 
                    onChange={e => setFormData({...formData, published: e.target.value === 'true'})} 
                    className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-3 py-2 text-gray-200"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#282d35] flex justify-end gap-3">
              <Button onClick={() => setShowModal(false)} variant="ghost" className="text-gray-400 hover:text-gray-200">Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !formData.slug || !formData.title} className="bg-[#9bff00] hover:bg-[#7acc00] text-black">{saving ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
