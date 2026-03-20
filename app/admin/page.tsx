'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock, Eye, EyeOff, LogOut, Shield, RefreshCw,
  User, AlertCircle, CheckCircle, XCircle,
  // Status icons
  Globe, Network, Trash2, Plus, X, FolderOpen, Pencil, RotateCcw,
  // Blog icons
  FileText, BookOpen,
  // Discount icons
  Tag, ToggleLeft, ToggleRight,
  // Admin icons
  Users,
  // Messages icons
  Mail, MailOpen, Inbox,
  // Maintenance icons
  Wrench, CalendarClock, Clock,
} from 'lucide-react'
import type { StatusCategory, MonitoredServer } from '@/app/types/status'

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'status' | 'blog' | 'discounts' | 'admins' | 'messages' | 'maintenance'

interface AdminUser { username: string; password: string }

interface MaintenanceWindow {
  id: string; title: string; description: string
  startTime: string; endTime: string
  affectedServices: string[]; type: 'maintenance' | 'outage' | 'partial_outage'
  status: 'scheduled' | 'active' | 'completed'
}
interface BlogCategory { id: string; name: string; color: string }
interface BlogPost { id: string; title: string; slug: string; category: string; published: boolean; featured: boolean; publishedAt: string }

interface DiscountProduct {
  enabled: boolean
  discountType: string
  budget: { percentage: number; description: string }
  premium: { percentage: number; description: string }
  validFrom: string
  validUntil: string
}

interface DiscountsConfig {
  discounts: Record<string, DiscountProduct>
  globalSettings: { showDiscountBadge: boolean; badgeText: string; currencySymbol: string; roundToNearest: number }
}

