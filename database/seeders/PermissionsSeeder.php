<?php

namespace Database\Seeders;

use App\Models\Auth\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionsSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = ['create', 'update', 'delete', 'media', 'tag'];
        $models = ['Locus', 'Fauna', 'Stone'];
        
        foreach ($models as $m) {
            $role = Role::create(['name' => $m . ' manager']);
            foreach ($permissions as $p) {
                $p_name = $m . '-' . $p;
                Permission::create(['name' => $p_name]);
                $role->givePermissionTo($p_name);
            }
        }

        $editor = User::where('email', 'editor@opendigreports.com')->firstOrFail();
        $editor->assignRole('Locus Manager', 'Fauna Manager', 'Stone Manager');
    }
}
