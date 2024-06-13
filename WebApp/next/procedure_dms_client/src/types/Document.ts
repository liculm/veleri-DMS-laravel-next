export interface Document {
    id: number;
    name: string;
    description: string;
    created_by_id: number;
    created_by_name: string;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface DocumentWithVersions extends Document {
    versions: DocumentVersion[];
}

export interface DocumentVersion {
    id: number;
    document_id: number;
    version_number: number;
    academic_year: string;
    approved_by_user_id: number;
    document_data: any
    created_by_id: number;
    created_by_name: string;
    modified_by_id: number;
    modified_by_name: string;
    created_at: Date;
    updated_at: Date;
}