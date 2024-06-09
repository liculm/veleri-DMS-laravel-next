<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('document_version', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained('document')->onDelete('cascade');
            $table->integer('version_number');
            $table->string('academic_year');
            $table->foreignId('approved_by_user_id')->constrained('users')->onDelete('cascade');
            $table->json('document_data');
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->string('created_by_name')->nullable();
            $table->unsignedBigInteger('modified_by_id')->nullable();
            $table->string('modified_by_name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_version');
    }
};
