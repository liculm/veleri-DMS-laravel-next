<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'description' => 'required|max:1000',
        ]);

        $validatedData['created_by_id'] = $user->id;
        $validatedData['created_by_name'] = $user->name;

        $document = Document::create($validatedData);

        return response()->json($document, 201);
    }

    public function updateDocument(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'id' => 'required|exists:document,id',
            'name' => 'required|max:255',
            'description' => 'required|max:1000',
        ]);

        DB::table('document')
            ->where('id', $validatedData['id'])
            ->update([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
            ]);

        return response()->json($validatedData, 201);
    }
}
