import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useProjectContext } from '../context/ProjectProvider';

/**
 * Combined hook that exposes the ProjectContext helpers and also
 * lazily fetches the full `project` object when an ID is available.
 * This prevents duplicate declarations while keeping existing callers working.
 */
export function useProject() {
  const ctx = useProjectContext();
  if (!ctx) throw new Error('useProject must be used within a ProjectProvider');

  const location = useLocation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  // derive a candidate projectId from context or from routing/state
  const params = new URLSearchParams(location.search);
  const initialProject = location.state?.project;
  const stateProjectId = location.state?.projectId;
  const pathMatch = location.pathname && location.pathname.match(/\/project\/([^\/\?]+)/i);
  const pathProjectId = pathMatch && pathMatch[1];
  const candidateId = initialProject?._id || initialProject?.id || stateProjectId || params.get('projectId') || pathProjectId || ctx.activeProjectId;

  // If a project was passed via location.state, ensure the global context is updated
  useEffect(() => {
    if (initialProject) {
      const id = initialProject._id || initialProject.id;
      if (id && id !== ctx.activeProjectId) {
        ctx.setActiveProject(id, initialProject.name || initialProject.title || ctx.activeProjectName);
      }
      setProject(initialProject);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProject]);

  // Fetch project details when we have an ID and no project object yet
  useEffect(() => {
    const projectId = candidateId;
    if (!projectId) return;
    if (project && (project._id === projectId || project.id === projectId)) return;
    if (!token) return;

    let mounted = true;
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`http://localhost:5000/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        setProject(res.data);
      } catch (err) {
        if (!mounted) return;
        console.error('Failed to fetch project', err?.response?.data || err.message || err);
        setError(err?.response?.data?.message || err.message || 'Failed to fetch project');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProject();

    return () => {
      mounted = false;
    };
    // candidateId includes ctx.activeProjectId indirectly; re-run when it changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateId, token]);

  const projectName = ctx.activeProjectName || project?.name || project?.title || 'Project';
  const projectInitial = projectName ? projectName.charAt(0).toUpperCase() : 'P';

  return {
    project,
    projectName,
    projectInitial,
    projectId: ctx.activeProjectId || (project && (project._id || project.id)) || null,
    loading,
    error,
    setActiveProject: ctx.setActiveProject,
    clearActiveProject: ctx.clearActiveProject,
  };
}
