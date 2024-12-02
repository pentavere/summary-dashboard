"use client";
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PatientHeader from '@/components/PatientHeader';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TimeRangeButton = ({ label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
      isActive 
        ? 'bg-green-100 text-green-800' 
        : 'bg-white text-gray-500 hover:bg-gray-50'
    }`}
  >
    {label} • {count} notes
  </button>
);

const ModifyDocuments = ({ documents }) => {
  const router = useRouter();
  const [selectedRange, setSelectedRange] = useState(0); // index of selected time range
  const [selectedSections, setSelectedSections] = useState([
    'Problems',
    'Allergies',
    'Medications',
    'Diagnostic Results'
  ]);
  const [selectedDocuments, setSelectedDocuments] = useState(
    new Set(documents?.map(doc => doc.id) || [])
  );

  const timeRanges = [
    { label: 'Today', count: 3, days: 0 },
    { label: '1 day', count: 7, days: 1 },
    { label: '6 days', count: 12, days: 6 },
    { label: '8 days', count: 15, days: 8 },
    { label: '15 days', count: 19, days: 15 }
  ];

  const sections = [
    'Subject & Demographics',
    'Problems',
    'Allergies',
    'Immunisations',
    'Medications',
    'Diagnostic Results',
    'Family History',
    'Author Of Transaction'
  ];

  const handleRangeSelect = (index) => {
    setSelectedRange(index);
  };

  const handleSectionClick = (section) => {
    setSelectedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.size === documents?.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(documents?.map(doc => doc.id) || []));
    }
  };

  const handleDocumentToggle = (docId) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(docId)) {
        newSet.delete(docId);
      } else {
        newSet.add(docId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-[1440px] mx-auto flex flex-col h-full">
          <PatientHeader />

          <div className="mt-6 space-y-6">
            {/* Time Range and Sections Card */}
            <Card className="p-6">
              <div className="space-y-6">
                {/* Time Range Selector */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Reports:</h3>
                  <div className="relative">
                    {/* Time Range Step Buttons */}
                    <div className="flex items-center justify-between mb-2">
                      {timeRanges.map((range, index) => (
                        <TimeRangeButton
                          key={range.label}
                          label={range.label}
                          count={range.count}
                          isActive={selectedRange === index}
                          onClick={() => handleRangeSelect(index)}
                        />
                      ))}
                    </div>
                    
                    {/* Custom Progress Bar */}
                    <div className="h-1 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-green-700 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(selectedRange / (timeRanges.length - 1)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Summary Sections */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Summary sections:</h3>
                  <div className="flex flex-wrap gap-2">
                    {sections.map(section => (
                      <button
                        key={section}
                        onClick={() => handleSectionClick(section)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedSections.includes(section)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {section}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Documents List Card */}
            <Card className="p-6">
              <div className="space-y-4">
                
                <div className="space-y-2">
                  <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-2 text-sm text-gray-500 font-medium">
                    <button
                      onClick={handleSelectAll}
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        selectedDocuments.size === documents?.length
                          ? 'bg-green-700 border-green-700'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedDocuments.size === documents?.length && (
                        <Check className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                    <div>TITLE</div>
                    <div>CATEGORY</div>
                    <div>AUTHOR</div>
                    <div>DATE & TIME</div>
                    <div>PERFORMER</div>
                  </div>

                  {documents?.map(doc => (
                    <div
                      key={doc.id}
                      className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 bg-white rounded-lg hover:bg-gray-50 transition-colors items-center"
                    >
                      <button
                        onClick={() => handleDocumentToggle(doc.id)}
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          selectedDocuments.has(doc.id)
                            ? 'bg-green-700 border-green-700'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedDocuments.has(doc.id) && (
                          <Check className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                      <div className="text-sm text-gray-900 truncate">{doc.title}</div>
                      <div className="text-sm text-gray-600">{doc.category}</div>
                      <div className="text-sm text-gray-600">{doc.author}</div>
                      <div className="text-sm text-gray-600">{doc.datetime}</div>
                      <div className="text-sm text-gray-600">{doc.performer}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Process Button */}
            <div className="flex justify-end">
              <button 
                onClick={() => router.push('/distillery')}
                className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors"
              >
                Process {selectedDocuments.size} Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyDocuments;