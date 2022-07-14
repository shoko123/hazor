<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFaunaTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       

        Schema::create('fauna', function (Blueprint $table) {
            $table->increments('id');
            $table->string('label', 50)->nullable();
            $table->string('area', 50)->nullable();   
            $table->string('locus', 50)->nullable();
            $table->string('basket', 50)->nullable();
            $table->string('item_category', 50)->nullable();
            $table->string('biological_taxonomy', 50)->nullable();
            $table->string('has_taxonomic_identifier', 50)->nullable();
            $table->string('has_anatomical_identifier', 50)->nullable();
            $table->string('stratum')->nullable();
            $table->string('taxon')->nullable();
            $table->string('element', 50)->nullable();
            $table->string('fragment_present', 50)->nullable();
            $table->unsignedSmallInteger('bone_number')->nullable();
            $table->string('snippet', 200)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fauna_base_types');
        Schema::dropIfExists('fauna');
    }
}
