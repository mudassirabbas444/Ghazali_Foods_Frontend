import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import announcementService from '../../services/announcement';

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementService.getAnnouncements({ isActive: true });
      if (response.success && response.announcements) {
        setAnnouncements(response.announcements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  if (!isVisible || announcements.length === 0) {
    return null;
  }

  // Combine all announcements into a single scrolling text
  const combinedText = announcements.map(a => a.text).join(' • ');

  return (
    <div className="relative bg-green-600 text-white py-2 overflow-hidden">
      <div className="flex items-center">
        {/* Marquee Container */}
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <div className="inline-block">
              {announcements.map((announcement, index) => (
                <React.Fragment key={announcement._id || index}>
                  {announcement.link ? (
                    <Link
                      to={announcement.link}
                      className="inline-block px-4 hover:underline"
                      style={{ color: announcement.textColor || '#ffffff' }}
                    >
                      {announcement.text}
                    </Link>
                  ) : (
                    <span
                      className="inline-block px-4"
                      style={{ color: announcement.textColor || '#ffffff' }}
                    >
                      {announcement.text}
                    </span>
                  )}
                  {index < announcements.length - 1 && (
                    <span className="inline-block px-4">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div className="inline-block">
              {announcements.map((announcement, index) => (
                <React.Fragment key={`duplicate-${announcement._id || index}`}>
                  {announcement.link ? (
                    <Link
                      to={announcement.link}
                      className="inline-block px-4 hover:underline"
                      style={{ color: announcement.textColor || '#ffffff' }}
                    >
                      {announcement.text}
                    </Link>
                  ) : (
                    <span
                      className="inline-block px-4"
                      style={{ color: announcement.textColor || '#ffffff' }}
                    >
                      {announcement.text}
                    </span>
                  )}
                  {index < announcements.length - 1 && (
                    <span className="inline-block px-4">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="px-4 py-1 hover:bg-green-700 transition-colors flex-shrink-0"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
    </div>
  );
};

export default AnnouncementBanner;

