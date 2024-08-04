<?php

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\WordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->get('/documents/versions', [DocumentController::class, 'allDocumentsWithVersions']);

Route::middleware(['auth:sanctum'])->get('/documents', [DocumentController::class, 'allDocuments']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/documents/{id}/versions', [DocumentController::class, 'requestedDocumentWithVersions']);
    Route::post('/documents', [DocumentController::class, 'addDocument']);
    Route::put('/documents', [DocumentController::class, 'updateDocument']);
    Route::get('/documents/version/{id}', [DocumentController::class, 'getDocumentVersion']);
});

Route::middleware(['auth:sanctum'])->post('/documents/version/{id}', [DocumentController::class, 'addDocumentVersion']);

Route::middleware(['auth:sanctum'])->put('/documents/version/{id}/status', [DocumentController::class, 'updateDocumentVersionStatus']);

Route::middleware(['auth:sanctum'])->post('/documents/version/{proceduraId}/word/{versionId}', [WordController::class, 'createWordFile']);

Route::middleware(['auth:sanctum'])->get('/documents/withStatus/{id}', [DocumentController::class, 'getDocumentsForStatus']);
