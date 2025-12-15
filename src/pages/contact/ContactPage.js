import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';

const ContactPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      content: "+92 310 1111 659 (Call / WhatsApp)",
      link: "tel:+923101111659"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: "info@ghazalifood.com",
      link: "mailto:info@ghazalifood.com"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Address",
      content: "Multan, Pakistan",
      link: null
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      content: "10 am to 6 pm (Monday to Saturday)",
      link: null
    }
  ];

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      // TODO: Implement contact form submission to backend
      // For now, just show success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Thank you for contacting us! We will get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkGreen-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gold-950 mb-4">
            Get in <span className="bg-gradient-to-r from-gold-950 to-gold-600 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have a question or need assistance? We're here to help! Reach out to us and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl p-6 hover:border-gold-950/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-950/20 rounded-lg text-gold-950">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gold-950 mb-1">{info.title}</h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-gray-300 hover:text-gold-950 transition-colors"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-gray-300">{info.content}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl p-6"
            >
              <h3 className="font-bold text-gold-950 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=100064311781297&mibextid=ZbWKwL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg text-white bg-[#1877F2] hover:bg-[#0F5AC6] transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/ghazali-food-b50308394?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg text-white bg-[#0A66C2] hover:bg-[#084C91] transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.32 8.16h4.36V24H.32V8.16zM8.34 8.16h4.18v2.15h.06c.58-1.1 2-2.26 4.11-2.26 4.4 0 5.21 2.9 5.21 6.67V24h-4.36v-7.16c0-1.71-.03-3.91-2.39-3.91-2.39 0-2.76 1.86-2.76 3.79V24H8.34V8.16z"/>
                  </svg>
                </a>
                {/* YouTube */}
                <a
                  href="https://youtube.com/@ghazalifood?si=BdrIYDKnV5AGk2mz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg text-white bg-[#FF0000] hover:bg-[#CC0000] transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a2.993 2.993 0 00-2.107-2.12C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.391.566A2.993 2.993 0 00.502 6.186C0 8.09 0 12 0 12s0 3.91.502 5.814a2.993 2.993 0 002.107 2.12C4.495 20.5 12 20.5 12 20.5s7.505 0 9.391-.566a2.993 2.993 0 002.107-2.12C24 15.91 24 12 24 12s0-3.91-.502-5.814zM9.75 15.5v-7l6 3.5-6 3.5z" />
                  </svg>
                </a>
                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@ghazalifood?_r=1&_t=ZS-92EwkzTtQFJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg text-white bg-black hover:bg-gray-800 transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 8.05a5.37 5.37 0 01-3.03-.98 5.5 5.5 0 01-1.6-1.9c-.27-.56-.44-1.16-.52-1.78h-.01A5.63 5.63 0 0114.75 2H11v11.37a2.19 2.19 0 01-1.09 1.9 2.07 2.07 0 01-1.08.3A2.19 2.19 0 016.64 13.4a2.19 2.19 0 012.19-2.19c.23 0 .45.03.66.09V8.07A5.53 5.53 0 008.83 8a5.5 5.5 0 100 11 5.5 5.5 0 005.5-5.5v-6a8.19 8.19 0 003.61 2.18c.35.1.71.18 1.06.22V8.05z" />
                  </svg>
                </a>
                {/* Snapchat */}
                <a
                  href="https://www.snapchat.com/add/ghazalifood?share_id=2vW7jbXCvOw&locale=en-GB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg text-black bg-[#FFFC00] hover:bg-[#F2E800] transition-colors"
                  aria-label="Snapchat"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.005 2c-2.52 0-4.58 1.93-4.73 4.45-.04.71-.02 1.45-.02 2.18 0 1.18-.2 1.68-.36 2.02-.24.52-.63.86-1.36 1.08-.23.07-.37.3-.33.54.14.82.71 1.27 1.27 1.55.22.11.3.36.2.57-.39.79-1.01 1.33-1.7 1.66-.29.14-.42.48-.3.78.2.47.66.78 1.23.86.32.05.66.04 1.02.02.18-.01.36-.02.54-.02.46 0 .83.1 1.18.2.36.1.7.2 1.08.2.46 0 .82-.13 1.19-.27.32-.12.65-.24 1.03-.24.4 0 .73.12 1.06.24.37.14.73.27 1.19.27.39 0 .72-.1 1.08-.2.35-.1.72-.2 1.18-.2.17 0 .35.01.53.02.36.02.7.03 1.02-.02.57-.08 1.03-.39 1.23-.86.12-.3-.01-.64-.3-.78-.69-.33-1.31-.87-1.7-1.66-.11-.21-.03-.46.2-.57.56-.28 1.13-.73 1.27-1.55.04-.24-.1-.47-.33-.54-.73-.22-1.12-.56-1.36-1.08-.16-.34-.36-.84-.36-2.02 0-.73.02-1.47-.02-2.18C16.585 3.93 14.525 2 12.005 2z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-gold-950" />
                <h2 className="text-2xl font-bold text-gold-950">Send us a Message</h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 bg-darkGreen-950 border border-gold-950/30 rounded-lg text-gray-300 focus:ring-2 focus:ring-gold-950 focus:border-gold-950 transition-colors"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full px-4 py-3 bg-darkGreen-950 border border-gold-950/30 rounded-lg text-gray-300 focus:ring-2 focus:ring-gold-950 focus:border-gold-950 transition-colors"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full px-4 py-3 bg-darkGreen-950 border border-gold-950/30 rounded-lg text-gray-300 focus:ring-2 focus:ring-gold-950 focus:border-gold-950 transition-colors"
                    placeholder="+92 300 1234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    {...register('subject', { required: 'Subject is required' })}
                    className="w-full px-4 py-3 bg-darkGreen-950 border border-gold-950/30 rounded-lg text-gray-300 focus:ring-2 focus:ring-gold-950 focus:border-gold-950 transition-colors"
                    placeholder="How can we help?"
                  />
                  {errors.subject && (
                    <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Message *
                  </label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    rows={6}
                    className="w-full px-4 py-3 bg-darkGreen-950 border border-gold-950/30 rounded-lg text-gray-300 focus:ring-2 focus:ring-gold-950 focus:border-gold-950 transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                  {errors.message && (
                    <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold-950 text-darkGreen-950 py-3 px-6 rounded-lg font-semibold hover:bg-gold-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

