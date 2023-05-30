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
        return Compra::select('compras.id', 'fecha_compra', 'fecha_recepcion', 'costo_compra', 'proveedor_id', 'proveedores.nombre as nombreProveedor')
        ->selectRaw('IF(estado >= 1, "Recepcionado", "Registrado") AS estado')
        ->join('proveedores', 'compras.proveedor_id', '=', 'proveedores.id')
        ->where('eliminado', 0)
        ->orderBy('fecha_compra', 'desc')
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
        $compra->estado = $request->estado;
        $compra->eliminado = 0;
        $compra->save();

        foreach($request->productosCompra as $producto) {
            $detalleCompra = new DetalleCompra();
            $detalleCompra->compra_id = $compra->id;
            $detalleCompra->producto_id = $producto['id'];
            $detalleCompra->descripcion = $producto['observacion'];
            $detalleCompra->cantidad = $producto['cantidad'];
            $detalleCompra->precio = $producto['precio'];
            $detalleCompra->importe = $producto['importe'];
            $detalleCompra->save();
        }

        return response()->json($compra->id);
    }

    public function show($id)
    {
        $compra = Compra::select('compras.id', 'fecha_compra', 'fecha_recepcion', 'costo_compra', 'proveedor_id', 'proveedores.nombre as nombreProveedor')
        ->selectRaw('IF(estado >= 1, "Recepcionado", "Registrado") AS estado')
        ->join('proveedores', 'compras.proveedor_id', '=', 'proveedores.id')
        ->where('compras.id', $id)
        ->first();
        $compra->productosCompra = DetalleCompra::select('productos.id', 'productos.nombre', 'detalle_compras.descripcion as observacion', 'detalle_compras.cantidad', 'productos.unidad_medida', 'detalle_compras.precio', 'detalle_compras.importe')
            ->join('productos', 'detalle_compras.producto_id', '=', 'productos.id')
            ->where('compra_id', $id)->get();
        return $compra;
    }

    public function update(Request $request,$id)
    {

    $compra = Compra::findOrFail($id);
    $compra->fecha_compra = $request->fecha_compra;
    $compra->fecha_recepcion = $request->fecha_recepcion;
    $compra->costo_compra = $request->costo_compra;
    $compra->estado = $request->estado;
    $compra->save();

  
    foreach ($request->productosCompra as $producto) {
        $detalleCompra = DetalleCompra::where('compra_id', $id)
            ->where('producto_id', $producto['id'])
            ->first();

        if ($detalleCompra) {
            $detalleCompra->cantidad = $producto['cantidad'];
            $detalleCompra->precio = $producto['precio'];
            $detalleCompra->importe = $producto['importe'];
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
