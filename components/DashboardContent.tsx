'use client';

import { useState } from 'react';

export default function DashboardContent({ 
  profileForm, 
  experienceSection, 
  educationSection,
  skillsSection 
}: { 
  profileForm: React.ReactNode, 
  experienceSection: React.ReactNode, 
  educationSection: React.ReactNode,
  skillsSection: React.ReactNode
}) {
  const [activeTab, setActiveTab] = useState('pribadi');

  const tabs = [
    { id: 'pribadi', label: 'Personal Information' },
    { id: 'pengalaman', label: 'Work Experience' },
    { id: 'pendidikan', label: 'Education' },
    { id: 'skill', label: 'Skill' },
  ];

  return (
    <div className="space-y-6">
      {/* NAVIGATION TABS */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-6 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="mt-4">
        {activeTab === 'pribadi' && profileForm}
        {activeTab === 'pengalaman' && experienceSection}
        {activeTab === 'pendidikan' && educationSection}
        {activeTab === 'skill' && skillsSection}
      </div>
    </div>
  );
}