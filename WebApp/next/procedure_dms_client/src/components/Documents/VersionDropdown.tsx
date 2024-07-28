'use client'

import React from 'react'
import { DocumentVersion } from '@/types/Document'
import Dropdown from '@/components/Dropdown'
import { formatDateTimeHR } from '@/helpers/DateHelper'

interface VersionDropdownProps {
  document: { versions: DocumentVersion[] };
  selectedVersion: DocumentVersion | null;
  setSelectedVersion: (version: DocumentVersion | null) => void;
  compareVersion: DocumentVersion | null;
  setCompareVersion: (version: DocumentVersion | null) => void;
  getDocumentVersionColor: (versionStatusId: number) => string;
}

const VersionDropdown: React.FC<VersionDropdownProps> =
  ({
     document,
     selectedVersion,
     setSelectedVersion,
     compareVersion,
     setCompareVersion,
     getDocumentVersionColor,
   }) => {
    return (
      <div className="flex justify-between">
        <Dropdown
          align={'left'}
          trigger={
            <button
              className={`bg-green-200 sm:rounded-lg shadow-sm p-2 ${selectedVersion && compareVersion ? 'cursor-not-allowed' : ''}`}
              disabled={!!(selectedVersion && compareVersion)}
            >
              Verzija
            </button>
          }
        >
          {document.versions.map((version, index) => (
            <div
              key={index}
              className={`p-2 border-b border-gray-200 cursor-pointer w-max ${getDocumentVersionColor(version.status_id)}`}
              onClick={() => setSelectedVersion(version)}
            >
              <p><strong>Verzija: </strong> {version.version_number}</p>
              <p><strong>Akademska godina: </strong> {version.academic_year}</p>
              <p><strong>Kreirao: </strong> {version.created_by_name}</p>
              <p><strong>Kreirano datuma: </strong> {formatDateTimeHR(new Date(version.created_at))}</p>
            </div>
          ))}
        </Dropdown>

        {selectedVersion && (
          <p>
            Trenutno odabrana bazna verzija <strong>{selectedVersion.version_number}</strong>
            {compareVersion && selectedVersion && (
              <div>
                uspoređena sa verzijom <strong>{compareVersion.version_number}</strong>
              </div>
            )}
          </p>
        )}

        <Dropdown
          trigger={
            <div className="flex items-center">
              {selectedVersion && (
                <button className="bg-blue-200 sm:rounded-lg shadow-sm p-2">Usporedi sa</button>
              )}
              {compareVersion && (
                <button
                  className="ml-2 bg-red-200 sm:rounded-lg shadow-sm p-2"
                  onClick={() => {
                    setCompareVersion(null)
                  }}
                >
                  Poništi usporedbu
                </button>
              )}
            </div>
          }
        >
          {document.versions.filter(version => version !== selectedVersion).map((version, index) => (
            <div
              key={index}
              className={`p-2 border-b border-gray-200 cursor-pointer w-max ${getDocumentVersionColor(version.status_id)}`}
              onClick={() => setCompareVersion(version)}
            >
              <p><strong>Verzija: </strong> {version.version_number}</p>
              <p><strong>Akademska godina: </strong> {version.academic_year}</p>
              <p><strong>Kreirao: </strong> {version.created_by_name}</p>
              <p><strong>Kreirano datuma: </strong> {formatDateTimeHR(new Date(version.created_at))}</p>
            </div>
          ))}
        </Dropdown>
      </div>
    )
  }

export default VersionDropdown
