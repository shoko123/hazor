<?php

namespace App\Http\Controllers\Auth;

use  App\Http\Controllers\Controller;
use App\Models\Auth\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed'
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => bcrypt($fields['password'])
        ]);

        $token = $user->createToken('myapptoken')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return response($response, 201);
    }

    public function login(Request $r)
    {
        $fields = $r->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);


        // Check email
        $user = User::where('email', $fields['email'])->first();
        if (is_null($user)) {
            return response()->json(['user' => null, 'message' => 'Email not found'], 200);
        }

        // Check password
        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response()->json(['user' => null, 'message' => 'Wrong password supplied'], 200);
        }

        $token = $user->createToken('myapptoken')->plainTextToken;

        return response()->json([
            'user' => [
                'name' => $user->name,
                'id' => $user->id,
                'token' => $token,
                'permissions' => $user->getAllPermissions()->pluck('name')
            ]
        ], 201);
    }

    public function logout(Request $request)
    {

        $request->user()->tokens()->delete();
        return response(['message' => 'Logged out and token deleted'], 200);
    }
    public function me(Request $r)
    {
        $user =  $r->user();
        $response = [
            'endpoint' => '/auth/me',
            'user' =>  $user,
            'tokens' => $user->tokens,
            'permissions' =>  $user->getAllPermissions()->pluck('name')
        ];
        return response($response, 200);
    }
}
