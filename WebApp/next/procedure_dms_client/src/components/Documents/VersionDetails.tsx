import React from 'react';
import { DocumentVersion } from '@/types/Document';
import '../../app/globals.css';

interface VersionDetailsProps {
  selectedVersion: DocumentVersion | null;
}

const VersionDetails: React.FC<VersionDetailsProps> = ({ selectedVersion }) => {
  if (!selectedVersion) return null;

  const renderContent = (content: any, level: number = 0): JSX.Element | JSX.Element[] => {
    const indentClass = `indent-${level}`; // Define a class or inline style based on the level

    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <div key={index} className={indentClass}>
          {renderContent(item, level + 1)}
        </div>
      ));
    } else if (typeof content === 'object') {
      return Object.entries(content).map(([key, value], index) => (
        <div key={index} className={indentClass}>
          <h3>{key}:</h3>
          <ol className="list-decimal list-inside">
            {renderContent(value, level)}
          </ol>
        </div>
      ));
    } else {
      // Handles strings and other non-object, non-array types
      return <li className={indentClass}>{content}</li>;
    }
  };

  return (
    <>
      {Object.entries(selectedVersion.document_data).map(([key, value], index) => (
        <div key={index} className="p-6 bg-white border-b border-gray-200">
          <h2><strong>{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}:</strong></h2>
          <ol className="list-decimal list-inside">
            {renderContent(value)}
          </ol>
        </div>
      ))}
    </>
  );
};

export default VersionDetails;
