<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\JsonResponse;

class DocumentController extends Controller
{
    public function indexWithVersions(): JsonResponse
    {
        $documents = Document::with('versions')->get();

        return response()->json($documents);
    }
}
