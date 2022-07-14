<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        DB::table('users')->insert([
            'name' => 'Guest',
            'email' => 'guest@opendigreports.com',
            'password' => bcrypt('houseofahab'),
        ]);


        DB::table('users')->insert([
            'name' => 'Editor',
            'email' => 'editor@opendigreports.com',
            'password' => bcrypt('Eatenbyvermin2012'),
        ]);


        DB::table('users')->insert([
            'name' => 'Potter',
            'email' => 'pottery@opendigreports.com',
            'password' => bcrypt('somanymanysherds'),
        ]);

        DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'baby@opendigreports.com',
            'password' => bcrypt('whatadarlinggirl'),
        ]);
    }
}
