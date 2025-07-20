'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react'
import { personalInfo } from '../data/portfolio'

const Hero = () => {
  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white pt-16">
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {personalInfo.name}
          </motion.h1>
          
          <motion.h2 
            className="text-xl md:text-2xl text-primary-600 font-semibold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {personalInfo.title}
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {personalInfo.tagline}
          </motion.p>

          <motion.div 
            className="flex justify-center space-x-6 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white border border-gray-200 rounded-full hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="GitHub Profile"
            >
              <Github size={24} className="text-gray-700 hover:text-primary-600" />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white border border-gray-200 rounded-full hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={24} className="text-gray-700 hover:text-primary-600" />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="p-3 bg-white border border-gray-200 rounded-full hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="Send Email"
            >
              <Mail size={24} className="text-gray-700 hover:text-primary-600" />
            </a>
          </motion.div>

          <motion.button
            onClick={scrollToAbout}
            className="animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            aria-label="Scroll to About section"
          >
            <ArrowDown size={32} className="text-gray-400 hover:text-primary-600 transition-colors duration-300" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero