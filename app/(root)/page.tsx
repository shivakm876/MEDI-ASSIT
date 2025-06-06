"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Heart, Shield, Stethoscope } from "lucide-react"

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center"
      >
        <div className="mb-8 relative">
          <div className="absolute -z-10 w-64 h-64 bg-blue-300/30 dark:bg-blue-600/20 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <Stethoscope className="w-16 h-16 md:w-20 md:h-20 text-white" />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4"
        >
          MediAssist
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-2xl mb-8"
        >
          Your AI-powered health assistant, providing personalized medical insights and guidance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg">
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="rounded-full px-8 py-6 text-lg">
            <Link href="/free-input">
              Use for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
      >
        <motion.div variants={item} className="glass-card glass-card-hover rounded-2xl p-6">
          <div className="bg-blue-100 dark:bg-blue-900/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Stethoscope className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Symptom Analysis</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Input your symptoms and get AI-powered analysis and potential diagnoses.
          </p>
        </motion.div>

        <motion.div variants={item} className="glass-card glass-card-hover rounded-2xl p-6">
          <div className="bg-purple-100 dark:bg-purple-900/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Health Tracking</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Track your symptoms and health metrics over time to monitor your wellbeing.
          </p>
        </motion.div>

        <motion.div variants={item} className="glass-card glass-card-hover rounded-2xl p-6">
          <div className="bg-green-100 dark:bg-green-900/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Medical Knowledge</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Access our medical knowledge base and get answers to your health questions.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
