import React, { useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import StatCards from '../components/StatCards';
import CategoryGrid from '../components/CategoryGrid';
import DistrictMapSection from '../components/DistrictMapSection';
import FeaturedNGOs from '../components/FeaturedNGOs';
import FindHelpBanner from '../components/FindHelpBanner';
import RightSidebar from '../components/RightSidebar';

export default function Home({
  selectedDistrict,
  setSelectedDistrict,
  onSelectNGO,
  onOpenVolunteerModal,
  onOpenDonateModal,
  onOpenRegisterNGOModal,
  onOpenPostEventModal
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleDistrictSearchSubmit = () => {
    const el = document.getElementById('district-map-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Main Column */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Hero Banner */}
        <HeroBanner 
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          onSearchSubmit={handleDistrictSearchSubmit}
        />

        {/* 4 Stat Cards Row */}
        <StatCards />

        {/* Category Grid */}
        <CategoryGrid 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* District Map & Leaderboard Section */}
        <div id="district-map-section">
          <DistrictMapSection 
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
          />
        </div>

        {/* Featured NGOs Section */}
        <FeaturedNGOs 
          onSelectNGO={onSelectNGO}
          selectedDistrict={selectedDistrict}
        />

        {/* Find Help Near You Bottom Banner */}
        <FindHelpBanner 
          onSearchHelp={() => {
            const el = document.getElementById('district-map-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

      </div>

      {/* Right Sidebar Column */}
      <div className="lg:col-span-4">
        <RightSidebar 
          onOpenVolunteerModal={onOpenVolunteerModal}
          onOpenDonateModal={onOpenDonateModal}
          onOpenRegisterNGOModal={onOpenRegisterNGOModal}
          onOpenPostEventModal={onOpenPostEventModal}
          onSelectEvent={() => onOpenVolunteerModal()}
        />
      </div>

    </div>
  );
}
