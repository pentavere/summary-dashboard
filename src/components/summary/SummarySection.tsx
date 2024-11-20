import { ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown, Menu } from 'lucide-react';

const SummarySection = ({ 
  sections, 
  expandedSections, 
  selectedItem,
  onSectionToggle,
  onItemClick 
}) => {
  const renderSectionContent = (items) => {
    if (!items || items.length === 0) {
      return <p className="text-sm text-gray-500 py-2">No relevant information</p>;
    }

    return (
      <ul className="bg-gray-50 rounded-lg">
        {items.map((item, index) => (
          <li 
            key={index}
            onClick={() => onItemClick(item)}
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
    <Card className="h-[calc(100vh-200px)]">
      <CardHeader className="flex-shrink-0 pb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-medium uppercase">Summary</h2>
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
              onClick={() => onSectionToggle(section.key)}
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
  );
};

export default SummarySection;