import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects, syncGithubProjects } from '../redux/slices/projectSlice';
import { motion } from 'framer-motion';
import "../styles/Projects.css";
import { v4 as uuidv4 } from 'uuid';

const Projects = () => {
  const { items: projects, synced, status, error, syncStatus, syncError } = useSelector(state => state.projects);
  const dispatch = useDispatch();

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

    const identity = localStorage.getItem('userIdentity') || `user-${uuidv4().substr(0, 8)}`;
    localStorage.setItem('userIdentity', identity);
    setUserIdentity(identity);

    setComments(JSON.parse(localStorage.getItem('projectComments') || '{}'));
    setRatings(JSON.parse(localStorage.getItem('projectRatings') || '{}'));
  }, [status, syncStatus, dispatch]);

  const handleAddComment = (projectId) => {
    if (!newComment.trim()) return;
    const comment = { id: uuidv4(), text: newComment, user: userIdentity, timestamp: new Date().toISOString() };
    const updatedComments = { ...comments, [projectId]: [...(comments[projectId] || []), comment] };
    setComments(updatedComments);
    localStorage.setItem('projectComments', JSON.stringify(updatedComments));
    setNewComment('');
    setActiveProject(null);
  };

  const handleAddRating = (projectId) => {
    if (currentRating === 0) return;
    const rating = { id: uuidv4(), value: currentRating, user: userIdentity, timestamp: new Date().toISOString() };
    const updatedRatings = { ...ratings, [projectId]: [...(ratings[projectId] || []), rating] };
    setRatings(updatedRatings);
    localStorage.setItem('projectRatings', JSON.stringify(updatedRatings));
    setCurrentRating(0);
  };

  const calculateAverageRating = (projectId) => {
    const projectRatings = ratings[projectId] || [];
    if (!projectRatings.length) return 0;
    return (projectRatings.reduce((acc, r) => acc + r.value, 0) / projectRatings.length).toFixed(1);
  };

  // Merge DB + GitHub projects (objects) safely
  const allProjects = [...(projects || []), ...(synced || [])].map((proj, index) => ({
    ...proj,
    id: proj.id || `merged-${index}`
  }));

  return (
    <motion.div className="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="container">
        <h2>My Projects</h2>

        {status === 'loading' && <p>📦 Loading projects...</p>}
        {status === 'failed' && <p style={{ color: 'red' }}>❌ Error: {error}</p>}
        {syncStatus === 'loading' && <p>🔄 Syncing GitHub projects...</p>}
        {syncStatus === 'failed' && <p style={{ color: 'red' }}>❌ Sync Error: {syncError}</p>}
        {allProjects.length === 0 && status === 'succeeded' && syncStatus === 'succeeded' && <p>No projects yet.</p>}

        <div className="projects-grid">
          {allProjects.map((project, index) => {
            const projectId = project.id;
            const avgRating = calculateAverageRating(projectId);
            const projectComments = comments[projectId] || [];

            return (
              <motion.div key={projectId} className="project-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02 }}>
                <div className="project-header">
                  <h3>{project.title}</h3>
                  {avgRating > 0 && <div className="rating-badge">⭐ {avgRating} ({projectComments.length})</div>}
                </div>
                <p>{project.description}</p>
                <div className="tech-stack"><strong>Tech Stack:</strong> {project.tech_stack}</div>
                <div className="project-links">
                  {project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer">GitHub</a>}
                  {project.demo_url && <a href={project.demo_url} target="_blank" rel="noopener noreferrer">Live Demo</a>}
                </div>

                <div className="rating-section">
                  <p>Rate this project:</p>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={`star ${star <= (hoverRating || currentRating) ? 'filled' : ''}`} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setCurrentRating(star)}>★</span>
                  ))}
                  <button onClick={() => handleAddRating(projectId)} disabled={currentRating === 0}>Submit Rating</button>
                </div>

                <div className="comments-section">
                  <div className="comments-header">
                    <h4>Comments ({projectComments.length})</h4>
                    <button onClick={() => setActiveProject(activeProject === projectId ? null : projectId)}>
                      {activeProject === projectId ? '▲ Hide' : '▼ Show'}
                    </button>
                  </div>

                  {activeProject === projectId && (
                    <div className="comments-container">
                      {projectComments.length > 0 ? projectComments.map(comment => (
                        <div key={comment.id} className="comment">
                          <div className="comment-header">
                            <span className="comment-user">{comment.user.replace('user-', 'User ')}</span>
                            <span className="comment-date">{new Date(comment.timestamp).toLocaleDateString()}</span>
                          </div>
                          <p className="comment-text">{comment.text}</p>
                        </div>
                      )) : <p>No comments yet.</p>}

                      <textarea placeholder="Add comment..." value={newComment} onChange={e => setNewComment(e.target.value)} />
                      <button onClick={() => handleAddComment(projectId)} disabled={!newComment.trim()}>Post Comment</button>
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
