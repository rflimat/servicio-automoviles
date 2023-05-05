<?php

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
    Route::post('/usuario','Registrar');
    Route::get('/usuario','Listar');
    Route::get('/usuario/{id}','Obtener');
    Route::put('/usuario/{id}','Actualizar');
    Route::delete('/usuario/{id}','Eliminar');
});