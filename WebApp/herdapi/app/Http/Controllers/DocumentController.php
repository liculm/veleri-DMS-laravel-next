<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentVersion;
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

    public function requestedDocumentWithVersions(Request $request, $id): JsonResponse
    {
        $userRoleId = $request->user()->role_id;

        $document = Document::with(['versions' => function ($query) use ($userRoleId) {
            $query->orderByDesc('status_id');
            if ($userRoleId !== 2) {
                $query->where('status_id', 4);
            }
        }])->find($id);

        return $document
            ? response()->json($document)
            : response()->json(['error' => 'Document not found'], 404);
    }

    public function addDocument(Request $request): JsonResponse
    {
        $user = $request->user();

        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'description' => 'required|max:1000',
            'organizationUnit' => 'required|max:255',
            'documentCode' => 'required|max:255',
            'responsibleStaff' => 'required|max:255',
            'timePeriod' => 'required|max:255',
            'interdependence' => 'required|max:255',
        ]);

        $validatedData['created_by_id'] = $user->id;
        $validatedData['created_by_name'] = $user->name;

        $document = Document::create($validatedData);

        return response()->json($document, 201);
    }

    public function updateDocument(Request $request): JsonResponse
    {
        $user = $request->user();

        $validatedData = $request->validate([
            'id' => 'required|exists:document,id',
            'name' => 'required|max:255',
            'description' => 'required|max:1000',
            'organizationUnit' => 'required|max:255',
            'documentCode' => 'required|max:255',
            'responsibleStaff' => 'required|max:255',
            'timePeriod' => 'required|max:255',
            'interdependence' => 'required|max:255',
        ]);

        DB::table('document')
            ->where('id', $validatedData['id'])
            ->update([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'organizationUnit' => $validatedData['organizationUnit'],
                'documentCode' => $validatedData['documentCode'],
                'responsibleStaff' => $validatedData['responsibleStaff'],
                'timePeriod' => $validatedData['timePeriod'],
                'interdependence' => $validatedData['interdependence'],
                'modified_by_id' => $user->id,
                'modified_by_name' => $user->name
            ]);

        return response()->json($validatedData, 201);
    }

    public function getDocumentVersion($id): JsonResponse
    {
        $version = DocumentVersion::query()
            ->where('id', $id)
            ->first();

        if ($version) {
            return response()->json($version);
        } else {
            return response()->json(['error' => 'Document not found'], 404);
        }
    }

    public function addDocumentVersion(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        $validatedData = $request->validate([
            'academic_year' => 'required|max:255'
        ]);

        // find the biggest version number for the document and add 1
        $latestVersion = DocumentVersion::query()
            ->where('document_id', $id)
            ->max('version_number');

        $validatedData['document_id'] = $id;
        $validatedData['version_number'] = $latestVersion + 1;
        $validatedData['created_by_id'] = $user->id;
        $validatedData['created_by_name'] = $user->name;
        $validatedData['modified_by_id'] = $user->id;
        $validatedData['modified_by_name'] = $user->name;
        $validatedData['document_data'] = $request->document_data;

        $documentVersion = DocumentVersion::create($validatedData);

        return response()->json($documentVersion, 201);
    }

    public function getDocumentsForStatus($id): JsonResponse
    {
        // Get all documents with their versions that have a version with the requested status
        $documents = Document::with(['versions' => function ($query) use ($id) {
            $query->where('status_id', $id);
        }])->get();

        // Filter out documents that don't have any versions with the requested status
        $documents = $documents->filter(function ($document) {
            return $document->versions->count() > 0;
        });

        // Always return as a list of documents
        return response()->json($documents->values());
    }

    public function updateDocumentVersionStatus(Request $request, $id): JsonResponse
    {
        $validatedData = $request->validate([
            'status' => 'required|max:10|min:1'
        ]);

        $user = $request->user();

        $documentVersion = DocumentVersion::query()
            ->where('id', $id)
            ->first();

        if ($documentVersion) {
            $documentVersion->status_id = $validatedData['status'];
            $documentVersion->modified_by_id = $user->id;
            $documentVersion->modified_by_name = $user->name;
            $documentVersion->approved_by_user_id = $user->id;

            $documentVersion->save();
            return response()->json($documentVersion);
        } else {
            return response()->json(['error' => 'Document version not found'], 404);
        }
    }
}
