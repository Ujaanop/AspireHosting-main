'use client'

import { motion } from "framer-motion";
import { 
  Users, 
  Lightbulb, 
  TrendingUp, 
  Compass, 
  Shield, 
  Zap, 
  Globe, 
  Heart,
  Award,
  Target,
  Rocket,
  Star,
  CheckCircle,
  ArrowRight,
  Server,
  Cloud,
  Database,
  Cpu,
  Coffee,
  Clock,
  Code
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { NumberTicker } from "@/components/magicui/number-ticker";

export default function AboutUsPage() {
  const stats = [
    { label: "Happy Clients", value: 250, suffix: "+", variant: "primary" as const },
    { label: "Uptime", value: 99, suffix: "%", variant: "success" as const },
    { label: "Countries", value: 4, suffix: "+", variant: "accent" as const },
    { label: "Years", value: 2, suffix: "+", variant: "secondary" as const }
  ];

  const values = [
    {
      icon: Shield,
      title: "Reliable Service",
      description: "We ensure 99.9% uptime with robust infrastructure and constant monitoring.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Fast & Optimized",
      description: "Every server is carefully optimized to deliver lightning-fast performance for your projects.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Heart,
      title: "Personal Support",
      description: "We believe in treating every customer like family – you'll always get personal attention.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Strategic data center locations ensure your sites perform well worldwide.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const expertise = [
    {
      icon: Server,
      title: "Server Management",
      description: "2+ years of hands-on experience with Linux servers, optimization, and maintenance.",
      level: 85
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description: "Expert in Cloud Infrastructure structured in a way that is easy to use and understand for our clients.",
      level: 90
    },
    {
      icon: Database,
      title: "Database Administration",
      description: "MySQL, PostgreSQL, and NoSQL database setup, optimization, and backup strategies.",
      level: 88
    },
    {
      icon: Cpu,
      title: "Performance Optimization",
      description: "Specialized in making websites and applications run at peak performance.",
      level: 92
    }
  ];

  const timeline = [
    {
      year: "2023",
      title: "Aspire Hosting Launch",
      description: "Formally launched Aspire Hosting to serve a growing community of businesses & gameowners"
    },
    {
      year: "2024-2025",
      title: "Global Growth",
      description: "Now serving 250+ happy customers across 6+ countries worldwide"
    },
    {
      year: "2025",
      title: "Ownership and Management Changes",
      description: "Ownership and Management Changes to better serve the community"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#0a0b0f] transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Light/Dark gradient background (aligned with Infrastructure) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#eef3ff] via-[#f7fafc] to-[#eef2f7] dark:from-blue-700 dark:via-blue-900 dark:to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/10 via-transparent to-transparent dark:from-blue-300/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8 border backdrop-blur-sm bg-blue-600/10 text-blue-700 border-blue-200/60 dark:bg-white/10 dark:text-white dark:border-white/20"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-800 dark:text-gray-200">
                Trusted by 250+ clients worldwide
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              <span className="text-gray-900 dark:text-white">
                About <span className="text-primary">Aspire Hosting</span>
              </span>
            </h1>

            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed">
              We are a dedicated hosting company passionate about helping businesses 
              bring their digital ideas to life with reliable, fast, and affordable hosting solutions.
            </p>

            <p className="text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-12">
              Founded in 2023, we've grown from a small team to serving amazing people 
              and businesses around the world with our commitment to excellence.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="group button-primary text-button-primary px-6 py-3 rounded-lg font-medium text-base transition-all duration-300 flex items-center gap-2 hover:scale-105">
                <span><a href="/games" className="hover:underline">Our Services</a></span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 group-hover:border-primary transition-all duration-300 group-hover:shadow-lg">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    <NumberTicker
                      value={stat.value}
                      className="inline"
                    />
                    <span className="inline">{stat.suffix}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              What We <span className="text-primary">Believe In</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple principles that guide everything we do for our customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 group-hover:border-primary transition-all duration-300 group-hover:shadow-xl h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                Our <span className="text-primary">Story</span>
              </h2>
              <div className="space-y-4 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  In 2023, we officially launched Aspire Hosting to serve even more people. Today, we're proud to help 
                  250+ customers across 6+ countries, but we still treat each one like they're our first customer. 
                </p>
                <p>
                  By 2025, we have grown exponentially and have become one of the most trusted hosting providers in the community. Recently in August, we had our ownership and management changes to better serve the community and our customers.
                </p>
              </div>
              <br />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                 <span className="text-primary">Contact Us</span>
              </h2>
              <p>
                We are located in Kolkata, West Bengal, India. Address: Q461/A, Garden Reach, Kolkata, West Bengal, India. </p>
                <p>Registered Name: Aspire Hosting</p>
                <p>MSME Registration ID: UDYAM-WB-18-0151500</p>
                <p>Phone Number: +91 8910252658</p>
                <p>Email: support@aspirehosting.net</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl">
                <div className="space-y-6">
                  {timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1">
                          {item.year}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our <span className="text-primary">Expertise</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The technical skills we bring to every hosting solution
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {expertise.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 group-hover:border-primary transition-all duration-300 group-hover:shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <skill.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {skill.title}
                      </h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {skill.level}% proficiency
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {skill.description}
                  </p>
                  <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      viewport={{ once: true }}
                      className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              What People <span className="text-primary">Say</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real feedback from real customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Bhakti Bharosha",
                role: "Client",
                content: "Aspire hosting is way better than other hostings. Support team is very fast.",
                rating: 5
              },
              {
                name: "John Panama",
                role: "Client",
                content: "I have been using Aspire now for a couple of months. I have had some very minor issues that have been quickly resolved using their Ticket system. They provide budget priced but quality hosting. Happy to have discovered AspireHosting in my search for fully featured budget hosting.",
                rating: 5
              },
              {
                name: "Vihaan Roy",
                role: "Client",
                content: "I've been using Aspire Hosting for a week, and it's been great. The performance is solid, with no major issues, and their support team responds super fast. Plus, the pricing is really affordable, making it a great choice for budget-friendly hosting",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Touch Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
        >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why We Do This
            </h2>
            <blockquote className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed italic max-w-3xl mx-auto">
              "We believe everyone deserves access to reliable, fast hosting without the complexity. 
              When we see a small business owner's face light up because their website is finally working 
              perfectly, that's what makes all the late nights and technical challenges worth it."
            </blockquote>
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              — The Aspire Hosting Team
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
