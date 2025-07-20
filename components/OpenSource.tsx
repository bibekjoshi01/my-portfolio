'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Github, Users, BookOpen } from 'lucide-react'
import { openSourceContributions } from '../data/portfolio'

const OpenSource = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'Contribution':
        return <Github size={20} />
      case 'Initiative':
        return <Users size={20} />
      case 'Project':
        return <BookOpen size={20} />
      default:
        return <Github size={20} />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Contribution':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Initiative':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Project':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <section id="opensource" className="section-padding bg-gray-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Open Source & Community
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Contributing to the developer community through open source projects, mentoring, and knowledge sharing
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {openSourceContributions.map((contribution, index) => (
            <motion.div
              key={contribution.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(contribution.type)}`}>
                      <span className="flex items-center gap-1">
                        {getIcon(contribution.type)}
                        {contribution.type}
                      </span>
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {contribution.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-3">
                    {contribution.description}
                  </p>
                  
                  <p className="text-sm text-gray-500 font-mono">
                    {contribution.repository}
                  </p>
                </div>
                
                <div className="md:ml-6">
                  <a
                    href={contribution.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    <Github size={16} />
                    <span>View</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Interested in collaborating or contributing to open source projects?
          </p>
          <a
            href="https://github.com/bibekjoshi"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Github size={18} />
            View All Repositories
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default OpenSource