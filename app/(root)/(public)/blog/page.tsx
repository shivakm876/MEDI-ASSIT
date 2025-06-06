"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, ArrowRight, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI in Healthcare: Transforming Patient Care",
      excerpt:
        "Explore how artificial intelligence is revolutionizing healthcare delivery and improving patient outcomes across the globe.",
      content: "AI is transforming healthcare in unprecedented ways...",
      author: "Dr. Sarah Chen",
      authorImage: "/placeholder.svg?height=40&width=40",
      publishedAt: "2024-01-15",
      readTime: "5 min read",
      category: "AI & Technology",
      tags: ["AI", "Healthcare", "Innovation"],
      featured: true,
    },
    {
      id: 2,
      title: "Understanding Symptom Patterns: When to Seek Medical Help",
      excerpt:
        "Learn to recognize important symptom patterns and understand when it's crucial to consult with healthcare professionals.",
      content: "Recognizing symptom patterns is crucial for early intervention...",
      author: "Dr. Michael Rodriguez",
      authorImage: "/placeholder.svg?height=40&width=40",
      publishedAt: "2024-01-12",
      readTime: "7 min read",
      category: "Health Education",
      tags: ["Symptoms", "Prevention", "Health Tips"],
      featured: false,
    },
    {
      id: 3,
      title: "Digital Health Privacy: Protecting Your Medical Data",
      excerpt: "A comprehensive guide to understanding how your health data is protected in digital health platforms.",
      content: "Digital health privacy is more important than ever...",
      author: "Alex Johnson",
      authorImage: "/placeholder.svg?height=40&width=40",
      publishedAt: "2024-01-10",
      readTime: "6 min read",
      category: "Privacy & Security",
      tags: ["Privacy", "Security", "Data Protection"],
      featured: false,
    },
    {
      id: 4,
      title: "Preventive Healthcare: The Power of Early Detection",
      excerpt:
        "Discover how preventive healthcare measures and early detection can significantly improve health outcomes.",
      content: "Preventive healthcare is the cornerstone of modern medicine...",
      author: "Dr. Emily Watson",
      authorImage: "/placeholder.svg?height=40&width=40",
      publishedAt: "2024-01-08",
      readTime: "8 min read",
      category: "Prevention",
      tags: ["Prevention", "Early Detection", "Wellness"],
      featured: false,
    },
    {
      id: 5,
      title: "Mental Health in the Digital Age: Finding Balance",
      excerpt:
        "Exploring the intersection of technology and mental health, and how to maintain wellbeing in our connected world.",
      content: "Mental health in the digital age requires new approaches...",
      author: "Dr. James Park",
      authorImage: "/placeholder.svg?height=40&width=40",
      publishedAt: "2024-01-05",
      readTime: "9 min read",
      category: "Mental Health",
      tags: ["Mental Health", "Digital Wellness", "Technology"],
      featured: false,
    },
    {
      id: 6,
      title: "Telemedicine Revolution: Healthcare at Your Fingertips",
      excerpt: "How telemedicine is making healthcare more accessible and convenient for patients worldwide.",
      content: "Telemedicine has transformed how we access healthcare...",
      author: "Dr. Lisa Thompson",
      authorImage: "/placeholder.svg?height=40&width=40",
      publishedAt: "2024-01-03",
      readTime: "6 min read",
      category: "Telemedicine",
      tags: ["Telemedicine", "Remote Care", "Accessibility"],
      featured: false,
    },
  ]

  const categories = [
    "All",
    "AI & Technology",
    "Health Education",
    "Privacy & Security",
    "Prevention",
    "Mental Health",
    "Telemedicine",
  ]

  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
            Health & Technology Blog
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Stay informed with the latest insights on healthcare technology, AI innovations, and health education.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input placeholder="Search articles..." className="pl-10" />
          </div>
          <Select defaultValue="All">
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="glass-card border-0 overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white">
                  <Badge className="bg-white/20 text-white mb-4">Featured Article</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredPost.title}</h2>
                  <p className="text-blue-100 mb-6">{featuredPost.excerpt}</p>

                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={featuredPost.authorImage || "/placeholder.svg"} alt={featuredPost.author} />
                      <AvatarFallback>
                        {featuredPost.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{featuredPost.author}</p>
                      <div className="flex items-center gap-2 text-sm text-blue-100">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                        <Clock className="h-3 w-3 ml-2" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="secondary" asChild>
                    <Link href={`/blog/${featuredPost.id}`}>
                      Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="md:w-1/2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">Featured Content</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card glass-card-hover h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <div className="flex items-center text-sm text-slate-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.authorImage || "/placeholder.svg"} alt={post.author} />
                      <AvatarFallback className="text-xs">
                        {post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{post.author}</p>
                      <div className="flex items-center text-xs text-slate-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/blog/${post.id}`}>
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="glass-card border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter to receive the latest articles on healthcare technology, AI innovations, and
                health tips directly in your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button>Subscribe</Button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
