<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\App\ModelController;
use App\Http\Controllers\App\TestController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\AppController;
use App\Http\Controllers\RegistrarController;
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
//Route::post('auth/register', [AuthController::class, 'register']);

//read only APIs. Accessible when config.accessibility.authenticatedUsersOnly is false, or authenticated.
Route::group(['middleware' => ['read.accessibility']], function () {
    Route::get('app/totals', [AppController::class, 'totals']);    
    Route::post('model/init', [ModelController::class, 'init']);
    Route::post('model/index', [ModelController::class, 'index']);
    Route::post('model/page', [ModelController::class, 'page']);
    Route::post('model/show', [ModelController::class, 'show']);
    Route::post('registrar/loci-for-area-season', [RegistrarController::class, 'loci-for-area-season']);
    Route::post('registrar/finds-for-locus', [RegistrarController::class, 'finds-for-locus']);
});

//mutator APIs
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('tags/sync', [TagController::class, 'sync']);
    Route::post('media/upload', [MediaController::class, 'upload']);
    Route::post('media/delete', [MediaController::class, 'delete']);
    Route::post('media/edit', [MediaController::class, 'edit']);

    Route::post('loci/store', [LocusController::class, 'store'])->middleware('can:Locus-create');
    Route::put('loci/store', [LocusController::class, 'store'])->middleware('can:Locus-update');
    Route::post('stones/store', [StoneController::class, 'store'])->middleware('can:Stone-create');
    Route::put('stones/store', [StoneController::class, 'store'])->middleware('can:Stone-update');
    Route::post('fauna/store', [FaunaController::class, 'store'])->middleware('can:Fauna-create');
    Route::put('fauna/store', [FaunaController::class, 'store'])->middleware('can:Fauna-update');
});
