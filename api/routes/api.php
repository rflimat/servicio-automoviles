<?php

use App\Http\Controllers\api\AutenticacionController;
use App\Http\Controllers\api\ProductoController;
use App\Http\Controllers\api\ProveedoresController;
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

Route::post('/login',[AutenticacionController::class,'login']);

Route::middleware('auth:sanctum')->group( function(){
    Route::controller(AutenticacionController::class)->group(function() {
        //Route::get('/user','perfil');
        Route::post('/logout','logout');
    });
    Route::controller(UsuarioController::class)->group( function() {
        Route::post('/usuarios','registrar');
        Route::get('/usuarios','listar');
        Route::get('/usuarios/{id}','obtener');
        Route::put('/usuarios/{id}','actualizar');
        Route::delete('/usuarios/{id}','eliminar');
    });
    Route::controller(ProductoController::class)->group( function() {
        Route::post('/productos','registrar');
        Route::get('/productos','listar');
        Route::get('/productos/{idProducto}','obtener');
        Route::put('/productos/{idProducto}','actualizar');
        Route::delete('/productos/{idProducto}','eliminar');
    });
    Route::controller(Proveedorescontroller::class)->group(function(){
        Route::get('/proveedores', 'index');
        Route::post('/proveedores', 'store');
        Route::get('/proveedores/{id}', 'show');
        Route::put('/proveedores/{id}', 'update');
        Route::delete('/proveedores/{id}', 'destroy');
    });
    
});
