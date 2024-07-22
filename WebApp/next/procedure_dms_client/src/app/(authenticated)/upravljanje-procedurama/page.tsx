'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { Document, DocumentWithVersions } from '@/types/Document'
import { useAuth } from '@/hooks/auth'
import { formatDateTimeHR } from '@/helpers/DateHelper'

export default function UpravljanjeProceduramaPage() {
  const [documentsWithVersions, setdocumentsWithVersions] = useState<DocumentWithVersions[]>([])
  const [currentStatusFilter, setCurrentStatusFilter] = useState<number>(1)
  const router = useRouter()

  const isMounted = useRef(false)


  useEffect(() => {
    if (!isMounted.current) {
      axios.get('/api/documents/waitingForApproval')
        .then(response => setdocumentsWithVersions(response.data))
        .catch(error => console.error(error))
      isMounted.current = true
    }

  }, [])

  const handleDocumentClick = (documentId: number) => {
    router.push(`/procedure/${documentId}`)
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <div className="flex items-center">
              <h1 className="text-xl mr-5">Filtriraj po status:</h1>
              <ul className="menu menu-vertical lg:menu-horizontal rounded-box space-x-5">
                <li className="rounded-box bg-gray-200"><a>Čekanje</a></li>
                <li className="rounded-box bg-yellow-100"><a>Treba Doradu</a></li>
                <li className="rounded-box bg-red-100"><a>Odbijeno</a></li>
                <li className="rounded-box bg-green-100"><a>Odobreno</a></li>
              </ul>
            </div>

            {documentsWithVersions.map((documentWithVersions) => (
              <details key={documentWithVersions.id} className="collapse bg-gray-100 mb-4">
                <summary className="collapse-title text-xl font-medium">{documentWithVersions.name}</summary>
                <div className="collapse-content">
                  {documentWithVersions.versions.map((version) => (
                      <div key={version.id} className="flex justify-between items-center p-4 border-b border-gray-200">
                        <div>
                          <p><strong>Verzija: </strong> {version.version_number}</p>
                          <p><strong>Akademska godina: </strong> {version.academic_year}</p>
                          <p><strong>Kreirao: </strong> {version.created_by_name}</p>
                          <p><strong>Kreirano datuma: </strong> {formatDateTimeHR(new Date(version.created_at))}</p>
                        </div>
                        <button onClick={() => handleDocumentClick(documentWithVersions.id)}
                                className="btn btn-primary">Pregledaj
                        </button>
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
