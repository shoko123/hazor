<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagTablesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $path = base_path() . '/database/seeders/sql/tags/locus_tags_seeder.sql';
        $sql = file_get_contents($path);
        DB::unprepared($sql);

        $path = base_path() . '/database/seeders/sql/tags/stone_tags_seeder.sql';
        $sql = file_get_contents($path);
        DB::unprepared($sql);
    }
}
