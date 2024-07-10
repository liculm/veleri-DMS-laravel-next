'use client'

import axios from '@/lib/axios'
import { DocumentVersion } from '@/types/Document'
import React, { useEffect, useRef, useState } from 'react'
import JSONEditor, { JSONEditorOptions } from 'jsoneditor'
import '../../../../../../../node_modules/jsoneditor/dist/jsoneditor.css'
import { croatianTranslations } from '@/translation/jsonEditorTranslation'
import { Formik, Form, Field } from 'formik'
import { useRouter } from 'next/navigation'

export default function IzmjenaVerzijePage({ params }: { params: { versionId: number, proceduraId: number } }) {
  const [version, setVersion] = useState<DocumentVersion | null>(null)

  const isMounted = useRef(false)
  const router = useRouter()

  const versionEditorRef = useRef(null)
  const editorOptions: JSONEditorOptions = {
    name: 'Verzija procedure',
    mode: 'tree',
    mainMenuBar: true,
    navigationBar: false,
    enableSort: false,
    enableTransform: false,
    languages: croatianTranslations,
    language: 'hr',
  }

  const academicYearOptions = [
    { value: '2021/2022', label: '2021/2022' },
    { value: '2022/2023', label: '2022/2023' },
    { value: '2023/2024', label: '2023/2024' },
    { value: '2024/2025', label: '2024/2025' }
  ]

  useEffect(() => {
    if (versionEditorRef.current && version) {
      new JSONEditor(
        versionEditorRef.current,
        {
          ...editorOptions,
          // when json changes set update the version.document_data
          onChangeJSON: (documentData: any) => {
            setVersion({
              ...version,
              document_data: documentData,
            })
          },

        }, version.document_data)
    }
  }, [!!version])

  useEffect(() => {
    if (params.versionId == 0) {
      setVersion({} as DocumentVersion)

      return
    }

    if (!isMounted.current) {
      axios.get<DocumentVersion>(`api/documents/version/${params.versionId}`)
        .then(({ data }) => {
          setVersion(data)
        })
        .catch(error => console.error(error))

      isMounted.current = true
    }
  }, [params.versionId])

  const handleSave = (formData: any) => {
    if (versionEditorRef.current) {
      const newVersion = {
        ...version,
        academic_year: formData.academic_year,
        document_data: version?.document_data
      }

      axios.post<DocumentVersion>(`api/documents/version/${params.proceduraId}`, newVersion)
        .then(({ data }) => {

        })
        .catch(error => console.error(error))

    }
  }

  if (!version && params.versionId != 0) {
    return <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner text-neutral"></span>
    </div>
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm sm:rounded-lg">
          <Formik
            initialValues={{ academic_year: version?.academic_year }}
            onSubmit={(values) => {
              handleSave(values)
            }}
          >
            {() => (
              <Form>
                <div className="p-6">
                  <div className="mb-4">
                    <Field as="select" name="academic_year"
                           className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option value="">Izaberi akademsku godinu</option>
                      {academicYearOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                  </div>

                  {(versionEditorRef) && (
                    <div className="flex justify-between mt-6">
                      <div ref={versionEditorRef} className="jsoneditor w-full rounded-s" />
                    </div>
                  )}

                  <button type="submit"
                          className="mt-6 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Spremi
                  </button>

                  <button
                    className="ml-4 mt-6 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-500 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                    onClick={() => router.back()}>
                    Povratak
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}