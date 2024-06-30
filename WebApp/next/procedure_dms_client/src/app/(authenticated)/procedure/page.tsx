'use client'

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { Document } from '@/types/Document'
import { useRouter } from 'next/navigation'
import { formatDateHR } from '@/helpers/DateHelper'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

interface AddDocumentPayload {
  name: string
  description: string
}

export default function ProcedurePage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [submitting, setSubmitting] = useState(false)

  const fetchData = () => {
    axios.get('api/documents')
      .then(({ data }) => {
        const returnedDocuments = data as Document[]

        returnedDocuments.map((document: Document) => {
          document.updated_at = new Date(document.updated_at).toDateString()
        })

        return setDocuments(returnedDocuments)
      })
      .catch(error => console.error(error))
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

    fetchData()

    setSubmitting(false)
  }

  const DocumentSchema = Yup.object().shape({
    name: Yup.string().required('Naziv procedure je obavezno polje.'),
    description: Yup.string().required('Opis procedure je obavezno polje.'),
  })


  useEffect(fetchData, [])
  const router = useRouter()

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
            <button className="float-right ml-4 rounded shadow-sm p-2 bg-green-200"
                    onClick={() => document.getElementById('document_form')?.showModal()}>
              Dodaj novu proceduru
            </button>
            <button
              onClick={fetchData}
              className="float-right mb-4 bg-blue-300 p-2 rounded"
            >
              Osviježi
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
                  <td className="border px-4 py-2">{document.name}</td>
                  <td className="border px-4 py-2">{document.created_by_name}</td>
                  <td className="border px-4 py-2">{formatDateHR(new Date(document.updated_at))}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => router.push(`/procedure/${document.id}`)}
                      className="float-right mb-4 bg-green-200 p-2 rounded"
                    >
                      Pregledaj
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
            <dialog id="document_form"
                    className="modal modal-bottom sm:modal-middle bg-white sm:rounded-lg h-1/2 w-1/2 top-1/4 left-1/4">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-5 top-5"
                      onClick={() => document.getElementById('document_form')?.close()}>x
              </button>
              <Formik
                initialValues={{ name: '', description: '' }}
                validationSchema={DocumentSchema}
                onSubmit={handleSubmit}
              >
                <Form className="space-y-5 p-5 w-full">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Naziv procedure:</label>
                    <Field type="text" name="name"
                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <ErrorMessage name="name" component="div" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Opis:</label>
                    <Field as="textarea" name="description"
                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <ErrorMessage name="description" component="div" />
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