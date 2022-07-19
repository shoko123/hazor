<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\AppController;
use App\Http\Controllers\RegistrarController;
use App\Http\Controllers\Dig\DigController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Dig\LocusController;
use App\Http\Controllers\Dig\FaunaController;
use App\Http\Controllers\Dig\StoneController;
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

//read only APIs. Accessible when config.accessibility.authenticatedUsersOnly is false, or authenticated.
Route::group(['middleware' => ['read.accessibility']], function () {
    Route::post('dig/model/init', [DigController::class, 'init']);
    Route::post('dig/loci', [LocusController::class, 'index']);
    Route::post('dig/fauna', [FaunaController::class, 'index']);
    Route::post('dig/stones', [StoneController::class, 'index']);

    Route::get('dig/show/{dot}', [LocusController::class, 'show']);
    Route::get('dig/fauna/{dot}', [FaunaController::class, 'show']);
    Route::get('dig/stones/{dot}', [StoneController::class, 'show']);
    Route::post('app/chunk', [AppController::class, 'chunk']);
    Route::get('app/totals', [AppController::class, 'totals']);

    Route::post('registrar/loci-for-area-season', [RegistrarController::class, 'loci-for-area-season']);
    Route::post('registrar/finds-for-locus', [RegistrarController::class, 'finds-for-locus']);
});

//mutator APIs
Route::group(['middleware' => ['auth:sanctum']], function () {

    Route::post('dig/loci/store', [LocusController::class, 'store'])->middleware('can:Locus-create');
    Route::put('dig/loci/store', [LocusController::class, 'store'])->middleware('can:Locus-update');

    Route::post('dig/tags', [TagController::class, 'sync']);
    Route::post('media/upload', [MediaController::class, 'upload']);
    Route::post('media/delete', [MediaController::class, 'delete']);
    Route::post('media/edit', [MediaController::class, 'edit']);




    //Route::post('dig/loci', [LocusController::class, 'index']);
});
