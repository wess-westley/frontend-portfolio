import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { icon: <FaGithub />, url: 'https://github.com/westley-wess', name: 'GitHub' },
    { icon: <FaLinkedin />, url: 'https://linkedin.com/in/westleygitau', name: 'LinkedIn' },
    { icon: <FaTwitter />, url: 'https://twitter.com/westleygitau', name: 'Twitter' },
    { icon: <FaEnvelope />, url: 'mailto:westleywess31@gmail.com', name: 'Email' },
    { icon: <FaPhone />, url: 'tel:+254798245012', name: 'Phone' },
  ];

  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'linear-gradient(135deg, #1f2937, #111827)',
        color: '#f9fafb',
        padding: '2rem 0',
        textAlign: 'center',
      }}
    >
      <div className="footer-particles">
  {[...Array(20)].map((_, i) => (
    <span key={i} className="particle"></span>
  ))}
</div>
      <div className="social-links" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
        {socialLinks.map((link, index) => (
          <motion.a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, color: '#60a5fa' }}
            style={{ fontSize: '1.5rem', color: '#f9fafb', transition: 'color 0.3s' }}
            title={link.name}
          >
            {link.icon}
          </motion.a>
        ))}
      </div>
      <p style={{ marginBottom: '0.5rem' }}>
        &copy; {new Date().getFullYear()} Westley Kanyora Gitau. All rights reserved.
      </p>
      <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Software Engineer | Cloud & Network Enthusiast</p>
    </motion.footer>
  );
};

export default Footer;
