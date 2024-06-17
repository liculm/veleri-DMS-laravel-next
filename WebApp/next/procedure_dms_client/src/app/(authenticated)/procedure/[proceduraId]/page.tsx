'use client'

import React, {useState, useEffect} from 'react';
import axios from "@/lib/axios";
import {DocumentVersion, DocumentWithVersions} from "@/types/Document";
import Dropdown from "@/components/Dropdown";
import { OBJECT } from 'swr/_internal'

export default function Procedura({params}: { params: { proceduraId: string } }) {
    const [document, setDocument] = useState<DocumentWithVersions | null>(null);
    const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);


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
                </div>
                <div className="p-6 bg-white border-b border-gray-200 h-40 shadow-sm sm:rounded-lg mt-4 h-fit">
                    <Dropdown
                        align="left"
                        trigger={<button className="bg-green-200 sm:rounded-lg shadow-sm p-2">Verzija</button>}>
                        {document.versions.map((version, index) => (
                            <div key={index} className="p-2 border-b border-gray-200 cursor-pointer"
                                 onClick={() => setSelectedVersion(version)}>
                                <p><strong>Verzija: </strong> {version.version_number}</p>
                                <p><strong>Akademska godina: </strong> {version.academic_year}</p>
                                <p><strong>Kreirao: </strong> {version.created_by_name}</p>
                                <p><strong>Kreirano datuma: </strong> {version.created_at.toString()}</p>
                            </div>
                        ))}
                    </Dropdown>


                    {selectedVersion && Object.entries(selectedVersion.document_data).map(([key, value], index) => (


                      <div key={index} className="p-6 bg-white border-b border-gray-200">
                          <h2><strong>{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}:</strong>
                          </h2>
                          <ol className="list-decimal list-inside">
                              {value.map((item: string, index: string) => (
                                <li key={index} className="p-1">
                                    {item}
                                </li>
                              ))}
                          </ol>
                      </div>
                    ))}
            </div>
        </div>
</div>
)
    ;
}
