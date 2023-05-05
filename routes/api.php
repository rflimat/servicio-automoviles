<?php

use App\Http\Controllers\api\ProductoController;
use App\Http\Controllers\api\UsuarioController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::controller(UsuarioController::class)->group( function() {
    Route::post('/usuario','registrar');
    Route::get('/usuario','listar');
    Route::get('/usuario/{id}','obtener');
    Route::put('/usuario/{id}','actualizar');
    Route::delete('/usuario/{id}','eliminar');
});
Route::controller(ProductoController::class)->group( function() {
    Route::post('/producto','registrar');
    Route::get('/producto','listar');
    Route::get('/producto/{idProducto}','obtener');
    Route::put('/producto/{idProducto}','actualizar');
    Route::delete('/producto/{idProducto}','eliminar');
});