'use client';
import React, { useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from '@/lib/axios'
import { Document } from '@/types/Document'

interface AddDocumentPayload {
  name: string
  description: string
}

export default function UpravljanjeProcedurama() {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleForm = () => setShowForm(!showForm)

  const handleSubmit = async (values: AddDocumentPayload) => {
    setSubmitting(true)
    await axios.post('api/documents', values).then(
      (response) => {
        console.log(response)
      }
    ).catch((error) => {
      console.log(error)
    })

    setSubmitting(false)
    toggleForm();
  }

  const DocumentSchema = Yup.object().shape({
    name: Yup.string().required('Naziv procedure je obavezno polje.'),
    description: Yup.string().required('Opis procedure je obavezno polje.'),
  })

  if (submitting) {
    return <div className="flex justify-center items-center h-screen">
      Učitavanje...
    </div>
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <button onClick={toggleForm}
                    className={`sm:rounded-lg shadow-sm p-2 ${showForm ? 'bg-red-200' : 'bg-green-200'}`}>
              {showForm ? 'Zatvori' : 'Dodaj novu proceduru'}
            </button>
            {showForm && (
              <Formik
                initialValues={{ name: '', description: '' }}
                validationSchema={DocumentSchema}
                onSubmit={handleSubmit}
              >
                <Form className="space-y-4 mt-10">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Naziv procedure:</label>
                    <Field type="text" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <ErrorMessage name="name" component="div" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Opis:</label>
                    <Field as="textarea" name="description" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <ErrorMessage name="description" component="div" />
                  </div>
                  <button type="submit" className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Spremi</button>
                </Form>
              </Formik>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}