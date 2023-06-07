<?php

use App\Http\Controllers\api\AutenticacionController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\ComprasController;
use App\Http\Controllers\api\ComprobanteController;
use App\Http\Controllers\api\ProductoController;
use App\Http\Controllers\api\ProveedoresController;
use App\Http\Controllers\Api\TrabajadorController;
use App\Http\Controllers\api\TrabajoController;
use App\Http\Controllers\api\UsuarioController;
use App\Http\Controllers\Api\VehiculosController;
use App\Http\Controllers\api\VentaController;

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
        Route::get('/clientes', 'index');
        Route::post('/clientes', 'store');
        Route::get('/clientes/{id}', 'show');
        Route::put('/clientes/{id}', 'update');
        Route::delete('/clientes/{id}', 'destroy');
    });

    Route::controller(VehiculosController::class)->group(function (){
        Route::get('/vehiculos', 'index');
        Route::post('/vehiculos', 'store');
        Route::get('/vehiculos/{id}', 'show');
        Route::put('/vehiculos/{id}', 'update');
        Route::delete('/vehiculos/{id}', 'destroy');
    });

    Route::controller(VentaController::class)->group( function() {
        Route::post('/ventas','registrar');
        Route::get('/ventas','listar');
        Route::get('/ventas/{id}','obtener');
        Route::put('/ventas/{id}','actualizar');
        Route::delete('/ventas/{id}','eliminar');
    });

    Route::controller(TrabajadorController::class)->group( function() {
        Route::get('/trabajadores', 'index');
        Route::post('/trabajadores', 'store');
        Route::get('/trabajadores/{id}', 'show');
        Route::put('/trabajadores/{id}', 'update');
        Route::delete('/trabajadores/{id}', 'destroy');
    });
    Route::controller(TrabajoController::class)->group( function() {
        Route::post('/trabajos','registrar');
        Route::get('/trabajos','listar');
        Route::get('/trabajos/{id}','obtener');
        Route::put('/trabajos/{id}','actualizar');
        Route::delete('/trabajos/{id}','eliminar');
        //Route::post('/trabajos/upload','upload');
    });
    Route::controller(ComprobanteController::class)->group( function() {
        Route::post('/comprobantes','registrar');
        Route::get('/comprobantes','listar');
        Route::get('/comprobantes/{id}','obtener');
        Route::put('/comprobantes/{id}','actualizar');
        Route::delete('/comprobantes/{id}','eliminar');
    });
});

Route::post('/trabajos/upload', [TrabajoController::class, 'upload']);