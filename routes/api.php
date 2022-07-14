<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AppController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Dig\LocusController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//open routes
Route::get('app/init', [AppController::class, 'init']);
Route::post('app/test', [TestController::class, 'test']);

//authentication routes
Route::post('auth/login', [AuthController::class, 'login']);
Route::get('auth/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
Route::post('auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
//Route::post('register', [AuthController::class, 'register']);

//read only routes. Accessible when config.accessibility.authenticatedUsersOnly is false, or authenticated.
Route::group(['middleware' => ['read.accessibility']], function () {
    Route::post('dig/loci', [LocusController::class, 'index']);
    Route::post('dig/fauna', [FaunaController::class, 'index']);
    Route::post('dig/stones', [StoneController::class, 'index']);
    Route::get('dig/loci/{dot}', [LocusController::class, 'show']);
    Route::get('dig/fauna/{dot}', [FaunaController::class, 'show']);
    Route::get('dig/stones/{dot}', [StoneController::class, 'show']);
    Route::get('app/totals', [AppController::class, 'totals']);
});

Route::group(['middleware' => ['auth:sanctum']], function () {

    Route::post('dig/loci/store', [LocusController::class, 'store'])->middleware('can:Locus-create');
    Route::put('dig/loci/store', [LocusController::class, 'store'])->middleware('can:Locus-update');



    //Route::post('dig/loci', [LocusController::class, 'index']);
});

//Route::post('loci', [LocusController::class, 'index'])/*->middleware('can:Locus-read')*/;
//Route::post('loci', [LocusController::class, 'index'])->middleware('can:Locus-read');

//});
