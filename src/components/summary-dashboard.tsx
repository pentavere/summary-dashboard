"use client";
import React, { useState } from 'react';
import { ChevronDown, ThumbsUp, ThumbsDown, Menu, X } from 'lucide-react';
import PatientHeader from './patient-header';

const Card = ({ className, children }) => (
  <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className, children }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ className, children }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Button = ({ variant = 'default', className, children, ...props }) => (
  <button 
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
      ${variant === 'outline' ? 'border border-current' : 'bg-primary text-white'}
      ${className}`}
    {...props}
  >
    {children}
  </button>
);

const NotificationPopup = ({ message, onClose, variant = 'default', onPrevious, onNext, showNavigation }) => {
  if (variant === 'source') {
    return (
      <div className="flex items-center justify-between gap-4 px-4 py-2 bg-green-50 text-green-800 text-sm font-medium rounded-lg shadow-sm border border-green-200 animate-fadeIn">
        <Button
          variant="outline"
          className="text-green-800 border-green-800 hover:bg-green-100"
          onClick={onPrevious}
          disabled={!showNavigation}
        >
          Previous
        </Button>
        <span>{message}</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-green-800 border-green-800 hover:bg-green-100"
            onClick={onNext}
            disabled={!showNavigation}
          >
            Next
          </Button>
          <button
            onClick={onClose}
            className="text-green-800 hover:text-green-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-800 text-sm font-medium rounded-lg shadow-sm border border-green-200 animate-fadeIn w-fit">
      {message}
      <button
        onClick={onClose}
        className="text-green-800 hover:text-green-900 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const SummaryDashboard = ({documents, sections}) => {
  const [expandedSections, setExpandedSections] = useState({
    problems: true,
    allergies: true,
    medications: true,
    diagnosticResults: true,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('processed');
  const [relatedDocuments, setRelatedDocuments] = useState([]);
  const [activeDocumentIndex, setActiveDocumentIndex] = useState(0);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleItemClick = (item) => {
    if (selectedItem === item) {
      setSelectedItem(null);
      setRelatedDocuments([]);
      setActiveDocumentIndex(0);
    } else {
      setSelectedItem(item);
      const related = documents.filter(doc => 
        item.doc_ids && item.doc_ids.includes(doc.id)
      );
      setRelatedDocuments(related);
      setActiveDocumentIndex(0);
    }
  };

  const handleDocumentClick = (docIndex) => {
    setActiveTab('source');
    setActiveDocumentIndex(docIndex);
  };

  const clearSelection = () => {
    setSelectedItem(null);
    setRelatedDocuments([]);
    setActiveDocumentIndex(0);
  };

  const handlePreviousDocument = () => {
    setActiveDocumentIndex(prev => 
      prev > 0 ? prev - 1 : prev
    );
  };

  const handleNextDocument = () => {
    setActiveDocumentIndex(prev => 
      prev < relatedDocuments.length - 1 ? prev + 1 : prev
    );
  };

  const renderSectionContent = (sections) => {
    if (!sections || sections.length === 0) {
      return <p className="text-sm text-gray-500 py-2">No relevant information</p>;
    }

    return (
      <ul className="bg-gray-50 rounded-lg">
        {sections.map((item, index) => (
          <li 
            key={index}
            onClick={() => handleItemClick(item)}
            className={`
              cursor-pointer 
              text-sm 
              p-2
              rounded-lg
              transition-all
              mb-2
              last:mb-0
              ${selectedItem === item 
                ? 'bg-green-50 font-medium' 
                : 'hover:bg-gray-100'}
            `}
            role="button"
            tabIndex={0}
          >
            <span className="flex items-center">
              • {item.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-[1440px] mx-auto flex flex-col h-full">
          <PatientHeader />

          {/* Main Content */}
          <div className="flex gap-6 flex-1">
            {/* Summary Panel */}
            <div className="w-[640px]">
              <Card className="h-[calc(100vh-200px)]">
                <CardHeader className="flex-shrink-0 pb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-medium uppercase">
                      Summary
                    </h2>
                    <div className="flex gap-2 ml-auto">
                      <ThumbsUp className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-800" />
                      <ThumbsDown className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-800" />
                      <Menu className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-800" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="overflow-auto h-[calc(100%-60px)]">
                  {sections.map((section) => (
                    <div key={section.key} className="mb-4">
                      <button
                        onClick={() => toggleSection(section.key)}
                        className={`
                          flex items-center justify-between w-full p-2 
                          bg-gray-50 hover:bg-gray-100 transition-colors 
                          rounded-lg
                          ${expandedSections[section.key] ? 'rounded-b-none' : ''}
                        `}
                      >
                        <span className="font-medium">{section.name}</span>
                        <ChevronDown 
                          className={`w-5 h-5 transform transition-transform ${
                            expandedSections[section.key] ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {expandedSections[section.key] && (
                        <div className="p-2 bg-gray-50 rounded-b-lg">
                          {renderSectionContent(section.items)}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Documents Panel */}
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
                
                <div className="flex-grow flex flex-col min-h-0">
                  {activeTab === 'processed' ? (
                    <div className="flex flex-col h-full">
                      <div className="flex-grow overflow-auto p-4">
                        <table className="w-full">
                          <thead className="sticky top-0 bg-white">
                            <tr className="text-left text-sm text-gray-500">
                              <th className="pb-2 font-medium">TITLE</th>
                              <th className="pb-2 font-medium">CATEGORY</th>
                              <th className="pb-2 font-medium">AUTHOR</th>
                              <th className="pb-2 font-medium">DATE & TIME</th>
                              <th className="pb-2 font-medium">PERFORMER</th>
                            </tr>
                          </thead>
                          <tbody>
                            {documents.map((doc, index) => (
                              <tr 
                                key={index}
                                onClick={() => {
                                  if (selectedItem && selectedItem.doc_ids?.includes(doc.id)) {
                                    const docIndex = relatedDocuments.findIndex(relDoc => relDoc.id === doc.id);
                                    handleDocumentClick(docIndex);
                                  }
                                }}
                                className={`
                                  border-t 
                                  transition-colors
                                  ${selectedItem && selectedItem.doc_ids?.includes(doc.id)
                                    ? 'bg-green-50 hover:bg-green-100 cursor-pointer'
                                    : selectedItem 
                                      ? 'opacity-50' 
                                      : 'hover:bg-gray-50'
                                  }
                                `}
                              >
                                <td className="py-3 text-sm">{doc.title}</td>
                                <td className="py-3 text-sm">{doc.category}</td>
                                <td className="py-3 text-sm">{doc.author}</td>
                                <td className="py-3 text-sm">{doc.date}</td>
                                <td className="py-3 text-sm">{doc.performer}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="flex justify-end mt-4">
                          <Button 
                            variant="outline" 
                            className="text-green-800 border-green-800 hover:bg-green-50"
                          >
                            Modify Documents
                          </Button>
                        </div>
                      </div>

                      <div className="flex-shrink-0 p-4 border-t bg-white">
                        <div className="flex justify-center">
                          {selectedItem && relatedDocuments.length > 0 && (
                            <NotificationPopup
                              message={`Showing ${relatedDocuments.length} document${relatedDocuments.length !== 1 ? 's' : ''} related to: ${selectedItem.value}`}
                              onClose={clearSelection}
                              variant="doclist"
                              onPrevious={handlePreviousDocument}
                              onNext={handleNextDocument}
                              showNavigation={relatedDocuments.length > 1}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col flex-grow min-h-0">
                      <div className="flex-grow overflow-auto p-4">
                        <p className="text-gray-500">Source documents will be displayed here</p>
                      </div>
                      <div className="flex-shrink-0 p-4 border-t bg-white">
                        {selectedItem && relatedDocuments.length > 0 && (
                          <NotificationPopup
                            message={`Document ${activeDocumentIndex + 1} of ${relatedDocuments.length}`}
                            onClose={clearSelection}
                            variant="source"
                            onPrevious={handlePreviousDocument}
                            onNext={handleNextDocument}
                            showNavigation={relatedDocuments.length > 1}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;