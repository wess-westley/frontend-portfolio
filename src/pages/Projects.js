import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects, syncGithubProjects } from '../redux/slices/projectSlice';
import { motion } from 'framer-motion';
import "../styles/Projects.css";
import { v4 as uuidv4 } from 'uuid';

const Projects = () => {
  const {
    items: projects,
    synced,
    status,
    error,
    syncStatus,
    syncError,
  } = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  // State for comments and ratings
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({});
  const [newComment, setNewComment] = useState('');
  const [activeProject, setActiveProject] = useState(null);
  const [userIdentity, setUserIdentity] = useState('');
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProjects());
    if (syncStatus === 'idle') dispatch(syncGithubProjects());
    
    // Load comments and ratings from localStorage
    const storedComments = JSON.parse(localStorage.getItem('projectComments')) || {};
    const storedRatings = JSON.parse(localStorage.getItem('projectRatings')) || {};
    
    // Filter out expired comments/ratings (older than 30 days)
    const now = new Date();
    const filteredComments = {};
    const filteredRatings = {};
    
    Object.keys(storedComments).forEach(projectId => {
      filteredComments[projectId] = storedComments[projectId].filter(comment => {
        const commentDate = new Date(comment.timestamp);
        return (now - commentDate) <= (30 * 24 * 60 * 60 * 1000);
      });
    });
    
    Object.keys(storedRatings).forEach(projectId => {
      filteredRatings[projectId] = storedRatings[projectId].filter(rating => {
        const ratingDate = new Date(rating.timestamp);
        return (now - ratingDate) <= (30 * 24 * 60 * 60 * 1000);
      });
    });
    
    setComments(filteredComments);
    setRatings(filteredRatings);
    
    // Save filtered data back to localStorage
    localStorage.setItem('projectComments', JSON.stringify(filteredComments));
    localStorage.setItem('projectRatings', JSON.stringify(filteredRatings));
    
    // Generate or load user identity
    let identity = localStorage.getItem('userIdentity');
    if (!identity) {
      identity = `user-${uuidv4().substr(0, 8)}`;
      localStorage.setItem('userIdentity', identity);
    }
    setUserIdentity(identity);
  }, [status, syncStatus, dispatch]);

  const handleAddComment = (projectId) => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: uuidv4(),
      text: newComment,
      user: userIdentity,
      timestamp: new Date().toISOString()
    };
    
    const updatedComments = {
      ...comments,
      [projectId]: [...(comments[projectId] || []), comment]
    };
    
    setComments(updatedComments);
    localStorage.setItem('projectComments', JSON.stringify(updatedComments));
    setNewComment('');
    setActiveProject(null);
  };

  const handleAddRating = (projectId) => {
    if (currentRating === 0) return;
    
    const rating = {
      id: uuidv4(),
      value: currentRating,
      user: userIdentity,
      timestamp: new Date().toISOString()
    };
    
    const updatedRatings = {
      ...ratings,
      [projectId]: [...(ratings[projectId] || []), rating]
    };
    
    setRatings(updatedRatings);
    localStorage.setItem('projectRatings', JSON.stringify(updatedRatings));
    setCurrentRating(0);
  };

  const calculateAverageRating = (projectId) => {
    if (!ratings[projectId] || ratings[projectId].length === 0) return 0;
    const sum = ratings[projectId].reduce((acc, curr) => acc + curr.value, 0);
    return (sum / ratings[projectId].length).toFixed(1);
  };

  // Merge: filter out GitHub projects already in DB
  const syncedProjects = synced
    .filter((title) => !projects.some((proj) => proj.title === title))
    .map((title, index) => ({
      id: `synced-${index}`,
      title,
      description: 'Imported from GitHub',
      tech_stack: 'Auto-detected',
      github_url: `https://github.com/wess-westley/${title}`,
      demo_url: `https://wess-westley.github.io/${title}/index.html`,

    }));

  const allProjects = [...projects, ...syncedProjects];

  return (
    <motion.div
      className="projects"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <h2>My Projects</h2>

        {/* Loading and error states */}
        {status === 'loading' && <p>📦 Loading projects from database...</p>}
        {status === 'failed' && (
          <p style={{ color: 'red' }}>❌ Error loading projects: {error}</p>
        )}

        {syncStatus === 'loading' && <p>🔄 Syncing GitHub repositories...</p>}
        {syncStatus === 'failed' && (
          <p style={{ color: 'red' }}>❌ GitHub Sync Error: {syncError || 'Unknown error'}</p>
        )}

        {/* No projects fallback */}
        {allProjects.length === 0 &&
          status === 'succeeded' &&
          syncStatus === 'succeeded' && (
            <p>😴 No projects available yet. Stay tuned!</p>
          )}

        {/* Project cards */}
        <div className="projects-grid">
          {allProjects.map((project, index) => {
            const projectId = project.id || index;
            const avgRating = calculateAverageRating(projectId);
            const projectComments = comments[projectId] || [];
            const projectRatings = ratings[projectId] || [];
            
            return (
              <motion.div
                key={projectId}
                className="project-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="project-header">
                  <h3>{project.title}</h3>
                  {avgRating > 0 && (
                    <div className="rating-badge">
                      ⭐ {avgRating} ({projectRatings.length})
                    </div>
                  )}
                </div>
                <p>{project.description}</p>
                <div className="tech-stack">
                  <strong>Tech Stack:</strong> {project.tech_stack}
                </div>
                <div className="project-links">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`GitHub repository for ${project.title}`}
                    >
                      GitHub
                    </a>
                  )}
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Live demo for ${project.title}`}
                    >
                      Live Demo
                    </a>
                  )}
                </div>

                {/* Rating system */}
                <div className="rating-section">
                  <p>Rate this project:</p>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= (hoverRating || currentRating) ? 'filled' : ''}`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setCurrentRating(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <button 
                    className="submit-rating"
                    onClick={() => handleAddRating(projectId)}
                    disabled={currentRating === 0}
                  >
                    Submit Rating
                  </button>
                </div>

                {/* Comments section */}
                <div className="comments-section">
                  <div className="comments-header">
                    <h4>Comments ({projectComments.length})</h4>
                    <button 
                      className="toggle-comments"
                      onClick={() => setActiveProject(activeProject === projectId ? null : projectId)}
                    >
                      {activeProject === projectId ? '▲ Hide' : '▼ Show'}
                    </button>
                  </div>

                  {activeProject === projectId && (
                    <div className="comments-container">
                      {projectComments.length > 0 ? (
                        projectComments.map((comment) => (
                          <div key={comment.id} className="comment">
                            <div className="comment-header">
                              <span className="comment-user">
                                {comment.user.replace('user-', 'User ')}
                              </span>
                              <span className="comment-date">
                                {new Date(comment.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
                      )}

                      <div className="add-comment">
                        <textarea
                          placeholder="Add your comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button
                          onClick={() => handleAddComment(projectId)}
                          disabled={!newComment.trim()}
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Projects;