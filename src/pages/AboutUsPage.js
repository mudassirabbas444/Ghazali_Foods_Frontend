import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ShoppingCart, Pill, Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import logo from '../assets/Logo.png';
import { ThemeToggle } from '../components/ui';

const AboutUsPage = () => {
  const projects = [
    {
      id: 1,
      title: 'Dairy Farm Project',
      icon: Building2,
      description: 'Our dairy farm project focuses on producing high-quality dairy products, providing our customers with fresh and healthy milk. With our modern dairy farming techniques and experienced team, we produce the highest quality dairy products.',
      image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=600&fit=crop', // Placeholder - replace with actual image
      color: 'emerald',
    },
    {
      id: 2,
      title: 'Commerce Business',
      icon: ShoppingCart,
      description: 'Our commerce business focuses on trading various products, providing our customers with high-quality goods. With our experienced team and extensive distribution network, we are committed to meeting our customers\' needs.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop', // Placeholder - replace with actual image
      color: 'blue',
    },
    {
      id: 3,
      title: 'Pharmacy Project',
      icon: Pill,
      description: 'Our pharmacy project focuses on distributing high-quality medicines and health products. With our experienced team and extensive distribution network, we provide our customers with the highest quality products.',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=600&fit=crop', // Placeholder - replace with actual image
      color: 'purple',
    },
    {
      id: 4,
      title: 'Property Project',
      icon: Home,
      description: 'Our property project focuses on developing residential and commercial properties. With our experienced team and high-quality construction standards, we provide our customers with the highest quality housing and commercial spaces.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop', // Placeholder - replace with actual image
      color: 'amber',
    },
  ];

  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-900/20',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
                <img
                  src={logo}
                  alt="Dreams Life Traders Logo"
                  className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                />
                <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                  Dreams Life Traders
                </h1>
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to={ROUTES.HOME}
                className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors px-2 sm:px-0"
              >
                Home
              </Link>
              <ThemeToggle />
              <Link
                to={ROUTES.LOGIN}
                className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors px-2 sm:px-0"
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm sm:text-base font-semibold px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              Welcome to Dreams Life Traders
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              We are a multi-industry company committed to excellence in various sectors. Our company has four major projects that reflect our commitment to growth and innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our Projects
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
              Four major projects driving our commitment to growth and innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((project, index) => {
              const Icon = project.icon;
              const colors = colorClasses[project.color];
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Project Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x600?text=' + encodeURIComponent(project.title);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className={`inline-flex items-center ${colors.bg} ${colors.text} px-4 py-2 rounded-lg mb-2`}>
                        <Icon className="w-5 h-5 mr-2" />
                        <span className="font-semibold">{project.title}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6 md:p-8">
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Commitment
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              With these four major projects, we are committed to providing our customers with the highest quality products and services. Our dedication to excellence drives us to continuously innovate and expand our reach across multiple industries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Join Us Today
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Be part of our journey towards excellence and innovation
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to={ROUTES.REGISTER}
                className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to={ROUTES.HOME}
                className="inline-flex items-center bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-indigo-200 dark:border-indigo-800"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;

