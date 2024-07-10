'use client'

import axios from '@/lib/axios'
import { DocumentVersion, DocumentWithVersions } from '@/types/Document'
import React, { useEffect, useRef, useState } from 'react'
import { formatDateHR } from '@/helpers/DateHelper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faRepeat } from '@fortawesome/free-solid-svg-icons'
import DocumentDetails from '@/components/Documents/DocumentDetails'
import { useRouter } from 'next/navigation'

export default function IzmjenaDokumentaPage({ params }: { params: { proceduraId: string } }) {
  const [document, setDocument] = useState<DocumentWithVersions | null>(null)

  const isMounted = useRef(false);
  const router = useRouter()

  const fetchData = () => {
    if (!isMounted.current) {

      axios.get<DocumentWithVersions>(`api/documents/${params.proceduraId}/versions`)
        .then(({ data }) => {
          data.updated_at = new Date(data.updated_at).toDateString()
          setDocument(data)
        })
        .catch(error => console.error(error))

      isMounted.current = true;
    }
  }

  useEffect(fetchData, [params.proceduraId])

  function dismount() {
    isMounted.current = false;
    fetchData();
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          {document && (
            <DocumentDetails documentWithVersions={document} showEditButton={true} />
          )}
        </div>
        <div className="bg-white p-4 rounded-lg pb-14 mt-4">
          <div className="float-right">
            <button
              onClick={dismount}
              className="mb-4 bg-blue-300 p-2 rounded"
            >
              <FontAwesomeIcon icon={faRepeat} />
            </button>
            <button className="ml-4 rounded shadow-sm p-2 bg-green-200"
              onClick={() => router.push('izmjena/0')}
            >
              Dodaj novu verziju procedure
            </button>
          </div>
          {document && document.versions.length > 0 ? (
            <table className="table-auto w-full">
              <thead>
              <tr>
                <th className="px-4 py-2">Verzija</th>
                <th className="px-4 py-2">Akademska godina</th>
                <th className="px-4 py-2">Posljednje ažurirao</th>
                <th className="px-4 py-2">Posljednje ažurirano</th>
                <th className="px-4 py-2">Akcije</th>
              </tr>
              </thead>
              <tbody>
              {document.versions.map((version: DocumentVersion, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{version.version_number}</td>
                  <td className="border px-4 py-2">{version.academic_year}</td>
                  <td className="border px-4 py-2">{version.modified_by_name}</td>
                  <td className="border px-4 py-2">{formatDateHR(new Date(version.updated_at))}</td>
                  <td className="border py-2 items-center">
                    <div className="tooltip" data-tip="Kreiraj novu verziju iz postojeće">
                      <button
                        onClick={() => router.push('izmjena/' + version.id)}
                        className="bg-blue-200 p-1 rounded"
                      >
                        <FontAwesomeIcon icon={faClone} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          ) : (
            <p>Nema postojećih verzija</p>
          )}
        </div>
      </div>
    </div>
  )
}