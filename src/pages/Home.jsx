import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Shield,
  Users,
  DollarSign,
  Clock,
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Globe,
  Lock,
} from 'lucide-react';
import { ROUTES } from '../constants';

const Home = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Daily ROI',
      description: 'Earn consistent daily returns on your investments',
      color: 'emerald',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your investments are protected with industry-leading security',
      color: 'indigo',
    },
    {
      icon: Users,
      title: 'Referral Rewards',
      description: 'Earn from your network across 4 levels',
      color: 'purple',
    },
    {
      icon: DollarSign,
      title: 'Flexible Plans',
      description: 'Choose from multiple investment packages',
      color: 'blue',
    },
    {
      icon: Clock,
      title: 'Quick Withdrawals',
      description: 'Fast and secure withdrawal process',
      color: 'amber',
    },
    {
      icon: Award,
      title: 'Rank System',
      description: 'Unlock higher ranks and weekly salaries',
      color: 'pink',
    },
  ];

  const plans = [
    { amount: '$5', dailyEarning: '$0.033', level1: '$0.3' },
    { amount: '$10', dailyEarning: '$0.066', level1: '$0.6' },
    { amount: '$20', dailyEarning: '$0.132', level1: '$1.2' },
    { amount: '$40', dailyEarning: '$0.264', level1: '$2.4' },
    { amount: '$80', dailyEarning: '$0.52', level1: '$4.8' },
  ];

  const ranks = [
    { name: 'Leader', teamSize: '15+', reward: '$5' },
    { name: 'Junior Leader', teamSize: '30+', reward: '$12' },
    { name: 'Team Leader', teamSize: '60+', reward: '$25' },
    { name: 'Area Leader', teamSize: '120+', reward: '$50', salary: '$10/week' },
    { name: 'Manager', teamSize: '240+', reward: '$100', salary: '$20/week' },
  ];

  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your account with a referral code',
      icon: Users,
    },
    {
      number: '02',
      title: 'Choose Plan',
      description: 'Select an investment package that suits you',
      icon: DollarSign,
    },
    {
      number: '03',
      title: 'Invest',
      description: 'Upload payment receipt and wait for approval',
      icon: TrendingUp,
    },
    {
      number: '04',
      title: 'Earn Daily',
      description: 'Receive daily ROI and referral bonuses',
      icon: Award,
    },
  ];

  const benefits = [
    'Daily ROI payments',
    '4-level referral system',
    'Rank-based rewards',
    'Weekly salaries for qualified ranks',
    'Secure and transparent',
    '24/7 support',
  ];

  const colorClasses = {
    indigo: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    amber: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    pink: 'bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header with Logo */}
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="ml-2 sm:ml-3">
                <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                  Dreams Life Traders
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
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
      <section className="relative bg-white dark:bg-gray-900 py-24 md:py-32 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 px-2 text-gray-900 dark:text-white">
              Invest Wisely, Grow Wealthily
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-8 text-indigo-600 dark:text-indigo-400 px-2 font-semibold">
              Dreams Life Traders — The World's Best Investment Opportunity
            </p>
            <p className="text-base sm:text-lg mb-8 sm:mb-12 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              Empowering Financial Freedom Through Smart ROI Plans. Join thousands of successful investors today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
              <Link
                to={ROUTES.REGISTER}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center text-sm sm:text-base min-h-[44px]"
              >
                Join Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-sm sm:text-base min-h-[44px]"
              >
                Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 px-2">
              Why Choose Dreams Life Traders?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 px-4">
              Experience the best investment platform with unmatched features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 ${colorClasses[feature.color]} rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Investment Plans Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Investment Packages
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Choose from our range of investment plans
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                    {plan.amount}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Daily:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {plan.dailyEarning}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Level 1:</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {plan.level1}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to={ROUTES.PLANS}
              className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View All Plans
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Get started in 4 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {step.number}
                    </div>
                    <div className="mt-4 mb-4">
                      <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rank System */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Rank & Rewards System
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Unlock higher ranks and earn weekly salaries
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {ranks.map((rank, index) => (
              <motion.div
                key={rank.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-indigo-400 dark:hover:border-indigo-600"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {rank.name}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Team:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {rank.teamSize}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Reward:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {rank.reward}
                      </span>
                    </div>
                    {rank.salary && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Salary:</span>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          {rank.salary}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Start Your Investment Journey Today
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Join thousands of successful investors who are already earning daily returns and building their wealth.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-500 mr-3" />
                    <span className="text-lg text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border-2 border-indigo-200 dark:border-indigo-800"
            >
              <div className="space-y-6">
                <div>
                  <Zap className="w-12 h-12 mb-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Fast & Secure</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Quick registration and secure payment processing
                  </p>
                </div>
                <div>
                  <Globe className="w-12 h-12 mb-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Global Platform</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Access from anywhere, anytime
                  </p>
                </div>
                <div>
                  <Lock className="w-12 h-12 mb-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">100% Secure</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your data and investments are protected
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Start Investing?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Join Dreams Life Traders today and start your journey to financial freedom
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to={ROUTES.REGISTER}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-indigo-200 dark:border-indigo-800"
              >
                Already a Member? Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

