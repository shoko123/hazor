<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use Closure;

class Access
{
    public function handle($request, Closure $next)
    {
        if (!env('ACCESSIBILITY_AUTHENTICATED_ONLY') || $request->user('sanctum')) {
            return $next($request);
        } else {
            return response()->json([
                "msg" => "This API is only available to authenticated users at this time",
                "user" => $request->user('sanctum')
            ], 401);
        }
    }
}
