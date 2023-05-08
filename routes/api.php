<?php

use App\Http\Controllers\api\AutenticacionController;
use App\Http\Controllers\api\ProductoController;
use App\Http\Controllers\api\UsuarioController;
use App\Http\Controllers\proveedores\Proveedorescontroller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login',[AutenticacionController::class,'login']);

Route::middleware('auth:sanctum')->group( function(){
    Route::controller(AutenticacionController::class)->group(function() {
        //Route::get('/miusuario','perfil');
        Route::post('/logout','logout');
    });
    Route::controller(UsuarioController::class)->group( function() {
        Route::post('/usuario','registrar');
        Route::get('/usuarios','listar');
        Route::get('/usuario/{id}','obtener');
        Route::put('/usuario/{id}','actualizar');
        Route::delete('/usuario/{id}','eliminar');
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


