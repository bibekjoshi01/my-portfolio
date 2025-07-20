'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { personalInfo } from '../data/portfolio'

const About = () => {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            About Me
          </h2>
          
          <div className="text-lg text-gray-600 leading-relaxed space-y-6">
            <p>
              {personalInfo.bio}
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">5+</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Years Experience</h3>
                <p className="text-gray-600 text-sm">Building scalable backend systems</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">50+</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Projects Completed</h3>
                <p className="text-gray-600 text-sm">From startups to enterprise solutions</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">500+</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Developers Mentored</h3>
                <p className="text-gray-600 text-sm">Through community initiatives</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About