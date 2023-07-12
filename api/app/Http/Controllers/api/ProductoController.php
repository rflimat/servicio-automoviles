<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function listar()
    {
        $productos = Producto::where('estado', 1)->get();
        return $productos;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function registrar(Request $request)
    {
        $request->validate([
            'codigo' => 'unique:App\Models\Producto'
        ]);
        
        $producto = new Producto();
        $producto->codigo = $request->codigo;
        $producto->nombre = $request->nombre;
        $producto->precio_venta = $request->precio_venta;
        $producto->cantidad = $request->cantidad;
        $producto->unidad_medida = $request->unidad_medida;
        $producto->marca = $request->marca;
        $producto->descripcion = $request->descripcion;
        $producto->estado = 1;
        $producto->save();

        return response()->json($producto, 201);
    }

    /**
     * Display the specified resource.
     */
    public function obtener(string $idProducto)
    {
        $producto = Producto::findOrFail($idProducto);
        return $producto;
    }

    /**
     * Update the specified resource in storage.
     */
    public function actualizar(Request $request, string $idProducto)
    {
        $producto = Producto::findOrFail($idProducto);
        $producto->codigo = $request->codigo;
        $producto->nombre = $request->nombre;
        $producto->precio_venta = $request->precio_venta;
        $producto->cantidad = $request->cantidad;
        $producto->unidad_medida = $request->unidad_medida;
        $producto->marca = $request->marca;
        $producto->descripcion = $request->descripcion;
        $producto->save();

        return response()->json($producto, 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function eliminar(string $idProducto)
    {
        $producto = Producto::findOrFail($idProducto);
        $producto->estado = 0;
        $producto->codigo = ""; // elimina el codigo que tenia un producto
        $producto->save();
        return response()->json($producto, 204);
    }
}
