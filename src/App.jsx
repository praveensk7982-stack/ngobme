import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Main Layout
import MainLayout from './layouts/MainLayout';

// Main Pages
import Home from './pages/Home';
import NGODirectory from './pages/NGODirectory';
import CampsEvents from './pages/CampsEvents';
import Volunteer from './pages/Volunteer';
import Donate from './pages/Donate';
import FindHelp from './pages/FindHelp';
import MyActivity from './pages/MyActivity';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import SearchResults from './pages/SearchResults';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Dialog states
  const [selectedNGOModal, setSelectedNGOModal] = useState(null);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showRegisterNGOModal, setShowRegisterNGOModal] = useState(false);
  const [showPostEventModal, setShowPostEventModal] = useState(false);

  return (
    <Routes>
      <Route 
        element={
          <MainLayout 
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedNGOModal={selectedNGOModal}
            setSelectedNGOModal={setSelectedNGOModal}
            showVolunteerModal={showVolunteerModal}
            setShowVolunteerModal={setShowVolunteerModal}
            showDonateModal={showDonateModal}
            setShowDonateModal={setShowDonateModal}
            showRegisterNGOModal={showRegisterNGOModal}
            setShowRegisterNGOModal={setShowRegisterNGOModal}
            showPostEventModal={showPostEventModal}
            setShowPostEventModal={setShowPostEventModal}
          />
        }
      >
        <Route 
          path="/" 
          element={
            <Home 
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              onSelectNGO={(ngo) => setSelectedNGOModal(ngo)}
              onOpenVolunteerModal={() => setShowVolunteerModal(true)}
              onOpenDonateModal={() => setShowDonateModal(true)}
              onOpenRegisterNGOModal={() => setShowRegisterNGOModal(true)}
              onOpenPostEventModal={() => setShowPostEventModal(true)}
            />
          } 
        />

        <Route 
          path="/ngo-directory" 
          element={
            <NGODirectory 
              onSelectNGO={(ngo) => setSelectedNGOModal(ngo)}
            />
          } 
        />

        <Route 
          path="/camps-events" 
          element={
            <CampsEvents 
              onOpenPostEventModal={() => setShowPostEventModal(true)}
              onOpenVolunteerModal={() => setShowVolunteerModal(true)}
            />
          } 
        />

        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/find-help" element={<FindHelp />} />
        <Route path="/my-activity" element={<MyActivity />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />

        <Route 
          path="/search" 
          element={
            <SearchResults 
              onSelectNGO={(ngo) => setSelectedNGOModal(ngo)}
            />
          } 
        />

        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Catch-all Fallback -> Redirect to Home Dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
