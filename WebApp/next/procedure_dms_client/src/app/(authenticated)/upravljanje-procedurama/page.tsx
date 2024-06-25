'use client';
import React, { useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

interface AddDocumentPayload {
  name: string
  description: string
}

export default function UpravljanjeProcedurama() {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  }

  const handleSubmit = async (values: AddDocumentPayload, { setSubmitting }) => {
    console.log(JSON.stringify(values))
    setSubmitting(false);
  }

  const DocumentSchema = Yup.object().shape({
    name: Yup.string().required('The name field is required.'),
    description: Yup.string().required('The description field is required.'),
  })

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
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name:</label>
                    <Field type="text" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <ErrorMessage name="name" component="div" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description:</label>
                    <Field as="textarea" name="description" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <ErrorMessage name="description" component="div" />
                  </div>
                  <button type="submit" className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
                </Form>
              </Formik>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}