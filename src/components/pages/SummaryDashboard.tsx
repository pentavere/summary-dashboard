// pages/SummaryDashboard.jsx
"use client";
import React, { useState, createRef } from 'react';
import { Card } from '@/components/ui/card';
import PatientHeader from '@/components/PatientHeader';
import SummarySection from '@/components/summary/SummarySection';
import ProcessedDocumentsTab from '@/components/documents/ProcessedDocumentsTab';
import SourceTab from '@/components/documents/SourceTab';

const SummaryDashboard = ({ documents, sections }) => {
  const [expandedSections, setExpandedSections] = useState({
    problems: true,
    allergies: true,
    medications: true,
    diagnosticResults: true,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('processed');
  const [relatedDocuments, setRelatedDocuments] = useState([]);
  const [activeReferenceIndex, setActiveReferenceIndex] = useState(0);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleItemClick = (item) => {
    if (selectedItem === item) {
      clearSelection();
    } else {
      setSelectedItem(item);
      const docIds = [...new Set(item.references.map(ref => ref.doc_id))];
      const related = documents.filter(doc => docIds.includes(doc.id));
      setRelatedDocuments(related);
      setActiveReferenceIndex(0);
    }
  };

  const handleDocumentClick = (docId) => {
    const startingRefIndex = selectedItem.references.findIndex(ref => ref.doc_id === docId);
    setActiveReferenceIndex(startingRefIndex);
    setActiveTab('source');
  };

  const handlePreviousReference = () => {
    setActiveReferenceIndex(prev => 
      prev > 0 ? prev - 1 : prev
    );
  };

  const handleNextReference = () => {
    setActiveReferenceIndex(prev => 
      prev < selectedItem.references.length - 1 ? prev + 1 : prev
    );
  };
  
  const clearSelection = () => {
    setSelectedItem(null);
    setRelatedDocuments([]);
    setActiveReferenceIndex(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-[1440px] mx-auto flex flex-col h-full">
          <PatientHeader />

          <div className="flex gap-6 flex-1">
            <div className="w-[640px]">
              <SummarySection
                sections={sections}
                expandedSections={expandedSections}
                selectedItem={selectedItem}
                onSectionToggle={toggleSection}
                onItemClick={handleItemClick}
              />
            </div>

            <div className="w-[900px]">
              <Card className="h-[calc(100vh-200px)] flex flex-col">
                <div className="border-b flex-shrink-0">
                  <div className="flex">
                    <button
                      className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                        activeTab === 'processed' 
                          ? 'border-green-800 text-green-800' 
                          : 'border-transparent text-gray-500'
                      }`}
                      onClick={() => setActiveTab('processed')}
                    >
                      PROCESSED DOCUMENTS
                    </button>
                    <button
                      className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                        activeTab === 'source' 
                          ? 'border-green-800 text-green-800' 
                          : 'border-transparent text-gray-500'
                      }`}
                      onClick={() => setActiveTab('source')}
                    >
                      SOURCE
                    </button>
                  </div>
                </div>
                
                {activeTab === 'processed' ? (
                  <ProcessedDocumentsTab
                    documents={documents}
                    selectedItem={selectedItem}
                    relatedDocuments={relatedDocuments}
                    onDocumentClick={handleDocumentClick}
                    onClearSelection={clearSelection}
                  />
                ) : (
                  <SourceTab
                    selectedItem={selectedItem}
                    activeReferenceIndex={activeReferenceIndex}
                    onClearSelection={clearSelection}
                    onPreviousReference={handlePreviousReference}
                    onNextReference={handleNextReference}
                    documents={documents}
                  />
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;