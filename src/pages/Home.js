import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaAws, FaFileDownload, FaEnvelope } from 'react-icons/fa';

// Import images
import img1 from '../Pictures/img1.jpg';
import img2 from '../Pictures/img2.jpg';
import img3 from '../Pictures/img3.jpg';
import img4 from '../Pictures/img4.jpg';
import img5 from '../Pictures/img5.jpg';
import img6 from '../Pictures/img6.jpg';

const Home = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { title: "GitHub", icon: <FaGithub />, url: "https://github.com/wess-westley", color: "#333" },
    { title: "LinkedIn", icon: <FaLinkedin />, url: "https://linkedin.com/in/westleygitau", color: "#0077B5" },
    { title: "AWS Certifications", icon: <FaAws />, url: "https://aws.amazon.com/certification/", color: "#FF9900" },
    { title: "Download CV", icon: <FaFileDownload />, url: "/path-to-your-cv.pdf", color: "#6c5ce7", download: true },
    { title: "Email Me", icon: <FaEnvelope />, url: "mailto:westleywess31@gmail.com", color: "#d63031" }
  ];

  const galleryImages = [
    { src: img1, caption: "Skating Fun" },
    { src: img2, caption: "Rollball Action" },
    { src: img3, caption: "AWS Training" },
    { src: img4, caption: "Networking Setup" },
    { src: img5, caption: "Bookstore Project" },
    { src: img6, caption: "Portfolio Snapshot" }
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % galleryImages.length);
    }, 60000); // 1 minute per image
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  const handleHireMe = () => {
    navigate('/hire');
  };

  return (
    <motion.div className="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <motion.h1 className="hero-title" initial={{ x: -100 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 100 }}>
            Westley Kanyora Gitau
          </motion.h1>
          <motion.p className="hero-subtitle" initial={{ x: 100 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}>
            Software Engineering Student | AWS Trainee | Network Engineering
          </motion.p>
          <motion.p className="hero-fun-fact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            Fun fact: When I'm not coding, you can find me skating or playing rollball!
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <motion.button className="btn btn-primary" onClick={handleHireMe} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Hire Me Directly
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="container">
          <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
            My Gallery
          </motion.h2>
          <div className="gallery-slideshow">
            <AnimatePresence>
              {galleryImages.map((img, index) => (
                index === currentImage && (
                  <motion.div
                    key={index}
                    className="gallery-item"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <motion.img
                      src={img.src}
                      alt={img.caption}
                      className="gallery-img"
                      initial={{ scale: 1 }}
                      animate={{ scale: 1.03 }}
                      transition={{ duration: 60, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="gallery-caption"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                    >
                      {img.caption}
                    </motion.div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="quick-links-section">
        <div className="container">
          <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}>
            Quick Links
          </motion.h2>
          <motion.div className="quick-links-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
            {quickLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                className="quick-link-card"
                target="_blank"
                rel="noopener noreferrer"
                download={link.download}
                style={{ '--link-color': link.color }}
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="quick-link-icon">{link.icon}</div>
                <h3>{link.title}</h3>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
