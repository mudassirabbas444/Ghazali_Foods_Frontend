import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Award, 
  Users, 
  ShoppingBag, 
  Leaf,
  Target,
  CheckCircle
} from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Quality",
      description: "We source only the finest ingredients from trusted suppliers to ensure exceptional quality in every product."
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Natural & Fresh",
      description: "All our products are carefully selected to maintain their natural goodness and freshness."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Customer First",
      description: "Your satisfaction is our top priority. We're committed to providing the best shopping experience."
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Wide Selection",
      description: "From dry fruits to gourmet chocolates, we offer a diverse range of premium food products."
    }
  ];

  const values = [
    "100% Authentic Products",
    "Fresh & Quality Assured",
    "Fast & Reliable Delivery",
    "Customer Satisfaction Guaranteed",
    "Competitive Pricing",
    "Secure Payment Options"
  ];

  return (
    <div className="min-h-screen bg-darkGreen-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gold-950 mb-4">
            About <span className="bg-gradient-to-r from-gold-950 to-gold-600 bg-clip-text text-transparent">Ghazali Food</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your trusted partner for premium quality dry fruits, nuts, oils, chocolates, and gourmet food products.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl p-8 md:p-12 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gold-950 mb-4">Our Story</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Ghazali Food was founded with a simple mission: to bring the finest quality food products directly to your doorstep. 
                We understand that quality matters, especially when it comes to what you and your family consume.
              </p>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Starting as a small family business, we've grown into a trusted name in the food industry, known for our commitment 
                to authenticity, freshness, and customer satisfaction. Every product we offer is carefully selected, tested, and 
                packaged to maintain its premium quality.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Today, we're proud to serve thousands of satisfied customers across the country, delivering not just products, 
                but an experience of trust, quality, and excellence.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gold-950/20 to-gold-600/20 flex items-center justify-center">
                <ShoppingBag className="w-32 h-32 text-gold-950" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gold-950 text-center mb-8">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl p-6 hover:border-gold-950/50 transition-all duration-300"
              >
                <div className="text-gold-950 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gold-950 mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-gold-950" />
              <h2 className="text-2xl font-bold text-gold-950">Our Mission</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To provide our customers with the highest quality food products while maintaining the highest standards 
              of service, integrity, and customer satisfaction. We strive to make premium quality accessible to everyone.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-gold-950" />
              <h2 className="text-2xl font-bold text-gold-950">Our Vision</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To become the leading online destination for premium food products, recognized for our quality, 
              reliability, and commitment to customer excellence. We envision a future where everyone has access 
              to authentic, high-quality food products.
            </p>
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-gold-950 text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-gold-950 flex-shrink-0" />
                <span className="text-gray-300 font-medium">{value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;

