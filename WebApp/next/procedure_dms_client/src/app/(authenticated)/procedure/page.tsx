'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from '@/lib/axios'
import { Document } from '@/types/Document'
import { useRouter } from 'next/navigation'
import { formatDateHR } from '@/helpers/DateHelper'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPen, faRepeat } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/hooks/auth'
import { Roles } from '@/enums/roles'

interface AddDocumentPayload {
  name: string
  description: string
  organizationUnit: string
  documentCode: string
  responsibleStaff: string
  timePeriod: string
  interdependence: string
}

export default function ProcedurePage() {
  const { user } = useAuth({})

  const [documents, setDocuments] = useState<Document[]>([])
  const [submitting, setSubmitting] = useState(false)

  const isMounted = useRef(false)
  const router = useRouter()

  const fetchData = () => {
    if (!isMounted.current) {
      axios.get('api/documents')
        .then(({ data }) => {
          const returnedDocuments = data as Document[]

          returnedDocuments.map((document: Document) => {
            document.updated_at = new Date(document.updated_at).toDateString()
          })

          return setDocuments(returnedDocuments)
        })
        .catch(error => console.error(error))

      isMounted.current = true
    }
  }

  const handleSubmit = async (values: AddDocumentPayload) => {
    setSubmitting(true)
    await axios.post('api/documents', values).then(
      (response) => {
        console.log(response)
      },
    ).catch((error) => {
      console.log(error)
    })

    dismount()

    setSubmitting(false)
  }

  const DocumentSchema = Yup.object().shape({
    name: Yup.string().required('Naziv procedure je obavezno polje.'),
    description: Yup.string().required('Opis procedure je obavezno polje.'),
    organizationUnit: Yup.string().required('Organizacijska jedinica je obavezno polje.'),
    documentCode: Yup.string().required('Šifra procedure je obavezno polje.'),
    responsibleStaff: Yup.string().required('Odgovorne osobe su obavezno polje.'),
    timePeriod: Yup.string().required('Vremenska dinamika je obavezno polje.'),
    interdependence: Yup.string().required('Međuovisnosti su obavezno polje.'),
  })

  useEffect(fetchData, [])

  function dismount() {
    isMounted.current = false
    fetchData()
  }

  if (submitting) {
    return <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner text-neutral"></span>
    </div>
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            {user?.role_id && user?.role_id === Roles.admin && (
              <button className="float-right ml-4 rounded shadow-sm p-2 bg-green-200"
                      onClick={() => (document.getElementById('document_form') as HTMLDialogElement)?.showModal()}>
                Dodaj novu proceduru
              </button>
            )}
            <button
              onClick={dismount}
              className="float-right mb-4 bg-blue-300 p-2 rounded"
            >
              <FontAwesomeIcon icon={faRepeat} />
            </button>
            <table className="table-auto w-full">
              <thead>
              <tr>
                <th className="px-4 py-2">Ime procedure</th>
                <th className="px-4 py-2">Inicijalno kreirao</th>
                <th className="px-4 py-2">Posljednje ažurirano</th>
                <th className="px-4 py-2">Akcije</th>
              </tr>
              </thead>
              <tbody>
              {documents.map((document: Document, index) => (
                <tr key={index}>
                  <td className="border px-2 py-2">{document.name}</td>
                  <td className="border px-2 py-2">{document.created_by_name}</td>
                  <td className="border px-2 py-2">{formatDateHR(new Date(document.updated_at))}</td>
                  <td className="border py-2 items-center">
                    <div className="tooltip" data-tip="Pregledaj">
                      <button
                        onClick={() => router.push(`/procedure/${document.id}`)}
                        className="bg-blue-200 p-1 rounded mr-1"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </div>
                    {user?.role_id && user?.role_id === Roles.admin && (
                      <div className="tooltip" data-tip="Uredi">
                        <button
                          onClick={() => router.push(`/procedure/${document.id}/izmjena`)}
                          className="bg-orange-200 p-1 rounded"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
            <dialog id="document_form"
                    className="modal modal-bottom sm:modal-middle bg-white sm:rounded-lg h-5/6 w-1/2 top-10 left-1/4 scroll-smooth overflow-scroll overflow-x-hidden">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-5 top-5"
                      onClick={() => (document.getElementById('document_form') as HTMLDialogElement)?.close()}>x
              </button>
              <Formik
                initialValues={{
                  name: '',
                  description: '',
                  organizationUnit: '',
                  documentCode: '',
                  responsibleStaff: '',
                  timePeriod: '',
                  interdependence: '',
                }}
                validationSchema={DocumentSchema}
                onSubmit={handleSubmit}
              >
                <Form className="space-y-5 p-5 w-full mt-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Naziv procedure:</label>
                    <Field type="text" name="name"
                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <ErrorMessage className="text-xs text-red-500" name="name" component="div" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Opis:</label>
                    <Field as="textarea" name="description"
                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <ErrorMessage className="text-xs text-red-500" name="description" component="div" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Organizacijska jedinica:</label>
                    <Field type="text" name="organizationUnit"
                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <ErrorMessage className="text-xs text-red-500" name="organizationUnit" component="div" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Šifra procedure:</label>
                    <Field type="text" name="documentCode"
                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <ErrorMessage className="text-xs text-red-500" name="documentCode" component="div" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Odgovorne osobe:</label>
                    <Field type="text" name="responsibleStaff"
                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <ErrorMessage className="text-xs text-red-500" name="responsibleStaff" component="div" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vremenska dinamika:</label>
                    <Field type="text" name="timePeriod"
                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <ErrorMessage className="text-xs text-red-500" name="timePeriod" component="div" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Međuovisnosti:</label>
                    <Field type="text" name="interdependence"
                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <ErrorMessage className="text-xs text-red-500" name="interdependence" component="div" />
                  </div>
                  <button type="submit"
                          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Spremi
                  </button>
                </Form>
              </Formik>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  )
}
