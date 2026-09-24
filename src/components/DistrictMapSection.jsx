import React, { useState } from 'react';
import { MapPin, ChevronRight, BarChart3, Filter, Check } from 'lucide-react';
import { DISTRICTS_DATA, ALL_TN_DISTRICTS } from '../data/mockData';

export default function DistrictMapSection({ selectedDistrict, setSelectedDistrict }) {
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  // Map district coordinates for visual map representation
  const MAP_NODES = [
    { name: 'Chennai', x: 260, y: 70, color: '#1e3a8a', count: 2834 },
    { name: 'Kanchipuram', x: 230, y: 85, color: '#1e40af', count: 820 },
    { name: 'Vellore', x: 190, y: 75, color: '#2563eb', count: 760 },
    { name: 'Tiruvannamalai', x: 185, y: 115, color: '#3b82f6', count: 620 },
    { name: 'Cuddalore', x: 225, y: 145, color: '#3b82f6', count: 590 },
    { name: 'Salem', x: 145, y: 135, color: '#2563eb', count: 1110 },
    { name: 'Erode', x: 115, y: 135, color: '#3b82f6', count: 710 },
    { name: 'Nilgiris', x: 65, y: 130, color: '#60a5fa', count: 480 },
    { name: 'Coimbatore', x: 80, y: 170, color: '#1d4ed8', count: 2156 },
    { name: 'Tiruppur', x: 110, y: 175, color: '#3b82f6', count: 580 },
    { name: 'Tiruchirappalli', x: 170, y: 185, color: '#1d4ed8', count: 1420 },
    { name: 'Thanjavur', x: 215, y: 200, color: '#2563eb', count: 890 },
    { name: 'Dindigul', x: 130, y: 220, color: '#3b82f6', count: 650 },
    { name: 'Madurai', x: 145, y: 255, color: '#1e40af', count: 1840 },
    { name: 'Sivagangai', x: 190, y: 265, color: '#60a5fa', count: 510 },
    { name: 'Ramanathapuram', x: 220, y: 300, color: '#93c5fd', count: 460 },
    { name: 'Theni', x: 95, y: 260, color: '#60a5fa', count: 420 },
    { name: 'Virudhunagar', x: 125, y: 295, color: '#3b82f6', count: 640 },
    { name: 'Tirunelveli', x: 110, y: 345, color: '#2563eb', count: 980 },
    { name: 'Thoothukudi', x: 155, y: 350, color: '#3b82f6', count: 680 },
    { name: 'Kanyakumari', x: 95, y: 390, color: '#1d4ed8', count: 630 },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            NGOs Across Tamil Nadu
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            District-wise NGO distribution and social service density across Tamil Nadu
          </p>
        </div>

        {/* District Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200">
          <Filter className="w-4 h-4 text-slate-500 ml-2" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-3 py-1"
          >
            <option value="All Districts">All 38 Districts</option>
            {ALL_TN_DISTRICTS.map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Visual Map Left, Leaderboard Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Colorful Interactive Tamil Nadu Map Visual */}
        <div className="lg:col-span-6 bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 p-5 rounded-2xl text-white relative overflow-hidden flex flex-col items-center justify-center min-h-[340px]">
          
          {/* Map Header Tag */}
          <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-bold text-blue-200 tracking-wide uppercase">
              Interactive TN Choropleth Map
            </span>
          </div>

          {/* Choropleth Legend */}
          <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-[10px] font-medium text-slate-300 z-10 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <span>Low</span>
            <span className="w-3 h-2 rounded bg-blue-300" />
            <span className="w-3 h-2 rounded bg-blue-500" />
            <span className="w-3 h-2 rounded bg-blue-700" />
            <span className="w-3 h-2 rounded bg-blue-950" />
            <span>High Density</span>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full max-w-[320px] aspect-[4/5] my-2">
            <svg className="w-full h-full drop-shadow-xl" viewBox="0 0 320 420" fill="none">
              
              {/* Outer Tamil Nadu Coastline Contour Silhouette */}
              <path 
                d="M 180 50 L 290 65 L 280 120 L 250 170 L 230 220 L 260 290 L 210 330 L 170 380 L 110 410 L 80 390 L 70 330 L 50 250 L 55 150 L 120 110 Z" 
                fill="#1e293b" 
                stroke="#334155" 
                strokeWidth="2" 
                strokeDasharray="4 4"
              />

              {/* Connecting District Mesh Lines */}
              <path 
                d="M 260 70 L 230 85 L 190 75 L 145 135 L 80 170 L 170 185 L 145 255 L 110 345 L 95 390" 
                stroke="#3b82f6" 
                strokeWidth="1" 
                opacity="0.2" 
              />
              <path 
                d="M 190 75 L 185 115 L 225 145 L 215 200 L 190 265 L 155 350" 
                stroke="#3b82f6" 
                strokeWidth="1" 
                opacity="0.2" 
              />

              {/* District Node Circles & Visual Heat Markers */}
              {MAP_NODES.map((node) => {
                const isSelected = selectedDistrict === node.name;
                const isHovered = hoveredDistrict === node.name;

                return (
                  <g 
                    key={node.name}
                    className="cursor-pointer group"
                    onClick={() => setSelectedDistrict(node.name)}
                    onMouseEnter={() => setHoveredDistrict(node.name)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                  >
                    {/* Pulsing ring for selected/hovered district */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? "16" : "12"}
                        fill={node.color}
                        opacity="0.4"
                        className="animate-ping"
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? "9" : isHovered ? "8" : "6"}
                      fill={isSelected ? "#f59e0b" : node.color}
                      stroke={isSelected ? "#ffffff" : "#93c5fd"}
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                      className="transition-all duration-200 group-hover:scale-125"
                    />

                    {/* District Label Text */}
                    <text
                      x={node.x + 10}
                      y={node.y + 4}
                      fill={isSelected ? "#f59e0b" : "#e2e8f0"}
                      fontSize={isSelected ? "11" : "9"}
                      fontWeight={isSelected ? "bold" : "600"}
                      className="pointer-events-none select-none drop-shadow"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Box */}
            {hoveredDistrict && (
              <div className="absolute top-2 right-2 bg-white text-slate-900 px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 text-xs font-bold animate-in fade-in duration-150 z-20">
                <span>{hoveredDistrict}</span>
                <span className="text-blue-600 block text-[11px] font-semibold">
                  {MAP_NODES.find(n => n.name === hoveredDistrict)?.count || 500}+ NGOs
                </span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Click on any district node to filter NGOs and local drives
          </p>
        </div>

        {/* Right Column: Ranked Leaderboard List of Top Districts */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Top Districts by Registered NGOs
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">Updated Sep 2026</span>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
            {DISTRICTS_DATA.map((item) => {
              const isSelected = selectedDistrict === item.name;

              return (
                <div
                  key={item.name}
                  onClick={() => setSelectedDistrict(item.name)}
                  className={`
                    p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-3
                    ${isSelected 
                      ? 'bg-blue-50 border-blue-400 shadow-sm ring-1 ring-blue-500/20' 
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                    }
                  `}
                >
                  {/* Rank badge */}
                  <div className={`
                    w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0
                    ${item.rank <= 3 ? 'bg-amber-100 text-amber-800 font-extrabold' : 'bg-slate-200 text-slate-700'}
                  `}>
                    #{item.rank}
                  </div>

                  {/* Name and Progress Bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-slate-800 truncate">{item.name}</span>
                      <span className="text-blue-700 font-extrabold">{item.count.toLocaleString()} NGOs</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500" 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-right">
            <button 
              onClick={() => setSelectedDistrict('All Districts')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition"
            >
              <span>View All 38 Districts</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
