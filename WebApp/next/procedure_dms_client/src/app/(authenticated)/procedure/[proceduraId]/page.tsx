'use client'

import React, {useState, useEffect} from 'react';
import axios from "@/lib/axios";
import {DocumentWithVersions} from "@/types/Document";

export default function Procedura({params}: { params: { proceduraId: string } }) {
    const [document, setDocument] = useState<DocumentWithVersions | null>(null);

    const fetchData = () => {
        axios.get<DocumentWithVersions>(`api/documents/${params.proceduraId}/versions`)
            .then(({data}) => {
                data.updated_at = new Date(data.updated_at).toDateString();
                setDocument(data);
            })
            .catch(error => console.error(error));
    };

    useEffect(fetchData, [params.proceduraId]);

    if (!document) {
        return <div className="flex justify-center items-center h-screen">
            Učitavanje...
        </div>;
    }

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200 flex flex-wrap">
                        <div className="w-1/2 p-2">
                            <p><strong>Ime procedure: </strong> {document.name}</p>
                            <p><strong>Posljednje ažurirano: </strong> {document.updated_at.toString()}</p>
                        </div>
                        <div className="w-1/2 p-2">
                            <p><strong>Inicijalno kreirano od strane: </strong> {document.created_by_name}</p>
                            <p><strong>Inicijalno kreirano datuma: </strong> {document.created_at.toString()}</p>
                        </div>
                        <div className="w-1/1 p-2">
                            <p><strong>Opis: </strong> {document.description}</p>
                        </div>
                    </div>
                    <div className="p-6 bg-white border-b border-gray-200">

To be continued...
                    </div>
                </div>
            </div>
        </div>
    );
}