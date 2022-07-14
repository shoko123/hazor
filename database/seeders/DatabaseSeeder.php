<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\LociTablesSeeder;
use Database\Seeders\FaunaTablesSeeder;
use Database\Seeders\UsersTableSeeder;
use Database\Seeders\PermissionsSeeder;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UsersTableSeeder::class);
        $this->call(PermissionsSeeder::class);        
        $this->call(LociTablesSeeder::class);
        $this->call(FaunaTablesSeeder::class);

        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
