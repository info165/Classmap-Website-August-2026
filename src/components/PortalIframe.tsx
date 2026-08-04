import React from 'react';

interface PortalIframeProps {
  portal: 'teachers' | 'students' | 'admin';
  onGoHome: () => void;
}

const PORTAL_CONFIG = {
  teachers: {
    title: 'Teacher Portal',
    url: 'https://teachers-classmap.web.app/',
  },
  students: {
    title: 'Student Portal',
    url: 'https://classmap-students.web.app/',
  },
  admin: {
    title: 'School Admin Portal',
    url: 'https://school-administration-dashboard-v32-837268080273.us-west1.run.app',
  },
};

export const PortalIframe: React.FC<PortalIframeProps> = ({ portal, onGoHome }) => {
  const config = PORTAL_CONFIG[portal];

  return (
    <div className="fixed inset-0 z-50 bg-white h-screen w-screen overflow-hidden">
      {/* Seamless Full-Screen Embedded Application Frame */}
      <iframe
        src={config.url}
        title={`ClassMap ${config.title}`}
        className="w-full h-full border-0 block"
        allow="camera; microphone; geolocation; fullscreen; clipboard-read; clipboard-write; autoplay"
        sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation"
      />
    </div>
  );
};