interface BannerConfig { show: boolean; text: string; couponCode: string; useThemeColor: boolean }

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  receivedAt: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidIPv4(v: string) {
  const parts = v.split('.')
  return parts.length === 4 && parts.every((p) => /^\d+$/.test(p) && +p >= 0 && +p <= 255)
}
function isValidIPv4WithPort(v: string) {
  const ci = v.lastIndexOf(':')
  if (ci === -1) return isValidIPv4(v)
  const port = Number(v.slice(ci + 1))
  return isValidIPv4(v.slice(0, ci)) && Number.isInteger(port) && port >= 1 && port <= 65535
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type, onDismiss }: { message: string; type: 'success' | 'error'; onDismiss: () => void }) {
  useEffect(() => { const t = setTimeout(onDismiss, 3500); return () => clearTimeout(t) }, [onDismiss])
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${type === 'success' ? 'bg-green-50 dark:bg-green-900/40 border-green-500/30 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/40 border-red-500/30 text-red-700 dark:text-red-400'}`}>
      {type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
      {message}
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('status')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error') => setToast({ message, type }), [])

  // ── Auth ────────────────────────────────────────────────────────────────────

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthLoading(true); setAuthError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (res.ok) {
        setIsAuth(true)
        sessionStorage.setItem('status_admin_user', username)
        sessionStorage.setItem('status_admin_pass', password)
      } else {
        setAuthError('Invalid username or password.')
      }
    } catch { setAuthError('Network error. Try again.') }
    finally { setAuthLoading(false) }
  }

  function logout() {
    setIsAuth(false)
    sessionStorage.removeItem('status_admin_user')
    sessionStorage.removeItem('status_admin_pass')
    setUsername(''); setPassword('')
  }

  useEffect(() => {
    const u = sessionStorage.getItem('status_admin_user')
    const p = sessionStorage.getItem('status_admin_pass')
    if (u && p) { setUsername(u); setPassword(p); setIsAuth(true) }
  }, [])

  // ── Status tab state ────────────────────────────────────────────────────────

  const [servers, setServers] = useState<MonitoredServer[]>([])
  const [categories, setCategories] = useState<StatusCategory[]>([])
  const [statusLoading, setStatusLoading] = useState(false)

  const [showAddServer, setShowAddServer] = useState(false)
  const [addServerType, setAddServerType] = useState<'http' | 'ip'>('http')
  const [addServerName, setAddServerName] = useState('')
  const [addServerUrl, setAddServerUrl] = useState('')
  const [addServerCat, setAddServerCat] = useState('')
  const [addServerError, setAddServerError] = useState('')
  const [addingServer, setAddingServer] = useState(false)

  const [showAddCat, setShowAddCat] = useState(false)
  const [editCatId, setEditCatId] = useState<string | null>(null)
  const [catName, setCatName] = useState('')
  const [catDesc, setCatDesc] = useState('')
  const [savingCat, setSavingCat] = useState(false)

  useEffect(() => {
    if (!isAuth || activeTab !== 'status') return
    setStatusLoading(true)
    fetch('/api/admin/status-servers')
      .then(r => r.json())
      .then(d => { setServers(d.servers ?? []); setCategories(d.categories ?? []) })
      .catch(() => {})
      .finally(() => setStatusLoading(false))
  }, [isAuth, activeTab])

  async function handleAddServer(e: React.FormEvent) {
    e.preventDefault()
    const name = addServerName.trim(); const url = addServerUrl.trim()
    if (!name || !url) return
    if (addServerType === 'ip' && !isValidIPv4WithPort(url)) {
      setAddServerError('Enter a valid IPv4 (e.g. 192.168.1.1 or 192.168.1.1:8080)')
      return
    }
    if (addServerType === 'http') {
      try { new URL(url.startsWith('http') ? url : `https://${url}`) }
      catch { setAddServerError('Enter a valid domain or URL'); return }
    }
    setAddServerError(''); setAddingServer(true)
    try {
      const res = await fetch('/api/admin/status-servers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name, url, type: addServerType, categoryId: addServerCat || null }),
      })
      const data = await res.json()
      if (res.ok) {
        setServers(p => [...p, data.server])
        setAddServerName(''); setAddServerUrl(''); setAddServerCat(''); setShowAddServer(false)
        showToast('Server added', 'success')
      } else showToast(data.error ?? 'Failed', 'error')
    } catch { showToast('Network error', 'error') }
    finally { setAddingServer(false) }
  }

  async function removeServer(id: string, name: string) {
    if (!confirm(`Remove "${name}"?`)) return
    const res = await fetch('/api/admin/status-servers', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, id }),
    })
    if (res.ok) { setServers(p => p.filter(s => s.id !== id)); showToast(`"${name}" removed`, 'success') }
    else { const d = await res.json(); showToast(d.error ?? 'Failed', 'error') }
  }

  async function saveCat(e: React.FormEvent) {
    e.preventDefault()
    if (!catName.trim()) return
    setSavingCat(true)
    const isEdit = editCatId !== null
    try {
      const res = await fetch('/api/admin/status-servers', {
        method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, type: 'category', ...(isEdit ? { id: editCatId } : {}), name: catName.trim(), description: catDesc.trim() || undefined }),
      })
      const data = await res.json()
      if (res.ok) {
        if (isEdit) setCategories(p => p.map(c => c.id === editCatId ? { ...c, name: catName.trim(), description: catDesc.trim() || undefined } : c))
        else setCategories(p => [...p, data.category])
        showToast(isEdit ? 'Category updated' : 'Category created', 'success')
        setShowAddCat(false); setCatName(''); setCatDesc(''); setEditCatId(null)
      } else showToast(data.error ?? 'Failed', 'error')
    } catch { showToast('Network error', 'error') }
    finally { setSavingCat(false) }
  }

  async function deleteCat(id: string, name: string) {
    if (!confirm(`Delete category "${name}"? Servers in it will become uncategorised.`)) return
    const res = await fetch('/api/admin/status-servers', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, id, type: 'category' }),
    })
    if (res.ok) {
      setCategories(p => p.filter(c => c.id !== id))
      setServers(p => p.map(s => s.categoryId === id ? { ...s, categoryId: undefined } : s))
      showToast(`"${name}" deleted`, 'success')
    } else { const d = await res.json(); showToast(d.error ?? 'Failed', 'error') }
  }

  // ── Blog tab state ──────────────────────────────────────────────────────────

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [blogCats, setBlogCats] = useState<BlogCategory[]>([])
  const [blogLoading, setBlogLoading] = useState(false)
  const [showNewPost, setShowNewPost] = useState(false)
  const [savingPost, setSavingPost] = useState(false)

  const emptyPost = { title: '', slug: '', excerpt: '', content: '', category: '', tags: '', authorName: 'Aspire Team', authorRole: 'Aspire Hosting', image: '/blog/server.webp', featured: false, published: true }
  const [postForm, setPostForm] = useState(emptyPost)

  useEffect(() => {
    if (!isAuth || activeTab !== 'blog') return
    setBlogLoading(true)
    fetch('/api/admin/blog')
      .then(r => r.json())
      .then(d => { setBlogPosts(d.posts ?? []); setBlogCats(d.categories ?? []) })
      .catch(() => {})
      .finally(() => setBlogLoading(false))
  }, [isAuth, activeTab])

  async function submitPost(e: React.FormEvent) {
    e.preventDefault()
    if (!postForm.title || !postForm.content || !postForm.category) {
      showToast('Title, content, and category are required', 'error'); return
    }
    setSavingPost(true)
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, post: postForm }),
      })
      const data = await res.json()
      if (res.ok) {
        setBlogPosts(p => [data.post, ...p])
        setPostForm(emptyPost); setShowNewPost(false)
        showToast('Post published', 'success')
      } else showToast(data.error ?? 'Failed', 'error')
    } catch { showToast('Network error', 'error') }
    finally { setSavingPost(false) }
  }

  async function deletePost(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return
    const res = await fetch('/api/admin/blog', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, id }),
    })
    if (res.ok) { setBlogPosts(p => p.filter(pp => pp.id !== id)); showToast('Post deleted', 'success') }
    else { const d = await res.json(); showToast(d.error ?? 'Failed', 'error') }
  }

  async function togglePublish(post: BlogPost) {
    const res = await fetch('/api/admin/blog', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, id: post.id, updates: { published: !post.published } }),
    })
    if (res.ok) {
      setBlogPosts(p => p.map(pp => pp.id === post.id ? { ...pp, published: !pp.published } : pp))
      showToast(post.published ? 'Post unpublished' : 'Post published', 'success')
    }
  }

  // ── Discounts tab state ─────────────────────────────────────────────────────

  const [discConfig, setDiscConfig] = useState<DiscountsConfig | null>(null)
  const [banner, setBanner] = useState<BannerConfig>({ show: true, text: '', couponCode: '', useThemeColor: true })
  const [discLoading, setDiscLoading] = useState(false)
  const [savingDisc, setSavingDisc] = useState(false)

  useEffect(() => {
    if (!isAuth || activeTab !== 'discounts') return
    setDiscLoading(true)
    fetch('/api/admin/discounts')
      .then(r => r.json())
      .then(d => { setDiscConfig(d.discounts); setBanner(d.banner) })
      .catch(() => {})
      .finally(() => setDiscLoading(false))
  }, [isAuth, activeTab])

  async function saveDiscounts() {
    if (!discConfig) return
    setSavingDisc(true)
    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, discounts: discConfig, banner }),
      })
      if (res.ok) showToast('Discounts saved', 'success')
      else { const d = await res.json(); showToast(d.error ?? 'Failed', 'error') }
    } catch { showToast('Network error', 'error') }
    finally { setSavingDisc(false) }
  }

  // ── Admins tab state ────────────────────────────────────────────────────────

  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [newAdminUser, setNewAdminUser] = useState('')
  const [newAdminPass, setNewAdminPass] = useState('')
  const [showNewAdminPass, setShowNewAdminPass] = useState(false)
  const [savingAdmins, setSavingAdmins] = useState(false)

  useEffect(() => {
    if (!isAuth || activeTab !== 'admins') return
    setAdmins([{ username, password }])
  }, [isAuth, activeTab, username, password])

  async function saveAdmins() {
    setSavingAdmins(true)
    try {
      const res = await fetch('/api/admin/status-servers', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, admins }),
      })
      if (res.ok) showToast('Admin users saved', 'success')
      else { const d = await res.json(); showToast(d.error ?? 'Failed', 'error') }
    } catch { showToast('Network error', 'error') }
    finally { setSavingAdmins(false) }
  }

  // ── Messages tab state ──────────────────────────────────────────────────────

  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuth) return
    // Always fetch messages so unread badge shows on all tabs
    fetch(`/api/contact?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
      .then(r => r.json())
      .then(d => setMessages(d.messages ?? []))
      .catch(() => {})
  }, [isAuth, username, password])

  useEffect(() => {
    if (!isAuth || activeTab !== 'messages') return
    setMessagesLoading(true)
    fetch(`/api/contact?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
      .then(r => r.json())
      .then(d => setMessages(d.messages ?? []))
      .catch(() => {})
      .finally(() => setMessagesLoading(false))
  }, [isAuth, activeTab, username, password])

  async function markRead(id: string, read: boolean) {
    await fetch('/api/contact', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, id, read }),
    })
    setMessages(p => p.map(m => m.id === id ? { ...m, read } : m))
  }

  async function markAllRead() {
    await fetch('/api/contact', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, markAllRead: true }),
    })
    setMessages(p => p.map(m => ({ ...m, read: true })))
    showToast('All marked as read', 'success')
  }

  async function deleteMessage(id: string) {
    if (!confirm('Delete this message?')) return
    const res = await fetch('/api/contact', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, id }),
    })
    if (res.ok) { setMessages(p => p.filter(m => m.id !== id)); showToast('Message deleted', 'success') }
  }

  // ── Maintenance tab state ────────────────────────────────────────────────────

  const [maintenanceWindows, setMaintenanceWindows] = useState<MaintenanceWindow[]>([])
  const [maintLoading, setMaintLoading] = useState(false)
  const [maintForm, setMaintForm] = useState({
    title: '', description: '', startTime: '', endTime: '',
    affectedServices: '', type: 'maintenance' as 'maintenance' | 'outage' | 'partial_outage',
  })
  const [savingMaint, setSavingMaint] = useState(false)

  useEffect(() => {
    if (!isAuth || activeTab !== 'maintenance') return
    setMaintLoading(true)
    fetch('/api/admin/maintenance')
      .then(r => r.json())
      .then(d => setMaintenanceWindows(d.windows ?? []))
      .catch(() => {})
      .finally(() => setMaintLoading(false))
  }, [isAuth, activeTab])

  async function addMaintenance() {
    const { title, startTime, endTime, description, affectedServices, type } = maintForm
    if (!title || !startTime || !endTime) { showToast('Title, start and end time are required', 'error'); return }
    setSavingMaint(true)
    try {
      const res = await fetch('/api/admin/maintenance', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username, password, title, description,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          affectedServices: affectedServices.split(',').map(s => s.trim()).filter(Boolean),
          type,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setMaintenanceWindows(p => [data.window, ...p])
        setMaintForm({ title: '', description: '', startTime: '', endTime: '', affectedServices: '', type: 'maintenance' })
        showToast('Maintenance window created', 'success')
      } else showToast(data.error ?? 'Failed', 'error')
    } catch { showToast('Network error', 'error') }
    finally { setSavingMaint(false) }
  }

  async function deleteMaintenance(id: string) {
    if (!confirm('Delete this maintenance window?')) return
    const res = await fetch('/api/admin/maintenance', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, id }),
    })
    if (res.ok) { setMaintenanceWindows(p => p.filter(w => w.id !== id)); showToast('Deleted', 'success') }
  }

  // ── Login screen ────────────────────────────────────────────────────────────

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="card-primary w-full max-w-sm rounded-2xl border border-secondary shadow-2xl p-8">
          <div className="text-center mb-7">
            <div className="w-12 h-12 rounded-xl card-primary border border-secondary flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 icon-text-primary" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to manage AspireHosting</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input type="text" value={username} onChange={e => { setUsername(e.target.value); setAuthError('') }}
                  placeholder="admin" autoComplete="username" required
                  className="w-full pl-8 pr-3 py-2.5 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setAuthError('') }}
                  placeholder="••••••••" autoComplete="current-password" required
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50 pr-9" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {authError && (
              <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{authError}
              </div>
            )}
            <button type="submit" disabled={authLoading}
              className="w-full py-2.5 rounded-lg button-primary text-white text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
              {authLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              {authLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────

  const unreadCount = messages.filter(m => !m.read).length

  const TABS: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'status', label: 'Status Monitor', icon: <Globe className="w-4 h-4" /> },
    { id: 'blog', label: 'Blog', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'discounts', label: 'Discounts', icon: <Tag className="w-4 h-4" /> },
    { id: 'messages', label: 'Messages', icon: <Inbox className="w-4 h-4" />, badge: unreadCount },
    { id: 'maintenance', label: 'Maintenance', icon: <Wrench className="w-4 h-4" /> },
    { id: 'admins', label: 'Admin Users', icon: <Users className="w-4 h-4" /> },
  ]

  const PRODUCT_LABELS: Record<string, string> = {
    vps: 'Cloud VPS', games: 'Game Servers', discord: 'Discord Bots', webhosting: 'Web Hosting', dedicated: 'Dedicated Servers'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f]">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
      </AnimatePresence>

      {/* Top bar */}
      <div className="border-b border-secondary bg-white dark:bg-black/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 icon-text-primary" />
            <span className="font-semibold text-sm text-gray-900 dark:text-white">Admin Panel</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">· {username}</span>
          </div>
          <button onClick={logout}
            className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut className="w-3.5 h-3.5" />Sign out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-gray-100 dark:bg-white/5 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${activeTab === tab.id ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
              {tab.icon}{tab.label}
              {tab.badge != null && tab.badge > 0 && (
                <span className="ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ══ STATUS TAB ══════════════════════════════════════════════════════ */}
        {activeTab === 'status' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

            {/* Servers section */}
            <div>
              <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Monitored Servers
                  {!statusLoading && <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">{servers.length} total</span>}
                </h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => { if (!confirm('Reset all uptime history?')) return; try { localStorage.removeItem('aspire_status_history') } catch {} showToast('History cleared', 'success') }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-secondary text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-400/40 text-sm font-medium transition-colors">
                    <RotateCcw className="w-4 h-4" />Reset History
                  </button>
                  <button onClick={() => setShowAddServer(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg button-primary text-white text-sm font-medium">
                    {showAddServer ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showAddServer ? 'Cancel' : 'Add Server'}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showAddServer && (
                  <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddServer} className="overflow-hidden mb-4">
                    <div className="card-primary rounded-xl border border-secondary p-4 flex flex-col gap-3">
                      <div className="flex gap-1 p-1 rounded-lg bg-gray-100 dark:bg-white/5 w-fit">
                        {(['http', 'ip'] as const).map(t => (
                          <button key={t} type="button" onClick={() => { setAddServerType(t); setAddServerUrl(''); setAddServerError('') }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${addServerType === t ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                            {t === 'http' ? <><Globe className="w-3.5 h-3.5" />Domain / URL</> : <><Network className="w-3.5 h-3.5" />IPv4 Address</>}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_1.5fr_auto] gap-3">
                        <input value={addServerName} onChange={e => setAddServerName(e.target.value)} placeholder="Display name" required
                          className="px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                        <div className="relative">
                          {addServerType === 'ip' ? <Network className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-purple-400" /> : <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />}
                          <input value={addServerUrl} onChange={e => { setAddServerUrl(e.target.value); setAddServerError('') }}
                            placeholder={addServerType === 'ip' ? '192.168.1.1 or 192.168.1.1:8080' : 'example.com'} required
                            className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50 ${addServerError ? 'border-red-400' : 'border-secondary'}`} />
                        </div>
                        <select value={addServerCat} onChange={e => setAddServerCat(e.target.value)}
                          className="px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-button-bg/50">
                          <option value="">No category</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <button type="submit" disabled={addingServer}
                          className="px-4 py-2 rounded-lg button-primary text-white text-sm font-medium disabled:opacity-60 flex items-center gap-1.5 whitespace-nowrap">
                          {addingServer && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}Add
                        </button>
                      </div>
                      {addServerError && <p className="text-xs text-red-500 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{addServerError}</p>}
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {statusLoading ? (
                <div className="text-center py-10 text-gray-400"><RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" /><p className="text-sm">Loading…</p></div>
              ) : (
                <div className="flex flex-col gap-2">
                  {servers.map(s => {
                    const cat = categories.find(c => c.id === s.categoryId)
                    return (
                      <div key={s.id} className="card-primary rounded-xl border border-secondary p-4 flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.isPreset ? 'bg-blue-500' : 'bg-icon-text-primary'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{s.name}</span>
                            {s.type === 'ip' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium">IPv4</span>}
                            {s.isPreset && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium">preset</span>}
                            {cat && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-medium">{cat.name}</span>}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.url}</p>
                        </div>
                        {!s.isPreset && (
                          <button onClick={() => removeServer(s.id, s.name)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 flex-shrink-0 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Categories section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Categories
                  <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">{categories.length} total</span>
                </h2>
                <button onClick={() => { setEditCatId(null); setCatName(''); setCatDesc(''); setShowAddCat(v => !v) }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg button-primary text-white text-sm font-medium">
                  {showAddCat ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {showAddCat ? 'Cancel' : 'New Category'}
                </button>
              </div>

              <AnimatePresence>
                {showAddCat && (
                  <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    onSubmit={saveCat} className="overflow-hidden mb-4">
                    <div className="card-primary rounded-xl border border-secondary p-4 flex flex-col gap-3">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{editCatId ? 'Edit Category' : 'New Category'}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input value={catName} onChange={e => setCatName(e.target.value)} placeholder="Name (e.g. Game Nodes)" required
                          className="px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                        <input value={catDesc} onChange={e => setCatDesc(e.target.value)} placeholder="Description (optional)"
                          className="px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => { setShowAddCat(false); setEditCatId(null) }}
                          className="px-4 py-2 rounded-lg border border-secondary text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5">Cancel</button>
                        <button type="submit" disabled={savingCat}
                          className="px-4 py-2 rounded-lg button-primary text-white text-sm font-medium disabled:opacity-60 flex items-center gap-1.5">
                          {savingCat && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}{editCatId ? 'Save' : 'Create'}
                        </button>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <div key={cat.id} className="card-primary rounded-xl border border-secondary p-4 flex items-center gap-3">
                    <FolderOpen className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{cat.name}</span>
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300">
                        {servers.filter(s => s.categoryId === cat.id).length} server{servers.filter(s => s.categoryId === cat.id).length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditCatId(cat.id); setCatName(cat.name); setCatDesc((cat as unknown as { description?: string }).description ?? ''); setShowAddCat(true) }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-icon-text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => deleteCat(cat.id, cat.name)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══ BLOG TAB ════════════════════════════════════════════════════════ */}
        {activeTab === 'blog' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Blog Posts
                {!blogLoading && <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">{blogPosts.length} total</span>}
              </h2>
              <button onClick={() => setShowNewPost(v => !v)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg button-primary text-white text-sm font-medium">
                {showNewPost ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showNewPost ? 'Cancel' : 'New Post'}
              </button>
            </div>

            <AnimatePresence>
              {showNewPost && (
                <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  onSubmit={submitPost} className="overflow-hidden mb-6">
                  <div className="card-primary rounded-xl border border-secondary p-5 flex flex-col gap-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">New Blog Post</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                        <input value={postForm.title} onChange={e => setPostForm(p => ({ ...p, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') }))}
                          placeholder="Post title" required
                          className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                        <select value={postForm.category} onChange={e => setPostForm(p => ({ ...p, category: e.target.value }))} required
                          className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-button-bg/50">
                          <option value="">Select category</option>
                          {blogCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
                        <input value={postForm.tags} onChange={e => setPostForm(p => ({ ...p, tags: e.target.value }))}
                          placeholder="e.g. vps, tutorial, news"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Author Name</label>
                        <input value={postForm.authorName} onChange={e => setPostForm(p => ({ ...p, authorName: e.target.value }))}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Author Role</label>
                        <input value={postForm.authorRole} onChange={e => setPostForm(p => ({ ...p, authorRole: e.target.value }))}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image URL</label>
                        <input value={postForm.image} onChange={e => setPostForm(p => ({ ...p, image: e.target.value }))}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt (optional — auto-generated if empty)</label>
                        <input value={postForm.excerpt} onChange={e => setPostForm(p => ({ ...p, excerpt: e.target.value }))}
                          placeholder="Short description shown in listings"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Content * (Markdown supported)</label>
                        <textarea value={postForm.content} onChange={e => setPostForm(p => ({ ...p, content: e.target.value }))}
                          rows={10} required placeholder="Write your post content here…"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50 resize-y font-mono" />
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={postForm.featured} onChange={e => setPostForm(p => ({ ...p, featured: e.target.checked }))} className="rounded" />
                          <span className="text-gray-700 dark:text-gray-300">Featured</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={postForm.published} onChange={e => setPostForm(p => ({ ...p, published: e.target.checked }))} className="rounded" />
                          <span className="text-gray-700 dark:text-gray-300">Published</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button type="button" onClick={() => setShowNewPost(false)}
                        className="px-4 py-2 rounded-lg border border-secondary text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5">Cancel</button>
                      <button type="submit" disabled={savingPost}
                        className="px-5 py-2 rounded-lg button-primary text-white text-sm font-semibold disabled:opacity-60 flex items-center gap-1.5">
                        {savingPost && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}Publish Post
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {blogLoading ? (
              <div className="text-center py-10 text-gray-400"><RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" /><p className="text-sm">Loading…</p></div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-10 text-gray-400"><FileText className="w-8 h-8 mx-auto mb-2 opacity-40" /><p className="text-sm">No posts yet</p></div>
            ) : (
              <div className="flex flex-col gap-2">
                {blogPosts.map(post => (
                  <div key={post.id} className="card-primary rounded-xl border border-secondary p-4 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${post.published ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{post.title}</span>
                        {post.featured && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium">featured</span>}
                        {!post.published && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 font-medium">draft</span>}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{blogCats.find(c => c.id === post.category)?.name ?? post.category} · {new Date(post.publishedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => togglePublish(post)} title={post.published ? 'Unpublish' : 'Publish'}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-icon-text-primary transition-colors">
                        {post.published ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <button onClick={() => deletePost(post.id, post.title)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ══ DISCOUNTS TAB ═══════════════════════════════════════════════════ */}
        {activeTab === 'discounts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Discounts & Banner</h2>
              <button onClick={saveDiscounts} disabled={savingDisc || discLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg button-primary text-white text-sm font-semibold disabled:opacity-60">
                {savingDisc && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}Save All Changes
              </button>
            </div>

            {discLoading ? (
              <div className="text-center py-10 text-gray-400"><RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" /><p className="text-sm">Loading…</p></div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Banner */}
                <div className="card-primary rounded-xl border border-secondary p-5">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Announcement Banner</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Banner Text</label>
                      <input value={banner.text ?? ''} onChange={e => setBanner(b => ({ ...b, text: e.target.value }))}
                        placeholder="e.g. 26% OFF now on all Plans! Use code: SAVE26"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Coupon Code</label>
                      <input value={banner.couponCode ?? ''} onChange={e => setBanner(b => ({ ...b, couponCode: e.target.value }))}
                        placeholder="e.g. SAVE26"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={banner.show ?? true} onChange={e => setBanner(b => ({ ...b, show: e.target.checked }))} className="rounded" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Show banner</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Per-product discounts */}
                {discConfig && Object.entries(discConfig.discounts).map(([key, disc]) => (
                  <div key={key} className="card-primary rounded-xl border border-secondary p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{PRODUCT_LABELS[key] ?? key}</h3>
                      <button type="button" onClick={() => setDiscConfig(d => d ? { ...d, discounts: { ...d.discounts, [key]: { ...disc, enabled: !disc.enabled } } } : d)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${disc.enabled ? 'border-green-500/30 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'border-secondary text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                        {disc.enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        {disc.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Budget %</label>
                        <input type="number" min={0} max={100} value={disc.budget.percentage}
                          onChange={e => setDiscConfig(d => d ? { ...d, discounts: { ...d.discounts, [key]: { ...disc, budget: { ...disc.budget, percentage: Number(e.target.value) } } } } : d)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Premium %</label>
                        <input type="number" min={0} max={100} value={disc.premium.percentage}
                          onChange={e => setDiscConfig(d => d ? { ...d, discounts: { ...d.discounts, [key]: { ...disc, premium: { ...disc.premium, percentage: Number(e.target.value) } } } } : d)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Valid From</label>
                        <input type="date" value={disc.validFrom}
                          onChange={e => setDiscConfig(d => d ? { ...d, discounts: { ...d.discounts, [key]: { ...disc, validFrom: e.target.value } } } : d)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Valid Until</label>
                        <input type="date" value={disc.validUntil}
                          onChange={e => setDiscConfig(d => d ? { ...d, discounts: { ...d.discounts, [key]: { ...disc, validUntil: e.target.value } } } : d)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ══ MESSAGES TAB ════════════════════════════════════════════════════ */}
        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Contact Messages
                {!messagesLoading && (
                  <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                    {messages.length} total · {unreadCount} unread
                  </span>
                )}
              </h2>
              {unreadCount > 0 && (
                <button onClick={markAllRead}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-secondary text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium transition-colors">
                  <MailOpen className="w-4 h-4" />Mark all read
                </button>
              )}
            </div>

            {messagesLoading ? (
              <div className="text-center py-10 text-gray-400"><RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" /><p className="text-sm">Loading…</p></div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Inbox className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">No messages yet</p>
                <p className="text-xs mt-1 opacity-70">Messages from the contact form will appear here</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {messages.map(msg => (
                  <div key={msg.id}
                    className={`card-primary rounded-xl border transition-colors ${msg.read ? 'border-secondary' : 'border-blue-400/50 dark:border-blue-500/40 bg-blue-50/50 dark:bg-blue-900/10'}`}>
                    <div className="p-4 flex items-start gap-3 cursor-pointer"
                      onClick={() => { setExpandedMsg(expandedMsg === msg.id ? null : msg.id); if (!msg.read) markRead(msg.id, true) }}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.read ? 'bg-gray-100 dark:bg-white/10' : 'bg-blue-100 dark:bg-blue-900/40'}`}>
                        {msg.read
                          ? <MailOpen className="w-4 h-4 text-gray-400" />
                          : <Mail className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-semibold truncate ${msg.read ? 'text-gray-700 dark:text-gray-200' : 'text-gray-900 dark:text-white'}`}>{msg.name}</span>
                          {!msg.read && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold">New</span>}
                          <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{new Date(msg.receivedAt).toLocaleString()}</span>
                        </div>
                        <p className={`text-xs truncate ${msg.read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300 font-medium'}`}>{msg.subject}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{msg.email}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 ml-2">
                        <button onClick={e => { e.stopPropagation(); markRead(msg.id, !msg.read) }}
                          title={msg.read ? 'Mark unread' : 'Mark read'}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-icon-text-primary transition-colors">
                          {msg.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                        </button>
                        <button onClick={e => { e.stopPropagation(); deleteMessage(msg.id) }}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {expandedMsg === msg.id && (
                      <div className="px-4 pb-4 border-t border-secondary/60 pt-3 mt-0">
                        <div className="flex flex-col sm:flex-row gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400">
                          <span><strong className="text-gray-700 dark:text-gray-300">From:</strong> {msg.name} &lt;{msg.email}&gt;</span>
                          <span><strong className="text-gray-700 dark:text-gray-300">Subject:</strong> {msg.subject}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed border border-secondary/60">
                          {msg.message}
                        </div>
                        <div className="mt-3">
                          <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg button-primary text-white text-xs font-medium">
                            <Mail className="w-3.5 h-3.5" />Reply via Email
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ══ MAINTENANCE TAB ═════════════════════════════════════════════════ */}
        {activeTab === 'maintenance' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Schedule Maintenance</h2>

            {/* Add form */}
            <div className="card-primary rounded-xl border border-secondary p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <CalendarClock className="w-4 h-4 icon-text-primary" />New Maintenance Window
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <input value={maintForm.title} onChange={e => setMaintForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Scheduled maintenance on Game Servers"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea value={maintForm.description} onChange={e => setMaintForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Brief description of what will happen during this window…"
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date &amp; Time *</label>
                  <input type="datetime-local" value={maintForm.startTime} onChange={e => setMaintForm(p => ({ ...p, startTime: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">End Date &amp; Time *</label>
                  <input type="datetime-local" value={maintForm.endTime} onChange={e => setMaintForm(p => ({ ...p, endTime: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select value={maintForm.type} onChange={e => setMaintForm(p => ({ ...p, type: e.target.value as 'maintenance' | 'outage' | 'partial_outage' }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-button-bg/50">
                    <option value="maintenance">Maintenance</option>
                    <option value="partial_outage">Partial Outage</option>
                    <option value="outage">Outage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Affected Services <span className="text-gray-400">(comma separated)</span></label>
                  <input value={maintForm.affectedServices} onChange={e => setMaintForm(p => ({ ...p, affectedServices: e.target.value }))}
                    placeholder="e.g. Game Servers, Cloud VPS"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
                </div>
              </div>
              <button onClick={addMaintenance} disabled={savingMaint}
                className="flex items-center gap-2 px-4 py-2 rounded-lg button-primary text-white text-sm font-medium disabled:opacity-60">
                {savingMaint ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Schedule Window
              </button>
            </div>

            {/* List */}
            {maintLoading ? (
              <div className="text-center py-10 text-gray-400"><RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" /><p className="text-sm">Loading…</p></div>
            ) : maintenanceWindows.length === 0 ? (
              <div className="text-center py-14 text-gray-400">
                <Wrench className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No maintenance windows</p>
                <p className="text-xs mt-1 opacity-70">Scheduled windows will appear here</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {maintenanceWindows.map(win => {
                  const statusColors = {
                    scheduled: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
                    active: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
                    completed: 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400',
                  }
                  const typeColors = {
                    maintenance: 'text-amber-600 dark:text-amber-400',
                    outage: 'text-red-600 dark:text-red-400',
                    partial_outage: 'text-orange-600 dark:text-orange-400',
                  }
                  const typeLabels = { maintenance: 'Maintenance', outage: 'Outage', partial_outage: 'Partial Outage' }
                  return (
                    <div key={win.id} className="card-primary rounded-xl border border-secondary p-4 flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <Wrench className={`w-5 h-5 ${typeColors[win.type]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{win.title}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold capitalize ${statusColors[win.status]}`}>
                            {win.status}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-gray-100 dark:bg-white/10 ${typeColors[win.type]}`}>
                            {typeLabels[win.type]}
                          </span>
                        </div>
                        {win.description && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{win.description}</p>}
                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400 dark:text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(win.startTime).toLocaleString()} → {new Date(win.endTime).toLocaleString()}
                          </span>
                          {win.affectedServices.length > 0 && (
                            <span>Affected: {win.affectedServices.join(', ')}</span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => deleteMaintenance(win.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 flex-shrink-0 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ══ ADMINS TAB ══════════════════════════════════════════════════════ */}
        {activeTab === 'admins' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Admin Users</h2>
              <button onClick={saveAdmins} disabled={savingAdmins}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg button-primary text-white text-sm font-medium disabled:opacity-60">
                {savingAdmins && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}Save Changes
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Add or remove admin users. You cannot remove yourself. Click <strong>Save Changes</strong> to apply.</p>

            <div className="card-primary rounded-xl border border-secondary p-4 mb-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input type="text" value={newAdminUser} onChange={e => setNewAdminUser(e.target.value)} placeholder="New username"
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50" />
              </div>
              <div className="relative flex-1">
                <input type={showNewAdminPass ? 'text' : 'password'} value={newAdminPass} onChange={e => setNewAdminPass(e.target.value)} placeholder="Password"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-bg/50 pr-9" />
                <button type="button" onClick={() => setShowNewAdminPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showNewAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button type="button"
                onClick={() => {
                  const u = newAdminUser.trim(); const p = newAdminPass.trim()
                  if (!u || !p) return
                  if (admins.some(a => a.username === u)) { showToast('Username already exists', 'error'); return }
                  setAdmins(prev => [...prev, { username: u, password: p }])
                  setNewAdminUser(''); setNewAdminPass('')
                }}
                className="px-4 py-2 rounded-lg button-primary text-white text-sm font-medium flex items-center gap-1.5 flex-shrink-0">
                <Plus className="w-4 h-4" />Add
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {admins.map(admin => (
                <div key={admin.username} className="card-primary rounded-xl border border-secondary p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{admin.username}</span>
                      {admin.username === username && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 font-medium">you</span>}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Password hidden</p>
                  </div>
                  {admin.username !== username && (
                    <button onClick={() => setAdmins(p => p.filter(a => a.username !== admin.username))}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 flex-shrink-0 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
