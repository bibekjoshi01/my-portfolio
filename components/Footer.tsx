'use client'

import React from 'react'
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react'
import { personalInfo } from '../data/portfolio'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand and Links */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4">{personalInfo.name}</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Building scalable backend systems and fostering tech communities through mentoring and knowledge sharing.
            </p>
            
            <div className="flex justify-center md:justify-start space-x-6">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors duration-200"
                aria-label="GitHub Profile"
              >
                <Github size={20} />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors duration-200"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors duration-200"
                aria-label="Send Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row gap-8 text-center md:text-left">
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <nav className="space-y-2">
                <a href="#about" className="block text-gray-400 hover:text-white transition-colors">
                  About
                </a>
                <a href="#skills" className="block text-gray-400 hover:text-white transition-colors">
                  Skills
                </a>
                <a href="#projects" className="block text-gray-400 hover:text-white transition-colors">
                  Projects
                </a>
                <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </nav>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-gray-400">
                <p>Backend Development</p>
                <p>System Architecture</p>
                <p>Tech Mentoring</p>
                <p>Code Review</p>
              </div>
            </div>
          </div>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="p-3 bg-primary-600 rounded-full hover:bg-primary-700 transition-colors duration-200"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </button>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>
            © {currentYear} {personalInfo.name}. All rights reserved.
          </p>
          <p className="mt-2 text-sm">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer