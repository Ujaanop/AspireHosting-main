'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  ArrowTopRightOnSquareIcon,
  BoltIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  HeartIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import {
  ChatBubbleLeftRightIcon as ChatBubbleSolid,
  EnvelopeIcon as EnvelopeSolid,
  BoltIcon as BoltSolid,
  ShieldCheckIcon as ShieldSolid,
  ClockIcon as ClockSolid,
  HeartIcon as HeartSolid,
} from '@heroicons/react/24/solid'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const features = [
  {
    icon: BoltSolid,
    title: 'Fast Response',
    description: 'We aim to respond within a few hours on most days.',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: HeartSolid,
    title: 'Personal Support',
    description: 'Every ticket gets individual attention from our team.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: ShieldSolid,
    title: 'Reliable Help',
    description: 'We follow up until your issue is fully resolved.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: ClockSolid,
    title: 'Always Available',
    description: 'Reach us 7 days a week via Discord or email.',
    color: 'from-blue-500 to-cyan-500',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setSendError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setSendError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSent(true)
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        const data = await res.json()
        setSendError(data.error ?? 'Failed to send. Please try again.')
      }
    } catch {
      setSendError('Network error. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#0a0b0f] transition-colors duration-300">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#eef3ff] via-[#f7fafc] to-[#eef2f7] dark:from-blue-700 dark:via-blue-900 dark:to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/10 via-transparent to-transparent dark:from-blue-300/10" />
        <div className="absolute top-20 right-10 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 border backdrop-blur-sm bg-blue-600/10 border-blue-200/60 dark:bg-white/10 dark:border-white/20"
          >
            <SparklesIcon className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            <span className="text-sm font-medium text-blue-800 dark:text-gray-200">
              We typically respond within a few hours
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white"
          >
            Let&apos;s <span className="text-primary">Talk</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Have a question, need help, or just want to say hi? Fill out the form below
            or hop into our Discord — we&apos;re always happy to help.
          </motion.p>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="bg-white dark:bg-gray-900/60 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <EnvelopeSolid className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Send us a message</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">We&apos;ll reply to your email directly</p>
                  </div>
                </div>

                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-5">
                      <CheckCircleIcon className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message received!</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                      We&apos;ve got your message and will get back to you soon.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-6 text-sm text-primary hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Your Name
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Subject
                      </label>
                      <div className="relative">
                        <DocumentTextIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          required
                          placeholder="How can we help?"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Describe your issue or question in detail..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                      />
                    </div>

                    {sendError && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <span>⚠</span> {sendError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full button-primary text-button-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200 shadow-lg disabled:opacity-60 disabled:scale-100"
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                      {sending ? 'Sending…' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Right column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Discord Card */}
              <div className="group bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-5 backdrop-blur-sm">
                    <ChatBubbleSolid className="w-7 h-7 text-white" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Fastest Response
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Join our Discord</h3>
                  <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                    Get instant support, chat with the community, and stay up to date with announcements.
                  </p>
                  <a
                    href="https://discord.gg/B7J4dPZceh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors duration-200 text-sm shadow-lg"
                  >
                    Join Discord
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Email info */}
              <div className="bg-white dark:bg-gray-900/60 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                    <EnvelopeSolid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email us directly</p>
                    <a
                      href="mailto:support@aspirehosting.net"
                      className="text-sm font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors"
                    >
                      support@aspirehosting.net
                    </a>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Prefer to email directly? Use the form on the left or click the address above to open your mail app.
                </p>
              </div>

              {/* Response time */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl px-5 py-4">
                <div className="flex items-start gap-3">
                  <ClockIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-0.5">Response Time</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                      Email replies within 4–24 hours. Discord support is usually much faster — often within minutes.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Why Contact Us ───────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Our Support <span className="text-primary">Stands Out</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              We treat every customer like our first — personal, fast, and thorough.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-gray-50 dark:bg-gray-800/50 p-7 rounded-2xl border border-gray-200 dark:border-gray-700 group-hover:border-primary transition-all duration-300 group-hover:shadow-lg h-full text-center">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
