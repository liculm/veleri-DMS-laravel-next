'use client'

import React, { useState, useEffect, useRef } from 'react';
import axios from '@/lib/axios';
import { DocumentVersion, DocumentWithVersions } from '@/types/Document';
import JSONEditor, { JSONEditorOptions, OnClassNameParams } from 'jsoneditor';
import lodash from 'lodash';
import '../../../../../node_modules/jsoneditor/dist/jsoneditor.css';
import DocumentDetails from '@/components/Documents/DocumentDetails';
import { croatianTranslations } from '@/translation/jsonEditorTranslation';
import VersionDropdown from '@/components/Documents/VersionDropdown';
import VersionDetails from '@/components/Documents/VersionDetails'
import { DocumentVersionStatuses, getDocumentVersionStatus } from '@/objects/documentVersionStatuses'

export default function Procedura({ params }: { params: { proceduraId: string } }) {
  const [document, setDocument] = useState<DocumentWithVersions | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [compareVersion, setCompareVersion] = useState<DocumentVersion | null>(null);

  const selectedVersionEditorRef = useRef(null);
  const compareVersionEditorRef = useRef(null);

  const isMounted = useRef(false);

  const editorOptions: JSONEditorOptions = {
    name: 'Dokument',
    mode: 'view',
    mainMenuBar: true,
    navigationBar: false,
    languages: croatianTranslations,
    language: 'hr',
  };

  function checkDifferences(path: readonly string[]): string {
    if (path.length === 0) return '';

    const selectedVersionDocumentData = lodash.get(selectedVersion?.document_data, path);
    const compareVersionDocumentData = lodash.get(compareVersion?.document_data, path);

    return lodash.isEqual(selectedVersionDocumentData, compareVersionDocumentData) ? '' : 'code-line-updated';
  }

  const fetchData = () => {
    if (!isMounted.current) {
      axios.get<DocumentWithVersions>(`api/documents/${params.proceduraId}/versions`)
        .then(({ data }) => {
          data.updated_at = new Date(data.updated_at).toDateString();
          setDocument(data);
        })
        .catch(error => console.error(error));

      isMounted.current = true;
    }
  };

  useEffect(fetchData, [params.proceduraId]);

  useEffect(() => {
    let selectedVersionEditor: JSONEditor;
    let compareVersionEditor: JSONEditor;

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
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-neutral"></span>
      </div>
    );
  }

  function getDocumentVersionColor(versionStatusId: number): string {
    return getDocumentVersionStatus(versionStatusId).color;
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
            <VersionDropdown
              document={document}
              selectedVersion={selectedVersion}
              setSelectedVersion={setSelectedVersion}
              compareVersion={compareVersion}
              setCompareVersion={setCompareVersion}
              getDocumentVersionColor={getDocumentVersionColor}
            />
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
  );
}
