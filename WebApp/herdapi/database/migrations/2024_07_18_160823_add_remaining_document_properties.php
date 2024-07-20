<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('document', function (Blueprint $table) {
            $table->string('organizationUnit')->nullable();
            $table->string('documentCode')->nullable();
            $table->string('responsibleStaff')->nullable();
            $table->string('timePeriod')->nullable();
            $table->string('interdependence')->nullable();
        });
    }

    public function down()
    {
        Schema::table('document', function (Blueprint $table) {
            $table->dropColumn([
                'organizationUnit',
                'documentCode',
                'responsibleStaff',
                'timePeriod',
                'interdependence'
            ]);
        });
    }
};
