<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLociTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('loci', function (Blueprint $table) {
            $table->increments('id');     
            $table->string('name', 10)->nullable();
            $table->string('type', 30)->nullable();
            $table->string('stratum', 15)->nullable();
            $table->string('area', 10)->nullable();
            $table->string('square', 10)->nullable();
            $table->string('elevation', 20)->nullable();
            $table->string('cross_ref', 130)->nullable();   
            
            //$table->unique('name');   
        });

        /*
        Schema::create('locus_tag_types', function (Blueprint $table) {
            $table->tinyIncrements('id');
            $table->string('name', 40);
            $table->boolean('multiple')->default(0);
            $table->json('dependency')->nullable();
        });

        Schema::create('locus_tags', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->string('name', 50);
            $table->unsignedTinyInteger('type_id');
            $table->unsignedSmallInteger('order_column');
                
            $table->foreign('type_id')
                ->references('id')
                ->on('locus_tag_types')
                ->onUpdate('cascade');
        });

        Schema::create('locus-locus_tags', function (Blueprint $table) {
            $table->unsignedInteger('item_id');
            $table->foreign('item_id')->references('id')->on('loci')->onUpdate('cascade');

            $table->unsignedSmallInteger('tag_id')->unsigned();
            $table->foreign('tag_id')->references('id')->on('locus_tags')->onUpdate('cascade');

            $table->primary(['item_id', 'tag_id']);
        });
        */
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('loci');
    }
}
