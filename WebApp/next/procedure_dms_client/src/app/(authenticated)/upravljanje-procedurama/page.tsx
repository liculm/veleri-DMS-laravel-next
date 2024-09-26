'use client'

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { DocumentWithVersions } from '@/types/Document'
import { formatDateHR } from '@/helpers/DateHelper'
import { DocumentVersionStatuses } from '@/enums/DocumentVersionStatuses'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'

export default function UpravljanjeProceduramaPage() {
  const [documentsWithVersions, setDocumentsWithVersions] = useState<DocumentWithVersions[]>([])
  const [currentStatusFilter, setCurrentStatusFilter] = useState<number | null>(null)
  const [httpRequestInProgress, setHttpRequestInProgress] = useState<boolean>(false)

  const router = useRouter()

  useEffect(() => {
    if (currentStatusFilter) {
      setHttpRequestInProgress(true);
      setDocumentsWithVersions([]);

      axios.get(`/api/documents/withStatus/${currentStatusFilter}`)
        .then(response => {
          if (Array.isArray(response.data)) {
            setDocumentsWithVersions(response.data);
          } else {
            setDocumentsWithVersions([]);
          }
          setHttpRequestInProgress(false);
        })
        .catch(error => {
          setHttpRequestInProgress(false);
          console.error(error);
        });
    }
  }, [currentStatusFilter]);

  const statusFilters = [
    { name: 'Čekanje', colorClass: 'bg-gray-200', filterValue: DocumentVersionStatuses.waiting },
    { name: 'Treba Doradu', colorClass: 'bg-yellow-100', filterValue: DocumentVersionStatuses.needsWork },
    { name: 'Odbijeno', colorClass: 'bg-red-100', filterValue: DocumentVersionStatuses.rejected },
    { name: 'Odobreno', colorClass: 'bg-green-100', filterValue: DocumentVersionStatuses.approved },
  ];

  function updateVersionStatus(versionId: number, status: DocumentVersionStatuses) {
    axios.put(`/api/documents/version/${versionId}/status`, { status })
      .then(() => {
        const updatedDocumentsWithVersions = documentsWithVersions.map((documentWithVersions) => ({
          ...documentWithVersions,
          versions: documentWithVersions.versions.filter((version) => version.id !== versionId),
        }))

        setDocumentsWithVersions(updatedDocumentsWithVersions)
      })
      .catch(error => console.error(error))
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <div className="flex items-center">
              <h1 className="text-l mr-5">Filtriraj po statusu:</h1>
              <ul className="menu menu-vertical lg:menu-horizontal rounded-box space-x-5">
                {statusFilters.map((filter) => (
                  <li key={filter.name}
                      className={`rounded-box ${filter.colorClass} ${currentStatusFilter === filter.filterValue ? 'underline underline-offset-4' : ''}`}
                      onClick={() => setCurrentStatusFilter(filter.filterValue)}>
                    <a>{filter.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/*if httpRequestInProgress show spinner*/}
            {httpRequestInProgress && (
              <div className="flex justify-center items-center">
                <span className="loading loading-spinner text-neutral"></span>
              </div>
            )}

            {/*if there are no documents with versions show message*/}
            {currentStatusFilter && !httpRequestInProgress && !documentsWithVersions.length && (
              <div className="text-center p-4">Nema dokumenata</div>
            )}

            {documentsWithVersions.map((documentWithVersions) => (
              <details key={documentWithVersions.id} className="collapse bg-gray-100 mb-6 overflow-visible">
                <summary className="collapse-title text-m font-medium">{documentWithVersions.name}
                    <a className="float-right bg-gray-200 p-1 rounded"
                      onClick={() => router.push(`/procedure/${documentWithVersions.id}`)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </a>
                </summary>
                <div className="collapse-content">
                  {documentWithVersions.versions.map((version) => (
                    <div key={version.id} className="flex justify-between items-center p-4 border-b border-gray-200">
                      <div>
                        <p><strong>Verzija: </strong> {version.version_number}</p>
                        <p><strong>Akademska godina: </strong> {version.academic_year}</p>
                        <p><strong>Kreirao: </strong> {version.created_by_name}</p>
                        <p><strong>Kreirano datuma: </strong> {formatDateHR(new Date(version.created_at))}</p>
                      </div>

                      <div className="dropdown dropdown-left cursor-pointer">
                        <label tabIndex={0} className="bg-gray-200 p-2 rounded cursor-pointer">Postavi status</label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-gray-100 rounded-box w-52">
                          {statusFilters.filter((status) => status.filterValue != currentStatusFilter).map((filter) => (
                            <li key={filter.name} className={`rounded-box ${filter.colorClass}`}>
                              <a onClick={() => updateVersionStatus(version.id, filter.filterValue)}>{filter.name}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    ),
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
