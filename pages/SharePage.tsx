import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import projectService from '../services/projectService';
import type { Project } from '../types';

const SharePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      projectService.getProject(projectId)
        .then(data => {
          if (data) {
            setProject(data);
          } else {
            setError('Project not found or you do not have permission to view it.');
          }
        })
        .catch(() => {
          setError('An error occurred while fetching the project.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [projectId]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-600">Loading Project...</div>;
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-gray-600">
            <h2 className="text-2xl font-semibold mb-4">{error}</h2>
            <Link to="/" className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors">
                Back to Home
            </Link>
        </div>
    );
  }

  if (!project) {
    return null; 
  }

  const srcDoc = project.code ? `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${project.code.title}</title>
        ${project.code.externalCss.map(url => `<link rel="stylesheet" href="${url}">`).join('\n        ')}
        <style>${project.code.css}</style>
      </head>
      <body>
        ${project.code.html}
        ${project.code.externalJs.map(url => `<script src="${url}"></script>`).join('\n        ')}
        <script>${project.code.javascript}</script>
      </body>
    </html>
  ` : '';

  return (
    <div className="w-screen h-screen flex flex-col">
      <iframe
        srcDoc={srcDoc}
        title={project.name}
        sandbox="allow-scripts"
        className="w-full h-full border-0 flex-grow"
      />
      <footer className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-2 text-center text-sm text-gray-500">
        Built with <a href="/#" className="font-semibold text-accent hover:underline">Doveable AI</a>
      </footer>
    </div>
  );
};

export default SharePage;