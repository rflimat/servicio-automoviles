<?php

use App\Http\Controllers\api\AutenticacionController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\ComprasController;
use App\Http\Controllers\api\ProductoController;
use App\Http\Controllers\api\ProveedoresController;
use App\Http\Controllers\api\UsuarioController;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
//Route::post('/usuarios', [UsuarioController::class, 'registrar']); // para probar (crea un usuario)

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

    Route::controller(ComprasController::class)->group(function (){
        Route::get('/compras', 'index');
        Route::post('/compras', 'store');
        Route::get('/compras/{id}', 'show');
        Route::put('/compras/{id}', 'update');
        Route::delete('/compras/{id}', 'destroy');
    });

    Route::controller(ClienteController::class)->group(function (){
        Route::get('/cliente', 'index');
        Route::post('/cliente', 'store');
        Route::get('/cliente/{id}', 'show');
        Route::put('/cliente/{id}', 'update');
        Route::delete('/cliente/{id}', 'destroy');
    });
    
});
