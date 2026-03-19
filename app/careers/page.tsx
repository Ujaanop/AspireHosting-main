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
  Code,
  Briefcase,
  MapPin,
  Calendar,
  ExternalLink,
  Send,
  Mail,
  MessageCircle
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { NumberTicker } from "@/components/magicui/number-ticker";

export default function CareersPage() {
  const stats = [
    { label: "Open Positions", value: 5, suffix: "+", variant: "primary" as const },
    { label: "Team Members", value: 12, suffix: "+", variant: "success" as const },
    { label: "Remote Friendly", value: 100, suffix: "%", variant: "accent" as const },
    { label: "Growth Rate", value: 40, suffix: "%", variant: "secondary" as const }
  ];

  const benefits = [
    {
      icon: Globe,
      title: "Remote First",
      description: "Work from anywhere in the world. We believe in flexibility and work-life balance.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Fast Growth",
      description: "Join a rapidly growing company with opportunities for career advancement.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Heart,
      title: "Great Culture",
      description: "Collaborative environment where your ideas matter and your voice is heard.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Award,
      title: "Learning Budget",
      description: "Annual budget for courses, conferences, and professional development.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const openPositions = [
    {
      title: "Senior DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Lead our infrastructure and deployment processes. Experience with AWS, Docker, and Kubernetes required.",
      requirements: ["5+ years DevOps experience", "AWS/GCP certification preferred", "Strong automation skills"],
      posted: "Closed"
    },
    {
      title: "Frontend Developer",
      department: "Engineering", 
      location: "Remote",
      type: "Full-time",
      description: "Build beautiful, responsive user interfaces. Work with React, Next.js, and modern web technologies.",
      requirements: ["3+ years React experience", "TypeScript proficiency", "UI/UX design sense"],
      posted: "Closed"
    },
    {
      title: "Customer Success Manager",
      department: "Support",
      location: "Remote",
      type: "Full-time", 
      description: "Help our customers succeed with our hosting services. Provide technical support and build relationships.",
      requirements: ["2+ years customer support", "Technical background", "Excellent communication"],
      posted: "Closed"
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Drive growth through digital marketing campaigns, content creation, and community building.",
      requirements: ["Marketing degree or experience", "Social media expertise", "Analytics skills"],
      posted: "Closed"
    }
  ];

  const values = [
    {
      icon: Users,
      title: "Collaboration",
      description: "We work together as one team, supporting each other to achieve common goals."
    },
    {
      icon: Lightbulb,
      title: "Innovation", 
      description: "We encourage creative thinking and embrace new ideas to solve problems."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for the highest quality in everything we do, from code to customer service."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We love what we do and are passionate about helping our customers succeed."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
          <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

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
              className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-gray-200 dark:border-gray-700"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                We're hiring! Join our growing team
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              <span className="text-gray-900 dark:text-white">
                Join Our <span className="text-primary">Team</span>
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Be part of a dynamic team that's revolutionizing hosting services. 
              We're looking for passionate individuals who want to make a difference.
            </p>

            <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-12">
              Work remotely, grow your skills, and help us build the future of web hosting.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a 
                href="#"
                className="group button-primary text-button-primary px-6 py-3 rounded-lg font-medium text-base transition-all duration-300 flex items-center gap-2 hover:scale-105"
              >
                <span>View Open Positions (Soon)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#"
                className="group border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 px-6 py-3 rounded-lg font-medium text-base transition-all duration-300 flex items-center gap-2 hover:border-primary hover:text-primary"
              >
                <span>Apply Now (Soon)</span>
                <Send className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Why Work <span className="text-primary">With Us</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We offer more than just a job - we offer a career with purpose and growth
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 group-hover:border-primary transition-all duration-300 group-hover:shadow-xl h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-positions" className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Open <span className="text-primary">Positions</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find your perfect role and join our mission to make hosting better for everyone
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {openPositions.map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 group-hover:border-primary transition-all duration-300 group-hover:shadow-xl h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {position.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {position.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {position.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {position.type}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {position.posted}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {position.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Key Requirements:
                    </h4>
                    <ul className="space-y-2">
                      {position.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a 
                    href="#"
                    className="group/btn inline-flex items-center gap-2 button-primary text-button-primary px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                  >
                    <span>Closed</span>
                    <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values Section */}
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
              Our <span className="text-primary">Values</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide how we work and what we stand for
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
                className="text-center group"
              >
                <div className="bg-white dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 group-hover:border-primary transition-all duration-300 group-hover:shadow-lg h-full">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-8 h-8 text-primary" />
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

      {/* Application Form Section */}
      <section id="application-form" className="py-20 bg-white dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to <span className="text-primary">Apply?</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're excited to learn more about you. Fill out the form below and we'll get back to you soon.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Application Form Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We're currently setting up our application system. In the meantime, you can reach out to us directly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Email Us</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">careers@aspirehosting.com</p>
              </div>
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Discord</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Join our community</p>
              </div>
            </div>

            <div className="text-center">
              <a 
                href="mailto:careers@aspirehosting.com"
                className="group inline-flex items-center gap-2 button-primary text-button-primary px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                <span>Send Your Application</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
