import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import { FaDownload } from 'react-icons/fa';
import "../styles/About.css";

const About = () => {
  const [profilePicture, setProfilePicture] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [loading, setLoading] = useState({
    picture: true,
    cv: true
  });
  const [error, setError] = useState({
    picture: null,
    cv: null
  });

  const skills = [
    { category: 'Cloud Engineering', level: 85 },
    { category: 'Network Engineering', level: 75 },
    { category: 'Full-Stack Development', level: 90 },
    { category: 'Database Design', level: 80 },
  ];

  // Add your badges here
  const badges = [
    {
      title: "Cisco Networking",
      imgUrl: "https://images.credly.com/images/35e4ad7a-356f-44ba-9765-795b98b233f3/Cisco-Badge.png",
      link: "https://www.credly.com/badges/35e4ad7a-356f-44ba-9765-795b98b233f3/public_url"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pictureResponse = await axios.get('/profile/picture');
        setProfilePicture(pictureResponse.data.imageUrl);
        setLoading(prev => ({ ...prev, picture: false }));
      } catch (err) {
        setError(prev => ({ ...prev, picture: 'Failed to load profile picture' }));
        setLoading(prev => ({ ...prev, picture: false }));
      }

      try {
        const cvResponse = await axios.get('/profile/cv');
        setCvUrl(cvResponse.data.cvUrl);
        setLoading(prev => ({ ...prev, cv: false }));
      } catch (err) {
        setError(prev => ({ ...prev, cv: 'Failed to load CV' }));
        setLoading(prev => ({ ...prev, cv: false }));
      }
    };

    fetchData();
  }, []);

  const handleDownloadCV = () => {
    if (cvUrl) {
      const link = document.createElement('a');
      link.href = cvUrl;
      link.download = 'Westley_Kanyora_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.div
      className="about"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Bio Section */}
      <section className="bio">
        <div className="container">
          <motion.div 
            className="profile-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {loading.picture ? (
              <div className="profile-picture-loader"></div>
            ) : error.picture ? (
              <div className="profile-picture-error">
                <span>👤</span>
              </div>
            ) : (
              <motion.img
                src={profilePicture}
                alt="Profile"
                className="profile-picture"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              />
            )}
            <div className="profile-content">
              <h2>About Me</h2>
              <p>
                I'm a passionate software engineering student at Kirinyaga University with a strong focus 
                on cloud computing and full-stack development. My journey in tech started with a curiosity 
                about how things work, and it has grown into a deep love for creating solutions that make 
                an impact.
              </p>
              <p>
                Currently, I'm training with AWS to enhance my cloud skills, and I enjoy applying what I 
                learn to real-world projects. When I'm not studying or coding, you can find me skating 
                or playing rollball, which helps me stay active and creative.
              </p>
              
              <motion.button
                onClick={handleDownloadCV}
                className="btn btn-download"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading.cv || !cvUrl}
              >
                {loading.cv ? (
                  'Loading CV...'
                ) : error.cv ? (
                  'CV Unavailable'
                ) : (
                  <>
                    <FaDownload /> Download My CV
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills">
        <div className="container">
          <h2>My Skills</h2>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.category}
                className="skill-bar-container"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="skill-label">
                  <span>{skill.category}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <motion.div
                    className="skill-progress"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section className="badges">
        <div className="container">
          <h2>Achievements & Certifications</h2>
          <div className="badges-grid">
            {badges.map((badge, index) => (
              <motion.a
                key={index}
                href={badge.link}
                target="_blank"
                rel="noopener noreferrer"
                className="badge-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <img src={badge.imgUrl} alt={badge.title} className="badge-img" />
                <p>{badge.title}</p>
              </motion.a>
            ))}
          </div>
          <div className="credly-link">
            <a 
              href="https://www.credly.com/users/westley-kanyora" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-credly"
            >
              View All My Badges
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
