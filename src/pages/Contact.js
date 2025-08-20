import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import"../styles/contact.css";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 20,
      staggerChildren: 0.15,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    try {
      await axios.post('/contact/', formData);
      setStatus('succeeded');
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (err) {
      setStatus('failed');
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <motion.div
      className="contact flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg"
        variants={containerVariants}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Let’s Connect 🤝
        </h2>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          variants={containerVariants}
        >
          <motion.div variants={fieldVariants}>
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label htmlFor="message" className="block text-gray-700 font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="mt-1 block w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </motion.div>

          <motion.button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </motion.button>

          {status === 'succeeded' && (
            <motion.p
              className="text-green-600 text-center font-medium mt-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, yoyo: Infinity }}
            >
              ✅ Message sent successfully!
            </motion.p>
          )}
          {status === 'failed' && (
            <motion.p
              className="text-red-600 text-center font-medium mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default Contact;
