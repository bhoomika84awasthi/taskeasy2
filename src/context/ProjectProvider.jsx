import React, { createContext, useContext, useEffect, useState } from 'react';
import projectContext from '../services/projectContext';
import { useNavigate, useLocation } from 'react-router-dom';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [activeProjectId, setActiveProjectIdState] = useState(projectContext.getActiveProjectId());
  const [activeProjectName, setActiveProjectNameState] = useState(projectContext.getActiveProjectName());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // sync to localStorage
    if (activeProjectId) projectContext.setActiveProjectId(activeProjectId);
    else projectContext.clearActiveProject();
    projectContext.setActiveProjectName(activeProjectName);
  }, [activeProjectId, activeProjectName]);

  useEffect(() => {
    // on mount: if no active project, redirect to selection unless on auth/start pages
    const id = projectContext.getActiveProjectId();
    if (!id) {
      const path = location.pathname || '';
      if (!path.startsWith('/login') && !path.startsWith('/signup') && !path.startsWith('/start')) {
        navigate('/start');
      }
    } else {
      setActiveProjectIdState(id);
      const name = projectContext.getActiveProjectName();
      setActiveProjectNameState(name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setActiveProject = (id, name) => {
    setActiveProjectIdState(id);
    setActiveProjectNameState(name || null);
    projectContext.setActiveProjectId(id);
    projectContext.setActiveProjectName(name || null);
  };

  const clearActiveProject = () => {
    setActiveProjectIdState(null);
    setActiveProjectNameState(null);
    projectContext.clearActiveProject();
  };

  return (
    <ProjectContext.Provider value={{ activeProjectId, activeProjectName, setActiveProject, clearActiveProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  return useContext(ProjectContext);
}

export default ProjectContext;
