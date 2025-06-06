"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, Linkedin, Mail, Twitter, ExternalLink, Code, Database, Smartphone, Brain } from "lucide-react"

export default function DeveloperPage() {
  const developer = {
    name: "Alex Johnson",
    title: "Full Stack Developer & AI Enthusiast",
    bio: "Passionate about creating innovative healthcare solutions that make a real difference in people's lives. With over 5 years of experience in web development and a growing expertise in AI/ML, I built MediAssist to democratize access to health information.",
    image: "/placeholder.svg?height=200&width=200",
    location: "San Francisco, CA",
    email: "alex@mediassist.com",
    social: {
      github: "https://github.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson",
      twitter: "https://twitter.com/alexjohnson",
    },
  }

  const skills = [
    { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"], icon: Code },
    { category: "Backend", items: ["Node.js", "Python", "PostgreSQL", "Prisma", "NextAuth"], icon: Database },
    { category: "AI/ML", items: ["TensorFlow", "PyTorch", "OpenAI API", "Hugging Face", "Scikit-learn"], icon: Brain },
    { category: "Tools", items: ["Git", "Docker", "Vercel", "AWS", "Figma"], icon: Smartphone },
  ]

  const projects = [
    {
      title: "MediAssist",
      description: "AI-powered health assistant providing symptom analysis and personalized recommendations.",
      tech: ["Next.js", "TypeScript", "AI/ML", "PostgreSQL"],
      link: "https://mediassist.com",
      github: "https://github.com/alexjohnson/mediassist",
    },
    {
      title: "HealthTracker Pro",
      description: "Comprehensive health monitoring app with wearable device integration.",
      tech: ["React Native", "Node.js", "MongoDB", "IoT"],
      link: "https://healthtracker.com",
      github: "https://github.com/alexjohnson/healthtracker",
    },
    {
      title: "Medical Data Analyzer",
      description: "Machine learning tool for analyzing medical research data and trends.",
      tech: ["Python", "TensorFlow", "Pandas", "Flask"],
      link: "https://medanalyzer.com",
      github: "https://github.com/alexjohnson/medanalyzer",
    },
  ]

  const achievements = [
    "🏆 Winner - Healthcare Innovation Hackathon 2023",
    "📱 Published 3 health-tech mobile apps with 50K+ downloads",
    "🎓 Certified in Machine Learning by Stanford University",
    "💡 Patent pending for AI-driven symptom analysis algorithm",
    "🌟 Featured in TechCrunch for innovative healthcare solutions",
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
            Meet the Developer
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Learn about the person behind MediAssist and the passion driving this innovative healthcare solution.
          </p>
        </div>

        {/* Developer Profile */}
        <Card className="glass-card border-0 mb-12">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Avatar className="w-32 h-32 md:w-40 md:h-40">
                  <AvatarImage src={developer.image || "/placeholder.svg"} alt={developer.name} />
                  <AvatarFallback className="text-2xl">AJ</AvatarFallback>
                </Avatar>
              </motion.div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">{developer.name}</h2>
                <p className="text-xl text-blue-600 dark:text-blue-400 mb-2">{developer.title}</p>
                <p className="text-slate-600 dark:text-slate-400 mb-4">📍 {developer.location}</p>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">{developer.bio}</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${developer.email}`}>
                      <Mail className="mr-2 h-4 w-4" /> Email
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={developer.social.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> GitHub
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={developer.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={developer.social.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="mr-2 h-4 w-4" /> Twitter
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card glass-card-hover h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <skillGroup.icon className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-semibold">{skillGroup.category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card glass-card-hover h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tech.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-3 w-3" /> Live
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-3 w-3" /> Code
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <Card className="glass-card border-0 mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Achievements & Recognition</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <span className="text-lg mr-3">{achievement.split(" ")[0]}</span>
                  <span className="text-slate-700 dark:text-slate-300">{achievement.substring(2)}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card className="glass-card border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Let's Connect!</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              Interested in collaborating on healthcare technology projects or have questions about MediAssist? I'd love
              to hear from you!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <a href={`mailto:${developer.email}`}>
                  <Mail className="mr-2 h-4 w-4" /> Get In Touch
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={developer.social.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> View Projects
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
