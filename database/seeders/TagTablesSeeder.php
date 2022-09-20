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
    $list = ["locus_tags_seeder", "stone_tags_seeder", "global_tags_seeder"];

        foreach ($list as $file_name) {
            $path = base_path() . "/database/seeders/sql/tags/" . $file_name . ".sql";
            $sql = file_get_contents($path);
            DB::unprepared($sql);
        }

        return;

        $path = base_path() . '/database/seeders/sql/tags/locus_tags_seeder.sql';
        $sql = file_get_contents($path);
        DB::unprepared($sql);

        $path = base_path() . '/database/seeders/sql/tags/stone_tags_seeder.sql';
        $sql = file_get_contents($path);
        DB::unprepared($sql);

        $path = base_path() . '/database/seeders/sql/tags/global_tags_seeder.sql';
        $sql = file_get_contents($path);
        DB::unprepared($sql);
    }
}
