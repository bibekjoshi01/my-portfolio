'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { skills } from '../data/portfolio'
import { Skill } from '../types'

const Skills = () => {
  const skillCategories = ['Backend', 'Database', 'Frontend', 'Tools', 'Cloud'] as const
  
  const getSkillsByCategory = (category: Skill['category']) => {
    return skills.filter(skill => skill.category === category)
  }

  const getProficiencyColor = (proficiency: Skill['proficiency']) => {
    switch (proficiency) {
      case 'Expert':
        return 'bg-green-500'
      case 'Advanced':
        return 'bg-blue-500'
      case 'Intermediate':
        return 'bg-yellow-500'
      case 'Beginner':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  const getProficiencyWidth = (proficiency: Skill['proficiency']) => {
    switch (proficiency) {
      case 'Expert':
        return 'w-full'
      case 'Advanced':
        return 'w-4/5'
      case 'Intermediate':
        return 'w-3/5'
      case 'Beginner':
        return 'w-2/5'
      default:
        return 'w-2/5'
    }
  }

  return (
    <section id="skills" className="section-padding bg-gray-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Skills & Technologies
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise across different domains
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => {
            const categorySkills = getSkillsByCategory(category)
            if (categorySkills.length === 0) return null

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                  {category}
                </h3>
                
                <div className="space-y-4">
                  {categorySkills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                      viewport={{ once: true }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800">{skill.name}</span>
                        <span className="text-sm text-gray-500">{skill.proficiency}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${getProficiencyColor(skill.proficiency)} ${getProficiencyWidth(skill.proficiency)}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          transition={{ duration: 0.8, delay: (categoryIndex * 0.1) + (skillIndex * 0.05) + 0.2 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Skills