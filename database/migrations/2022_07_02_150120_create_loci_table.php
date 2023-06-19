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
            $table->string('area', 3);
            $table->unsignedMediumInteger('locus_no');
            $table->string('addendum', 2)->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('square', 10)->nullable();
            $table->string('stratum', 15)->nullable();
            $table->string('type', 30)->nullable();
            $table->string('cross_ref', 130)->nullable();
            $table->string('description', 500)->nullable();
            $table->string('notes', 200)->nullable();
            $table->string('elevation', 20)->nullable();
            $table->unsignedMediumInteger('order_column')->default(0);

            $table->unique(['area', 'name']);
        });

        Schema::create('locus_tag_groups', function (Blueprint $table) {
            $table->tinyIncrements('id');
            $table->string('name', 40);
            $table->boolean('multiple')->default(0);
        });

        Schema::create('locus_tags', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->string('name', 50);
            $table->unsignedTinyInteger('group_id');
            $table->unsignedSmallInteger('order_column');

            $table->foreign('group_id')
                ->references('id')
                ->on('locus_tag_groups')
                ->onUpdate('cascade');
        });

        Schema::create('locus-locus_tags', function (Blueprint $table) {
            $table->unsignedInteger('item_id');
            $table->foreign('item_id')->references('id')->on('loci')->onUpdate('cascade');

            $table->unsignedSmallInteger('tag_id')->unsigned();
            $table->foreign('tag_id')->references('id')->on('locus_tags')->onUpdate('cascade');

            $table->primary(['item_id', 'tag_id']);
        });

        ///////

        Schema::create('loci_orig', function (Blueprint $table) {
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
