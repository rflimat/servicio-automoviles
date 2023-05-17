<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Compra;
use App\Models\DetalleCompra;
use Illuminate\Http\Request;


class ComprasController extends Controller
{

    public function index(Request $request)
    {
        return Compra::select('compras.id', 'fecha_compra', 'fecha_recepcion', 'costo_compra', 'estado', 'proveedor_id')
        ->join('proveedores', 'compras.proveedor_id', '=', 'proveedores.id')
        ->where('estado', 1)
        ->orderBy('fecha_pedido')
        ->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $compra = new Compra();
        $compra->fecha_compra = $request->fecha_compra;
        $compra->fecha_recepcion = $request->fecha_recepcion;
        $compra->costo_compra = $request->costo_compra;
        $compra->proveedor_id = $request->proveedor_id;
        $compra->estado = 1;
        $compra->eliminado = 0;
        $compra->save();

        foreach($request->productosCompra as $producto) {
            $detallecompra = new DetalleCompra();
            $detallecompra->compra_id = $compra->id;
            $detallecompra->producto_id = $producto['id'];
            $detallecompra->descripcion = $producto['observacion'];
            $detallecompra->cantidad = $producto['cantidad'];
            $detallecompra->precio = $producto['precio'];
            $detallecompra->importe = $producto['importe'];
            $detallecompra->save();
        }

        return response()->json($compra->id);
    }

    public function show($id)
    {
        $compra = Compra::select('compras.id', 'fecha_compra', 'fecha_recepcion', 'costo_compra', 'estado', 'proveedor_id')
        ->join('proveedores', 'compras.proveedor_id', '=', 'proveedores.id')
        ->where('estado', 1)
        ->where('compras.id', $id)
        ->first();
        $compra->productos = DetalleCompra::select('productos.description', 'detalleproducto.quantity', 'productos.unidad_medida', 'detalle_compra.precio', 'detalle_compra.importe')
            ->join('productos', 'detalle_compra.producto_id', '=', 'productos.id')
            ->where('compra_id', $id)->get();
        return $compra;
    }

    public function update(Request $request,$id)
    {

    $compra = Compra::findOrFail($id);
    $compra->fecha_compra = $request->fecha_compra;
    $compra->fecha_recepcion = $request->fecha_recepcion;
    $compra->proveedor_id = $request->proveedor_id;
    $compra->costo_compra = $request->costo_compra;
    $compra->save();

  
    foreach ($request->productosCompra as $producto) {
        $detallecompra = DetalleCompra::where('compra_id', $id)
            ->where('producto_id', $producto['id'])
            ->first();

        if ($detallecompra) {

            $detallecompra->cantidad = $producto['cantidad'];
            $detallecompra->precio = $producto['precio_venta'];
            $detallecompra->importe = $producto['importe'];
            $detalleCompra->save();
        }
    }

    return response()->json($compra->id);
    }
    

    public function destroy($id)
    {
        $compra = Compra::findOrFail($id);
        $compra->eliminado = 1;
        $compra->save();
        return 1;
    }
}
