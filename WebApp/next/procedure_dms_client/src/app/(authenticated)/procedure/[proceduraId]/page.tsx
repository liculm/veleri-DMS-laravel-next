'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from '@/lib/axios'
import { DocumentVersion, DocumentWithVersions } from '@/types/Document'
import Dropdown from '@/components/Dropdown'
import VersionDetails from '@/components/Documents/VersionDetails'
import JSONEditor, { JSONEditorOptions, OnClassNameParams } from 'jsoneditor'
import lodash from 'lodash'
import { formatDateTimeHR } from '@/helpers/DateHelper'
import '../../../../../node_modules/jsoneditor/dist/jsoneditor.css'
import DocumentDetails from '@/components/Documents/DocumentDetails'
import { croatianTranslations } from '@/translation/jsonEditorTranslation'

export default function Procedura({ params }: { params: { proceduraId: string } }) {
  const [document, setDocument] = useState<DocumentWithVersions | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null)
  const [compareVersion, setCompareVersion] = useState<DocumentVersion | null>(null)

  const selectedVersionEditorRef = useRef(null)
  const compareVersionEditorRef = useRef(null)

  const isMounted = useRef(false)

  const editorOptions: JSONEditorOptions = {
    name: 'Dokument',
    mode: 'view',
    mainMenuBar: true,
    navigationBar: false,
    languages: croatianTranslations,
    language: 'hr'
  }

  function checkDifferences(path: readonly string[]): string {
    const selectedVersionDocumentData = lodash.get(selectedVersion?.document_data, path)
    const compareVersionDocumentData = lodash.get(compareVersion?.document_data, path)

    const isEqual = lodash.isEqual(selectedVersionDocumentData, compareVersionDocumentData)

    if (isEqual) return ''

    return 'code-line-updated'
  }

  const fetchData = () => {

    if (!isMounted.current) {
      axios.get<DocumentWithVersions>(`api/documents/${params.proceduraId}/versions`)
        .then(({ data }) => {
          data.updated_at = new Date(data.updated_at).toDateString()
          setDocument(data)
        })
        .catch(error => console.error(error))

      isMounted.current = true
    }
  }

  useEffect(fetchData, [params.proceduraId])

  useEffect(() => {
    let selectedVersionEditor;
    let compareVersionEditor;

    if (selectedVersionEditorRef.current && selectedVersion) {
      selectedVersionEditor = new JSONEditor(
        selectedVersionEditorRef.current,
        {
          ...editorOptions,
          onClassName: (classNameParams: OnClassNameParams) =>
            checkDifferences(classNameParams.path),
        },
        selectedVersion.document_data
      );
    }

    if (compareVersionEditorRef.current && compareVersion) {
      compareVersionEditor = new JSONEditor(
        compareVersionEditorRef.current,
        {
          ...editorOptions,
          onClassName: (classNameParams: OnClassNameParams) =>
            checkDifferences(classNameParams.path),
        },
        compareVersion.document_data
      );
    }

    return () => {
      if (selectedVersionEditor) {
        selectedVersionEditor.destroy();
      }
      if (compareVersionEditor) {
        compareVersionEditor.destroy();
      }
    };
  }, [selectedVersion, compareVersion]);

  if (!document) {
    return <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner text-neutral"></span>
    </div>
  }

  function getDocumentVersionColor(versionStatusId: number): string {
    switch (versionStatusId) {
      case 4:
        return 'bg-green-100'
      case 3:
        return 'bg-yellow-100'
      case 2:
        return 'bg-red-100'
      default:
        return ''
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <DocumentDetails documentWithVersions={document} />
        </div>
        <div className="p-6 bg-white border-b border-gray-200 shadow-sm sm:rounded-lg mt-4 h-fit">
          {!document.versions.length ? (
            <p>Nažalost, nema dostupnih verzija.</p>
          ) : (
            <div className="flex justify-between">
              <Dropdown
                align={'left'}
                trigger={<button
                  className={`bg-green-200 sm:rounded-lg shadow-sm p-2 ${selectedVersion && compareVersion ? 'cursor-not-allowed' : ''}`}
                  disabled={!!(selectedVersion && compareVersion)}
                >Verzija</button>}>
                {document.versions.map((version, index) => (
                  <div key={index} className={`p-2 border-b border-gray-200 cursor-pointer w-max ${getDocumentVersionColor(version.status_id)}`}
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
                }>
                {document.versions.filter(version => version !== selectedVersion).map((version, index) => (
                  <div key={index} className={`p-2 border-b border-gray-200 cursor-pointer w-max ${getDocumentVersionColor(version.status_id)}`}
                       onClick={() => setCompareVersion(version)}>
                    <p><strong>Verzija: </strong> {version.version_number}</p>
                    <p><strong>Akademska godina: </strong> {version.academic_year}</p>
                    <p><strong>Kreirao: </strong> {version.created_by_name}</p>
                    <p><strong>Kreirano datuma: </strong> {formatDateTimeHR(new Date(version.created_at))}</p>
                  </div>
                ))}
              </Dropdown>
            </div>
          )}
          {!(selectedVersion && compareVersion) && <VersionDetails selectedVersion={selectedVersion} />}

          {(selectedVersion && compareVersion) && (
            <div className="flex justify-between mt-6 z-10">
              <div ref={selectedVersionEditorRef} className="jsoneditor w-1/2 rounded-s" />
              <div ref={compareVersionEditorRef} className="jsoneditor w-1/2 rounded-s" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
