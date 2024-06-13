<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\JsonResponse;

class DocumentController extends Controller
{
    public function allDocuments(): JsonResponse
    {
        $documents = Document::all();
        return response()->json($documents);
    }

    public function allDocumentsWithVersions(): JsonResponse
    {
        $documents = Document::with('versions')->get();

        return response()->json($documents);
    }

    public function requestedDocumentWithVersions($id): JsonResponse
    {
        $document = Document::with('versions')->find($id);

        if ($document) {
            return response()->json($document);
        } else {
            return response()->json(['error' => 'Document not found'], 404);
        }
    }
}
