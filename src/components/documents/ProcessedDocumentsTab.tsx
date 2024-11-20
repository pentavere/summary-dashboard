// components/documents/ProcessedDocumentsTab.jsx
import { Button } from '@/components/ui/button';
import ProcessedNotification from '@/components/notifications/ProcessedNotification';

const ProcessedDocumentsTab = ({
  documents,
  selectedItem,
  relatedDocuments,
  onDocumentClick,
  onClearSelection
}) => {
  return (
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
            {documents.map((doc, index) => {
              const isRelated = selectedItem?.references.some(ref => ref.doc_id === doc.id);
              return (
                <tr 
                  key={index}
                  onClick={() => {
                    if (isRelated) {
                      onDocumentClick(doc.id);
                    }
                  }}
                  className={`
                    border-t 
                    transition-colors
                    ${isRelated
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
              );
            })}
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
            <ProcessedNotification
              message={`Showing ${relatedDocuments.length} document${relatedDocuments.length !== 1 ? 's' : ''} related to: ${selectedItem.value}`}
              onClose={onClearSelection}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessedDocumentsTab;