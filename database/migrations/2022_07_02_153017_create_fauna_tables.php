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
        Schema::create('fauna_base_taxa', function (Blueprint $table) {
            $table->tinyIncrements('id');
            $table->string('name', 50);
        });

        Schema::create('fauna_scopes', function (Blueprint $table) {
            $table->tinyIncrements('id');
            $table->string('name', 50);
        });

        Schema::create('fauna_materials', function (Blueprint $table) {
            $table->tinyincrements('id');
            $table->string('name', 50);
        });

        Schema::create('fauna_symmetries', function (Blueprint $table) {
            $table->tinyIncrements('id');
            $table->string('name', 50);
        });

        Schema::create('fauna_fusions', function (Blueprint $table) {
            $table->tinyIncrements('id');
            $table->string('name', 50);
        });

        Schema::create('fauna', function (Blueprint $table) {
            $table->increments('id');
            $table->string('uri', 60)->nullable();
            $table->string('label', 40)->nullable();
            $table->string('area', 12)->nullable();
            $table->unsignedMediumInteger('locus')->nullable();
            $table->unsignedMediumInteger('basket')->nullable();
            $table->string('stratum', 30)->nullable();
            $table->boolean('registration_clean')->default(0);

            $table->string('taxon', 40)->nullable();
            $table->string('taxon_common_name', 40)->nullable();
            $table->unsignedTinyInteger('base_taxon_id')->default(1);

            $table->string('fragment_present', 15)->nullable();
            $table->string('anatomical_label', 40)->nullable();
            $table->string('element', 40)->nullable();
            $table->string('modifications', 30)->nullable();
            $table->string('phase', 20)->nullable();
            $table->string('age', 20)->nullable();

            $table->unsignedTinyInteger('scope_id')->default(1);
            $table->unsignedTinyInteger('material_id')->default(1);
            $table->unsignedTinyInteger('symmetry_id')->default(1);
            $table->unsignedTinyInteger('fusion_proximal_id')->default(1);
            $table->unsignedTinyInteger('fusion_distal_id')->default(1);

            $table->foreign('base_taxon_id')
                ->references('id')->on('fauna_base_taxa')
                ->onUpdate('cascade');

            $table->foreign('scope_id')
                ->references('id')->on('fauna_scopes')
                ->onUpdate('cascade');

            $table->foreign('material_id')
                ->references('id')->on('fauna_materials')
                ->onUpdate('cascade');

            $table->foreign('symmetry_id')
                ->references('id')->on('fauna_symmetries')
                ->onUpdate('cascade');

            $table->foreign('fusion_proximal_id')
                ->references('id')->on('fauna_fusions')
                ->onUpdate('cascade');

            $table->foreign('fusion_distal_id')
                ->references('id')->on('fauna_fusions')
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
            $table->foreign('item_id')->references('id')->on('fauna')->onUpdate('cascade');

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
        Schema::dropIfExists('fauna_base_taxa');
        Schema::dropIfExists('fauna_materials');
    }
}
