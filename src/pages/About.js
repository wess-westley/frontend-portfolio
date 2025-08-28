import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import { FaDownload, FaCloud, FaNetworkWired, FaCode, FaDatabase } from 'react-icons/fa';
import "../styles/About.css";

const About = () => {
  const [profilePicture, setProfilePicture] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [loading, setLoading] = useState({ picture: true, cv: true });
  const [error, setError] = useState({ picture: null, cv: null });

  const skills = [
    { category: 'Cloud Engineering', level: 85, icon: <FaCloud /> },
    { category: 'Network Engineering', level: 75, icon: <FaNetworkWired /> },
    { category: 'Full-Stack Development', level: 90, icon: <FaCode /> },
    { category: 'Database Design', level: 80, icon: <FaDatabase /> },
  ];

  const softSkills = [
    "Problem-Solving & Debugging",
    "Leadership in Team Projects",
    "Creative UI/UX Thinking",
    "Effective Communication",
    "Time Management & Discipline"
  ];

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
                I'm <strong>Westley Kanyora</strong>, a software engineering student at 
                <strong> Kirinyaga University</strong> passionate about turning abstract ideas 
                into real, impactful solutions. My journey started with curiosity about how 
                computers "think," and today, I’m focused on <strong>cloud computing</strong>, 
                <strong> full-stack development</strong>, and <strong>network engineering</strong>.
              </p>
              <p>
                Beyond code, I’m a <strong>skater</strong> and <strong>rollball player</strong>, 
                which keeps my creativity and discipline sharp. I believe that engineering is not 
                just about solving problems—it’s about building experiences that matter.
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

      {/* Technical Skills Section */}
      <section className="skills">
        <div className="container">
          <h2>Technical Skills</h2>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.category}
                className="skill-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="skill-icon">{skill.icon}</div>
                <h3>{skill.category}</h3>
                <div className="progress-circle">
                  <svg>
                    <circle cx="50%" cy="50%" r="40"></circle>
                    <motion.circle
                      cx="50%" cy="50%" r="40"
                      initial={{ strokeDasharray: "0 251" }}
                      whileInView={{ strokeDasharray: `${(skill.level/100) * 251} 251` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      viewport={{ once: true }}
                    />
                  </svg>
                  <span>{skill.level}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Soft Skills Section */}
      <section className="soft-skills">
        <div className="container">
          <h2>Soft Skills</h2>
          <ul>
            {softSkills.map((skill, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
              >
                ✅ {skill}
              </motion.li>
            ))}
          </ul>
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
