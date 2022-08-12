<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stones', function (Blueprint $table) {
            $table->increments('id');
            $table->string('type', 50)->nullable();
            $table->string('area', 50)->nullable();
            $table->string('date', 50)->nullable();
            $table->string('basket', 50)->nullable();
            $table->string('locus', 50)->nullable();
            $table->string('prov_notes', 70)->nullable();
            $table->string('material', 50)->nullable();
            $table->string('dimensions', 100)->nullable();
            $table->string('details')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stones');
    }
};
