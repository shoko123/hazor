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
        Schema::create('fauna_taxa', function (Blueprint $table) {
            $table->tinyIncrements('id');
            $table->string('name', 50);
        });

        Schema::create('fauna_elements', function (Blueprint $table) {
            $table->tinyincrements('id');
            $table->string('name', 50);
        });

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
            $table->unsignedTinyInteger('taxon_id')->default(1);
            $table->unsignedTinyInteger('element_id')->default(1);
            $table->unsignedMediumInteger('order_column')->default(0);

            $table->foreign('taxon_id')
                ->references('id')->on('fauna_taxa')
                ->onUpdate('cascade');

            $table->foreign('element_id')
                ->references('id')->on('fauna_elements')
                ->onUpdate('cascade');
        });

        Schema::create('fauna_tag_groups', function (Blueprint $table) {
            $table->tinyIncrements('id');
            $table->string('name', 40);
            $table->boolean('multiple')->default(0);
        });

        Schema::create('fauna_tags', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->string('name', 50);
            $table->unsignedTinyInteger('group_id');
            $table->unsignedSmallInteger('order_column');

            $table->foreign('group_id')
                ->references('id')
                ->on('fauna_tag_groups')
                ->onUpdate('cascade');
        });

        Schema::create('fauna-fauna_tags', function (Blueprint $table) {
            $table->unsignedInteger('item_id');
            $table->foreign('item_id')->references('id')->on('loci')->onUpdate('cascade');

            $table->unsignedSmallInteger('tag_id')->unsigned();
            $table->foreign('tag_id')->references('id')->on('fauna_tags')->onUpdate('cascade');

            $table->primary(['item_id', 'tag_id']);
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
