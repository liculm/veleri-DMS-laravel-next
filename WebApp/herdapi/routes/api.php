<?php

use App\Http\Controllers\DocumentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->get('/documents/versions', [DocumentController::class, 'allDocumentsWithVersions']);

Route::middleware(['auth:sanctum'])->get('/documents', [DocumentController::class, 'allDocuments']);

Route::middleware(['auth:sanctum'])->get('/documents/{id}/versions', [DocumentController::class, 'requestedDocumentWithVersions']);

Route::middleware(['auth:sanctum'])->post('/documents', [DocumentController::class, 'store']);
