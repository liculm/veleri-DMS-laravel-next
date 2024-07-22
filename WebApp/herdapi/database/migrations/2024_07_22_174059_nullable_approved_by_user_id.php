<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('document_version', function (Blueprint $table) {
            $table->foreignId('approved_by_user_id')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('document_version', function (Blueprint $table) {
            $table->foreignId('approved_by_user_id')->nullable(false)->change();
        });
    }
};
