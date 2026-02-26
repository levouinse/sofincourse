'use client'
export const dynamic = 'force-dynamic'


import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, X } from 'lucide-react'

interface Course {
  id: string
  title: string
}

interface Lesson {
  id: string
  slug: string
  title: string
  content_markdown: string
  video_url?: string
  video_provider?: string
  pdf_url?: string
  content_type: string
  order_index: number
}

export default function LessonsManagement() {
  const params = useParams()
  const courseId = params.id as string
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [formData, setFormData] = useState({ 
    course_id: courseId,
    slug: '', 
    title: '', 
    content_markdown: '', 
    video_url: '', 
    video_provider: 'youtube',
    pdf_url: '',
    content_type: 'text',
    order_index: 0 
  })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const loadData = async () => {
    try {
      // Load course info
      const courseRes = await fetch('/api/admin/courses')
      const courseData = await courseRes.json()
      const foundCourse = courseData.courses?.find((c: { id: string }) => c.id === courseId)
      setCourse(foundCourse)

      // Load lessons
      const lessonsRes = await fetch(`/api/admin/lessons?course_id=${courseId}`)
      const lessonsData = await lessonsRes.json()
      setLessons(Array.isArray(lessonsData) ? lessonsData : [])
      setLoading(false)
    } catch (err) {
      console.error('Load error:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (!user) router.push('/login')
      else loadData()
    })
  }, [router, courseId, loadData])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      const response = await fetch(`/api/admin/lessons/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setLessons(lessons.filter(l => l.id !== id))
      } else alert('Failed to delete')
    } catch { alert('Error deleting') }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editingLesson ? `/api/admin/lessons/${editingLesson.id}` : '/api/admin/lessons'
      const method = editingLesson ? 'PUT' : 'POST'
      
      const payload = { ...formData, course_id: courseId }
      
      const response = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      })
      
      if (response.ok) {
        await loadData()
        setShowModal(false)
        setEditingLesson(null)
        setFormData({ course_id: courseId, slug: '', title: '', content_markdown: '', video_url: '', video_provider: 'youtube', pdf_url: '', content_type: 'text', order_index: 0 })
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save lesson')
      }
    } catch (err) { 
      console.error('Save error:', err)
      alert('Error saving lesson') 
    }
    setSaving(false)
  }

  const openCreate = () => {
    setEditingLesson(null)
    setFormData({ course_id: courseId, slug: '', title: '', content_markdown: '', video_url: '', video_provider: 'youtube', pdf_url: '', content_type: 'text', order_index: lessons.length })
    setShowModal(true)
  }

  const openEdit = (lesson: any) => {
    setEditingLesson(lesson)
    setFormData({ 
      course_id: courseId,
      slug: lesson.slug || '', 
      title: lesson.title, 
      content_markdown: lesson.content_markdown || '', 
      video_url: lesson.video_url || '', 
      video_provider: lesson.video_provider || 'youtube',
      pdf_url: lesson.pdf_url || '',
      content_type: lesson.content_type || 'text',
      order_index: lesson.order_index 
    })
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
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="bg-[#0f1419] border border-[#282d35] rounded-lg p-6"><div className="h-6 w-3/4 bg-[#282d35] animate-pulse rounded"></div></div>)}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f14] cyber-grid">
      <nav className="border-b border-[#282d35] bg-[#0f1419]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#9bff00] font-mono">&gt; LESSONS: {course?.title}_</h1>
          <Link href="/dashboard/courses"><Button variant="ghost" className="text-gray-400 hover:text-[#9bff00]"><ArrowLeft className="w-4 h-4 mr-2" />Back to Courses</Button></Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-200">All Lessons ({lessons.length})</h2>
          <Button onClick={openCreate} className="bg-[#9bff00] hover:bg-[#7acc00] text-black font-bold"><Plus className="w-4 h-4 mr-2" />Create Lesson</Button>
        </div>

        <div className="grid gap-4">
          {lessons.map(lesson => (
            <Card key={lesson.id} className="bg-[#0f1419] border-[#282d35] hover:border-[#9bff00] transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-200">{lesson.title}</h3>
                      <span className="px-2 py-1 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded font-mono">{lesson.content_type?.toUpperCase()}</span>
                    </div>
                    <p className="text-xs text-gray-600 font-mono mb-2">Slug: {lesson.slug}</p>
                    {lesson.video_url && <p className="text-xs text-gray-500">Video: {lesson.video_url.substring(0, 50)}...</p>}
                    {lesson.pdf_url && <p className="text-xs text-gray-500">PDF: {lesson.pdf_url.substring(0, 50)}...</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => openEdit(lesson)} variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300"><Edit className="w-4 h-4" /></Button>
                    <Button onClick={() => handleDelete(lesson.id, lesson.title)} variant="ghost" size="sm" className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#0f1419] border border-[#282d35] rounded-lg max-w-4xl w-full my-8">
            <div className="p-6 border-b border-[#282d35] flex justify-between items-center sticky top-0 bg-[#0f1419] z-10">
              <h2 className="text-xl font-bold text-[#9bff00] font-mono">{editingLesson ? 'EDIT LESSON' : 'CREATE LESSON'}</h2>
              <Button onClick={() => setShowModal(false)} variant="ghost" size="sm" className="text-gray-400 hover:text-red-400"><X className="w-5 h-5" /></Button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label htmlFor="lesson-slug" className="block text-sm text-gray-400 mb-2">Slug *</label>
                <input 
                  id="lesson-slug"
                  name="slug"
                  type="text"
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} 
                  className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-3 py-2 text-gray-200" 
                  placeholder="lesson-01-intro" 
                />
              </div>
              <div>
                <label htmlFor="lesson-title" className="block text-sm text-gray-400 mb-2">Title *</label>
                <input 
                  id="lesson-title"
                  name="title"
                  type="text"
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-3 py-2 text-gray-200" 
                  placeholder="Lesson 1: Introduction" 
                />
              </div>
              <div>
                <label htmlFor="lesson-content-type" className="block text-sm text-gray-400 mb-2">Content Type *</label>
                <select 
                  id="lesson-content-type"
                  name="content_type"
                  value={formData.content_type} 
                  onChange={e => setFormData({...formData, content_type: e.target.value})} 
                  className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-3 py-2 text-gray-200"
                >
                  <option value="text">Text Only</option>
                  <option value="video">Video Only</option>
                  <option value="pdf">PDF Only</option>
                  <option value="mixed">Mixed (Text + Video/PDF)</option>
                </select>
              </div>
              <div>
                <label htmlFor="lesson-content" className="block text-sm text-gray-400 mb-2">Markdown Content</label>
                <textarea 
                  id="lesson-content"
                  name="content_markdown"
                  value={formData.content_markdown} 
                  onChange={e => setFormData({...formData, content_markdown: e.target.value})} 
                  className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-3 py-2 text-gray-200 font-mono text-sm h-64" 
                  placeholder="# Lesson Content&#10;&#10;Write your markdown here..." 
                />
              </div>
              <div>
                <label htmlFor="lesson-video-url" className="block text-sm text-gray-400 mb-2">Video URL</label>
                <input 
                  id="lesson-video-url"
                  name="video_url"
                  type="url"
                  value={formData.video_url} 
                  onChange={e => setFormData({...formData, video_url: e.target.value})} 
                  className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-3 py-2 text-gray-200" 
                  placeholder="https://www.youtube.com/embed/..." 
                />
              </div>
              <div>
                <label htmlFor="lesson-video-provider" className="block text-sm text-gray-400 mb-2">Video Provider</label>
                <select 
                  id="lesson-video-provider"
                  name="video_provider"
                  value={formData.video_provider} 
                  onChange={e => setFormData({...formData, video_provider: e.target.value})} 
                  className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-3 py-2 text-gray-200"
                >
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="lesson-pdf-url" className="block text-sm text-gray-400 mb-2">PDF URL</label>
                <input 
                  id="lesson-pdf-url"
                  name="pdf_url"
                  type="url"
                  value={formData.pdf_url} 
                  onChange={e => setFormData({...formData, pdf_url: e.target.value})} 
                  className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-3 py-2 text-gray-200" 
                  placeholder="https://example.com/lesson.pdf" 
                />
              </div>
              <div>
                <label htmlFor="lesson-order" className="block text-sm text-gray-400 mb-2">Order</label>
                <input 
                  id="lesson-order"
                  name="order_index"
                  type="number" 
                  value={formData.order_index} 
                  onChange={e => setFormData({...formData, order_index: parseInt(e.target.value) || 0})} 
                  className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-3 py-2 text-gray-200" 
                />
              </div>
            </div>
            <div className="p-6 border-t border-[#282d35] flex justify-end gap-3 sticky bottom-0 bg-[#0f1419]">
              <Button onClick={() => setShowModal(false)} variant="ghost" className="text-gray-400 hover:text-gray-200">Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !formData.slug || !formData.title} className="bg-[#9bff00] hover:bg-[#7acc00] text-black">{saving ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
