import React from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../hooks/useProject';

export default function ProjectName({ className = 'hover:text-primary' }) {
  const { projectName, projectId, project } = useProject();

  const to = projectId ? `/summary?projectId=${projectId}` : '/summary';

  return (
    <Link to={to} state={{ project }} className={className}>
      {projectName}
    </Link>
  );
}
