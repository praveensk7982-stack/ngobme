import React from 'react';
import { 
  Stethoscope, 
  GraduationCap, 
  UtensilsCrossed, 
  Trees, 
  Droplet, 
  HeartPulse, 
  UserCheck, 
  Accessibility,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

const CATEGORY_ICONS = {
  Stethoscope,
  GraduationCap,
  UtensilsCrossed,
  Trees,
  Droplet,
  HeartPulse,
  UserCheck,
  Accessibility
};

export default function CategoryGrid({ selectedCategory, setSelectedCategory, onCategoryClick }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
      
      {/* Header with Title & View All link */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Explore by Category
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Find NGOs and volunteer drives by cause</p>
        </div>

        <button 
          onClick={() => setSelectedCategory(null)}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition group"
        >
          <span>View All (24)</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 2x4 Grid of Colored Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        {CATEGORIES.map((cat) => {
          const IconComponent = CATEGORY_ICONS[cat.icon] || Stethoscope;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                const newCat = isSelected ? null : cat.id;
                setSelectedCategory(newCat);
                if (onCategoryClick) onCategoryClick(cat);
              }}
              className={`
                p-4 rounded-2xl border text-left transition-all duration-200 group
                flex items-center gap-3.5 cursor-pointer relative overflow-hidden
                ${cat.bgLight}
                ${isSelected ? 'ring-2 ring-blue-600 shadow-md scale-[1.02]' : 'hover:shadow-md hover:-translate-y-0.5'}
              `}
            >
              {/* Category Icon */}
              <div className={`p-3 rounded-xl ${cat.iconBg} shadow-sm shrink-0 transition-transform group-hover:scale-110`}>
                <IconComponent className="w-5 h-5" />
              </div>

              {/* Title & Count */}
              <div>
                <h3 className="text-xs font-bold leading-tight group-hover:text-slate-900 transition">
                  {cat.name}
                </h3>
                <p className="text-[11px] font-semibold opacity-75 mt-0.5">
                  {cat.count}
                </p>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
}
