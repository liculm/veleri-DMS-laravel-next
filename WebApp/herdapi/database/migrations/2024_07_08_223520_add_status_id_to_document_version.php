<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        DB::table('statuses')->insert([
            ['name' => 'Čekanje'],
            ['name' => 'Odbijeno'],
            ['name' => 'Treba dorada'],
            ['name' => 'Odobreno'],
        ]);

        Schema::table('document_version', function (Blueprint $table) {
            $table->unsignedBigInteger('status_id')->default(1)->after('academic_year')->nullable();
            $table->foreign('status_id')->references('id')->on('statuses');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_version', function (Blueprint $table) {
            $table->dropForeign(['status_id']);
            $table->dropColumn('status_id');
        });

        Schema::dropIfExists('statuses');
    }
};
