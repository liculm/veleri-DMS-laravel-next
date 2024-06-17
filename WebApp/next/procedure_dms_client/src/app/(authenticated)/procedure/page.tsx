'use client'

import React, {useState, useEffect} from 'react';
import axios from "@/lib/axios";
import {Document} from "@/types/Document";
import {useRouter} from "next/navigation";
import { formatDateHR } from '@/helpers/DateHelper'

export default function ProcedurePage() {
    const [documents, setDocuments] = useState<Document[]>([]);

    const fetchData = () => {
        axios.get('api/documents')
            .then(({data}) => {
                const returnedDocuments = data as Document[];

                returnedDocuments.map((document: Document) => {
                    document.updated_at = new Date(document.updated_at).toDateString();
                });

                return setDocuments(returnedDocuments)
            })
            .catch(error => console.error(error));
    };

    useEffect(fetchData, []);
    const router = useRouter()

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <button
                            onClick={fetchData}
                            className="btn btn-primary float-right mb-4 bg-blue-300 p-2 rounded"
                        >
                            Refresh
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
                                            className="btn btn-primary float-right mb-4 bg-blue-300 p-2 rounded"
                                        >
                                            Izaberi
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}