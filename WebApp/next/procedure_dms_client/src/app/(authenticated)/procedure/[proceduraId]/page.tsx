'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from '@/lib/axios'
import { DocumentVersion, DocumentWithVersions } from '@/types/Document'
import Dropdown from '@/components/Dropdown'
import VersionDetails from '@/components/Documents/VersionDetails'
import JSONEditor, { JSONEditorOptions } from 'jsoneditor'
import { formatDateHR, formatDateTimeHR } from '@/helpers/DateHelper'


export default function Procedura({ params }: { params: { proceduraId: string } }) {
  const [document, setDocument] = useState<DocumentWithVersions | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null)
  const [compareVersion, setCompareVersion] = useState<DocumentVersion | null>(null)

  const selectedVersionEditorRef = useRef(null);
  const compareVersionEditorRef = useRef(null);

  const fetchData = () => {
    axios.get<DocumentWithVersions>(`api/documents/${params.proceduraId}/versions`)
      .then(({ data }) => {
        data.updated_at = new Date(data.updated_at).toDateString()
        setDocument(data)
      })
      .catch(error => console.error(error))
  }

  useEffect(fetchData, [params.proceduraId])

  useEffect(() => {
    if (selectedVersion && compareVersion) {
      return
    }

    if (selectedVersionEditorRef.current && selectedVersion) {
      const container = selectedVersionEditorRef.current;
      const options: JSONEditorOptions = {
        modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
      };
      const editor = new JSONEditor(container, options);
      editor.setMode('view'); // set tree mode
      editor.set(selectedVersion.document_data); // set the selected version data
    }
  }, [selectedVersion]);

  useEffect(() => {
    if (compareVersionEditorRef.current && compareVersion) {
      const container = compareVersionEditorRef.current;
      const options: JSONEditorOptions = {
        modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
      };
      const editor = new JSONEditor(container, options);
      editor.setMode('view'); // set tree mode
      editor.set(compareVersion.document_data); // set the compare version data
    }
  }, [compareVersion, selectedVersion]);

  if (!document) {
    return <div className="flex justify-center items-center h-screen">
      Učitavanje...
    </div>
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200 flex flex-wrap">
            <div className="w-1/2 p-2">
              <p><strong>Ime procedure: </strong> {document.name}</p>
              <p><strong>Posljednje ažurirano: </strong> {formatDateTimeHR(new Date(document.updated_at))}</p>
            </div>
            <div className="w-1/2 p-2">
              <p><strong>Inicijalno kreirano od strane: </strong> {document.created_by_name}</p>
              <p><strong>Inicijalno kreirano datuma: </strong> {formatDateHR(new Date(document.created_at))}</p>
            </div>
            <div className="w-1/1 p-2">
              <p><strong>Opis: </strong> {document.description}</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white border-b border-gray-200 shadow-sm sm:rounded-lg mt-4 h-fit">
          <div className="flex justify-between">
            <Dropdown
              trigger={<button className="bg-green-200 sm:rounded-lg shadow-sm p-2">Verzija</button>}>
              {document.versions.map((version, index) => (
                <div key={index} className="p-2 border-b border-gray-200 cursor-pointer w-max"
                     onClick={() => setSelectedVersion(version)}>
                  <p><strong>Verzija: </strong> {version.version_number}</p>
                  <p><strong>Akademska godina: </strong> {version.academic_year}</p>
                  <p><strong>Kreirao: </strong> {version.created_by_name}</p>
                  <p><strong>Kreirano datuma: </strong> {formatDateTimeHR(new Date(version.created_at))}</p>
                </div>
              ))}
            </Dropdown>
            {selectedVersion && (
              <p>
                Trenutno odabrana verzija: <strong>{selectedVersion.version_number}</strong>
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
              }>
              {document.versions.filter(version => version !== selectedVersion).map((version, index) => (
                <div key={index} className="p-2 border-b border-gray-200 cursor-pointer w-max"
                     onClick={() => setCompareVersion(version)}>
                  <p><strong>Verzija: </strong> {version.version_number}</p>
                  <p><strong>Akademska godina: </strong> {version.academic_year}</p>
                  <p><strong>Kreirao: </strong> {version.created_by_name}</p>
                  <p><strong>Kreirano datuma: </strong> {formatDateTimeHR(new Date(version.created_at))}</p>
                </div>
              ))}
            </Dropdown>
          </div>
          {!(selectedVersion && compareVersion) && <VersionDetails selectedVersion={selectedVersion} />}

          {(selectedVersion && compareVersion) && (
          <div className="flex justify-between">
              <div ref={selectedVersionEditorRef} className="w-1/2" />
              <div ref={compareVersionEditorRef} className="w-1/2" />
          </div>
          )}
        </div>
      </div>
    </div>
  )
}
