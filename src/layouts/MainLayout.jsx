import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { 
  NGOProfileModal, 
  VolunteerModal, 
  DonateModal, 
  RegisterNGOModal, 
  PostEventModal 
} from '../components/Modals';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';

export default function MainLayout({
  selectedDistrict,
  setSelectedDistrict,
  searchQuery,
  setSearchQuery,
  selectedNGOModal,
  setSelectedNGOModal,
  showVolunteerModal,
  setShowVolunteerModal,
  showDonateModal,
  setShowDonateModal,
  showRegisterNGOModal,
  setShowRegisterNGOModal,
  showPostEventModal,
  setShowPostEventModal
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState(INITIAL_NOTIFICATIONS);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(3);

  const handleClearNotifications = () => {
    setUnreadNotificationsCount(0);
    setNotificationsList(notificationsList.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
      
      {/* 1. Left Fixed Sidebar */}
      <Sidebar 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:pl-[240px] min-w-0 transition-all duration-300">
        
        {/* 2. Sticky Top Bar */}
        <TopBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setMobileOpen={setMobileOpen}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenDonateModal={() => setShowDonateModal(true)}
          onOpenVolunteerModal={() => setShowVolunteerModal(true)}
          onClearNotifications={handleClearNotifications}
        />

        {/* 3. Dashboard Outlet Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet context={{
            selectedDistrict,
            setSelectedDistrict,
            onSelectNGO: (ngo) => setSelectedNGOModal(ngo),
            onOpenVolunteerModal: () => setShowVolunteerModal(true),
            onOpenDonateModal: () => setShowDonateModal(true),
            onOpenRegisterNGOModal: () => setShowRegisterNGOModal(true),
            onOpenPostEventModal: () => setShowPostEventModal(true),
            notificationsList,
            unreadNotificationsCount,
            onClearNotifications: handleClearNotifications
          }} />
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200/80 bg-white py-4 px-6 text-center text-xs text-slate-500 font-medium">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 Tamil Nadu NGO Connect • Government of Tamil Nadu Social Welfare Partner</p>
            <p className="text-[11px] text-slate-400 font-semibold">
              Stronger Communities • Healthier Tamil Nadu
            </p>
          </div>
        </footer>

      </div>

      {/* Interactive Modal Overlays */}
      {selectedNGOModal && (
        <NGOProfileModal 
          ngo={selectedNGOModal}
          onClose={() => setSelectedNGOModal(null)}
          onOpenDonateModal={() => setShowDonateModal(true)}
        />
      )}

      {showVolunteerModal && (
        <VolunteerModal onClose={() => setShowVolunteerModal(false)} />
      )}

      {showDonateModal && (
        <DonateModal onClose={() => setShowDonateModal(false)} />
      )}

      {showRegisterNGOModal && (
        <RegisterNGOModal onClose={() => setShowRegisterNGOModal(false)} />
      )}

      {showPostEventModal && (
        <PostEventModal onClose={() => setShowPostEventModal(false)} />
      )}

    </div>
  );
}
