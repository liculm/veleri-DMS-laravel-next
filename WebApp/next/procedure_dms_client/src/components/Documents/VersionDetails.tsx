import React from 'react';
import { DocumentVersion } from '@/types/Document'

interface VersionDetailsProps {
  selectedVersion: DocumentVersion | null
}

const VersionDetails: React.FC<VersionDetailsProps> = ({ selectedVersion }) => {
  if (!selectedVersion) return null;

  return (
    <>
      {Object.entries(selectedVersion.document_data).map(([key, value], index) => (
        <div key={index} className="p-6 bg-white border-b border-gray-200">
          <h2><strong>{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}:</strong></h2>
          <ol className="list-decimal list-inside">
            {value?.map((item: string, index: string) => (
              <li key={index} className="p-1">
                {item}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </>
  );
}

export default VersionDetails;