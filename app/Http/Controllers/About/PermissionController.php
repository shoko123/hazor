<?php

namespace App\Http\Controllers\About;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

use App\Models\Auth\User;
use App\Models\Functional\MediaModel;

class PermissionController extends Controller
{
    public function __construct()
    {
    }

    public function me()
    {
        //dd("ME");
        $user = auth()->user();
        $me = User::findOrFail($user->id);

        return response()->json([
            'user' => [
                'name' => $user->name,
                'id' => $user->id,
                'permissions' => $me->getAllPermissions()->pluck('name'),
            ]
        ], 200);
    }
}
