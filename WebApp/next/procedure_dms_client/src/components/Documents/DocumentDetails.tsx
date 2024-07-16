import React, { useEffect, useState } from 'react'
import { DocumentWithVersions } from '@/types/Document'
import { formatDateHR, formatDateTimeHR } from '@/helpers/DateHelper'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import axios from '@/lib/axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'

interface DocumentDetailsProps {
  documentWithVersions: DocumentWithVersions;
  showEditButton?: boolean;
}

interface UpdateDocumentPayload {
  id?: number
  name: string
  description: string
}

const DocumentDetails: React.FC<DocumentDetailsProps> = ({ documentWithVersions, showEditButton = false }) => {
  const [documentWithVersionsProp, setDocumentWithVersionsProp] = useState<DocumentWithVersions>()

  useEffect(() => {
    setDocumentWithVersionsProp(documentWithVersions)
  }, [documentWithVersions])

  const handleUpdate = async (values: UpdateDocumentPayload) => {
    const updatedDocument = {
      ...values,
      id: documentWithVersionsProp?.id,
    }

    if (!updatedDocument.id) {
      console.error('Document id is missing')
    }

    await axios.put('api/documents', updatedDocument).then(
      () => {
        const updatedDocumentWithVersionsProp = {
          ...documentWithVersionsProp,
          name: values.name,
          description: values.description
        } as DocumentWithVersions

        setDocumentWithVersionsProp(updatedDocumentWithVersionsProp)
      },
    ).catch((error) => {
      console.log(error)
    }).finally(() => {
      (document.getElementById('document_form') as HTMLDialogElement)?.close()
    })
  }

  const DocumentSchema = Yup.object().shape({
    name: Yup.string().required('Naziv procedure je obavezno polje.'),
    description: Yup.string().required('Opis procedure je obavezno polje.'),
  })

  if (!documentWithVersionsProp) {
    return null
  }

  return (
    <div className="p-6 bg-white border-b border-gray-200 flex flex-wrap">
      <div className="w-1/2 p-2">
        <p><strong>Ime procedure: </strong> {documentWithVersionsProp.name}</p>
        <p><strong>Posljednje ažurirano: </strong> {formatDateHR(new Date(documentWithVersionsProp.updated_at))}</p>
      </div>
      <div className="w-1/2 p-2">
        <p><strong>Inicijalno kreirano od strane: </strong> {documentWithVersionsProp.created_by_name}</p>
        <p><strong>Inicijalno kreirano datuma: </strong> {formatDateHR(new Date(documentWithVersionsProp.created_at))}</p>
      </div>
      <div className="w-1/1 p-2">
        <p><strong>Opis: </strong> {documentWithVersionsProp.description}</p>
      </div>

      {(showEditButton) && (
        <div className="tooltip" data-tip="Uredi">
          <button onClick={() => (document.getElementById('document_form') as HTMLDialogElement)?.showModal()}
                  className="py-2 px-4 bg-orange-200 p-1 rounded">
            <FontAwesomeIcon icon={faPen} />
          </button>
        </div>
      )}

      <dialog id="document_form"
              className="modal modal-bottom sm:modal-middle bg-white sm:rounded-lg h-1/2 w-1/2 top-1/4 left-1/4">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-5 top-5"
                onClick={() => (document.getElementById('document_form') as HTMLDialogElement)?.close()}>x
        </button>
        <Formik
          initialValues={{
            name: documentWithVersionsProp.name,
            description: documentWithVersionsProp.description,
            id: undefined,
          }}
          validationSchema={DocumentSchema}
          onSubmit={handleUpdate}
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
  )
}

export default DocumentDetails