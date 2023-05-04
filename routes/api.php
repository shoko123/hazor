<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\App\DigModelDestroyController;
use App\Http\Controllers\App\DigModelInitController;
use App\Http\Controllers\App\DigModelReadController;
use App\Http\Controllers\App\TestController;
use App\Http\Controllers\App\TagController;
use App\Http\Controllers\App\MediaController;
use App\Http\Controllers\App\AppController;
use App\Http\Controllers\App\RegistrarController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\App\DigModelStoreController;
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
Route::post('test/status', [TestController::class, 'status']);

//authentication routes
Route::post('auth/login', [AuthController::class, 'login']);
Route::get('auth/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
Route::post('auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
//Route::post('auth/register', [AuthController::class, 'register']);

//read only APIs. Accessible when config.accessibility.authenticatedUsersOnly is false, or authenticated.
Route::group(['middleware' => ['read.accessibility']], function () {
    Route::get('app/status', [AppController::class, 'status']);    
    Route::post('model/init', [DigModelInitController::class, 'init']);
    Route::post('model/index', [DigModelReadController::class, 'index']);
    Route::post('model/page', [DigModelReadController::class, 'page']);
    Route::post('model/show', [DigModelReadController::class, 'show']);
    Route::post('model/carousel', [DigModelReadController::class, 'carousel']);
    Route::post('model/firstUrlId', [DigModelReadController::class, 'firstUrlId']);    
    Route::post('registrar/loci-for-area-season', [RegistrarController::class, 'loci-for-area-season']);
    Route::post('media/carousel', [MediaController::class, 'carousel']);    
    Route::post('media/page', [MediaController::class, 'page']);     
    Route::post('registrar/finds-for-locus', [RegistrarController::class, 'finds-for-locus']);
});

//mutator APIs
//Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('tags/sync', [TagController::class, 'sync']);   
    Route::post('media/upload', [MediaController::class, 'upload']);
    Route::post('media/destroy', [MediaController::class, 'destroy']);
    Route::post('media/edit', [MediaController::class, 'edit']);
    Route::post('model/store', [DigModelStoreController::class, 'store']);
    Route::put('model/store', [DigModelStoreController::class, 'store']);
    Route::post('model/destroy', [DigModelDestroyController::class, 'destroy']);

    
    Route::post('loci/store', [LocusController::class, 'store'])->middleware('can:Locus-create');
    Route::put('loci/store', [LocusController::class, 'store'])->middleware('can:Locus-update');
    Route::post('stones/store', [StoneController::class, 'store'])->middleware('can:Stone-create');
    Route::put('stones/store', [StoneController::class, 'store'])->middleware('can:Stone-update');
    Route::post('fauna/store', [FaunaController::class, 'store'])->middleware('can:Fauna-create');
    Route::put('fauna/store', [FaunaController::class, 'store'])->middleware('can:Fauna-update');
//});
