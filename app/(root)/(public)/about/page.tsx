"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Heart, Shield, Stethoscope, Users, Zap } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze your symptoms to provide accurate health insights.",
    },
    {
      icon: Stethoscope,
      title: "Medical Expertise",
      description: "Built with input from healthcare professionals to ensure reliable and trustworthy recommendations.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your health data is encrypted and secure. We never share your personal information.",
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "Tailored recommendations based on your unique health profile and symptom history.",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get immediate health insights and recommendations without waiting for appointments.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Continuously improving through user feedback and the latest medical research.",
    },
  ]

  const stats = [
    { number: "100K+", label: "Users Helped" },
    { number: "500K+", label: "Symptoms Analyzed" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "24/7", label: "Availability" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Stethoscope className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
            About MediAssist
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Empowering individuals with AI-powered health insights to make informed decisions about their wellbeing.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="glass-card border-0 mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-6">
              At MediAssist, we believe that everyone deserves access to reliable health information. Our mission is to
              democratize healthcare by providing AI-powered symptom analysis that helps people understand their health
              better and make informed decisions about seeking medical care.
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
              We're not here to replace doctors, but to empower you with knowledge and help you communicate more
              effectively with healthcare professionals. Our AI assistant provides preliminary insights that can guide
              you toward appropriate care when you need it most.
            </p>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card glass-card-hover text-center p-6">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.number}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose MediAssist?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card glass-card-hover h-full p-6">
                  <div className="bg-blue-100 dark:bg-blue-900/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <Card className="glass-card border-0 mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Technology</h2>
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-6">
              MediAssist leverages cutting-edge artificial intelligence and machine learning technologies to analyze
              symptoms and provide health insights. Our AI models are trained on vast medical datasets and continuously
              updated with the latest medical research.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Machine Learning</Badge>
              <Badge variant="secondary">Natural Language Processing</Badge>
              <Badge variant="secondary">Medical AI</Badge>
              <Badge variant="secondary">Data Security</Badge>
              <Badge variant="secondary">Cloud Computing</Badge>
              <Badge variant="secondary">Real-time Analysis</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer Section */}
        <Card className="glass-card border-0 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">
              Important Medical Disclaimer
            </h3>
            <p className="text-amber-700 dark:text-amber-400 text-sm">
              MediAssist is designed to provide health information and should not be used as a substitute for
              professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other
              qualified health provider with any questions you may have regarding a medical condition. Never disregard
              professional medical advice or delay in seeking it because of something you have read on MediAssist.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
