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
use App\Http\Controllers\About\PermissionController;
use App\Http\Controllers\App\DigModelStoreController;


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
Route::post('test/run', [TestController::class, 'run']);


//read only APIs. Accessible when config.accessibility.authenticatedUsersOnly is false, or authenticated.
Route::group(['middleware' => ['read.accessibility']], function () {
    Route::get('app/status', [AppController::class, 'status']);
    Route::post('model/init', [DigModelInitController::class, 'init']);
    Route::post('model/index', [DigModelReadController::class, 'index']);
    Route::post('model/page', [DigModelReadController::class, 'page']);
    Route::post('model/show', [DigModelReadController::class, 'show']);
    Route::post('model/carousel', [DigModelReadController::class, 'carousel']);
    Route::post('model/firstSlug', [DigModelReadController::class, 'firstSlug']);
    Route::post('media/carousel', [MediaController::class, 'carousel']);
});

Route::get('about/me', [PermissionController::class, 'me'])->middleware('auth:sanctum');

//mutator APIs
Route::group(['middleware' => ['auth:sanctum', 'verified']], function () {
    Route::post('model/store', [DigModelStoreController::class, 'store']);
    Route::put('model/store', [DigModelStoreController::class, 'store']);
    Route::post('model/destroy', [DigModelDestroyController::class, 'destroy']);
    Route::post('tags/sync', [TagController::class, 'sync']);
    Route::post('media/upload', [MediaController::class, 'upload']);
    Route::post('media/destroy', [MediaController::class, 'destroy']);
    Route::post('media/edit', [MediaController::class, 'edit']);
    Route::post('media/reorder', [MediaController::class, 'reorder']);
});
