<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Comprobante;
use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Models\Venta;
use Illuminate\Http\Request;

class VentaController extends Controller
{
    
    public function registrar(Request $request)
    {
        /*$request->validate([
            //'idCliente' => 'required|exists:clientes,id',
            'idProducto' => 'required|exists:productos,id',
        ]);*/

        // validaciones
        $ids = [];
        foreach($request->productosVenta as $clave) {
            if(in_array($clave['idProducto'],$ids)){ // si es que el id se encuentra
                return response()->json(['message' => 'Error: Existen productos iguales'],404);
            }else{
                $ids[] = $clave['idProducto'];
                $ProductosExistentes = Producto::findOrFail($clave['idProducto']);
                if($ProductosExistentes->cantidad - $clave['cantidad'] <0){
                    return response()->json(['message' => 'Error: Cantidad sobrepasa el stock existente'],404);
                }
            }
        }


        $venta = new Venta();
        $venta->idCliente = $request->idCliente;
        $venta->total_importe = $request->total_importe;
        $venta->estado = 1; // 1 quiere decir que no esta eliminado
        
        $comprobante = Comprobante::select('id')->where('nro_comprobante', $request->nro_comprobante)->first();
        if ($comprobante) {
            $venta->idComprobante = $comprobante->id;
            //$comprobante->idServicio = ($comprobante->idServicio == 1 && 3);
            $comprobante->idServicio = 3;
            $comprobante->save();
        } else {
            $nuevo_comprobante = new Comprobante();
            $nuevo_comprobante->idServicio = 2; // Id de tipo de servicio de ventas
            $nuevo_comprobante->idMetodo_pago = 3; // Id del metodo de pago (Convencional por defecto)
            $nuevo_comprobante->fecha_hora_creacion = $request->fecha_venta;
            $nuevo_comprobante->nro_comprobante = $request->nro_comprobante ? $request->nro_comprobante : "";
            $nuevo_comprobante->estado = 0;
            $nuevo_comprobante->eliminado = 0;
            $nuevo_comprobante->save();
            $venta->idComprobante = $nuevo_comprobante->id;
        }

        $venta->save();
        foreach($request->productosVenta as $productoVendido) {
            $detalleVenta = new DetalleVenta();
            $detalleVenta->idVenta = $venta->id;
            $detalleVenta->idProducto = $productoVendido['idProducto'];
            $detalleVenta->cantidad = $productoVendido['cantidad'];
            $detalleVenta->importe = $productoVendido['importe'];
            $detalleVenta->save();
        }
        
        return response()->json($venta->id);
    }


    public function listar()
    {
        $venta = Venta::select('ventas.id','ventas.idComprobante', 'idCliente', 'hora','total_importe')
            ->selectRaw('DATE_FORMAT(fecha, "%d/%m/%Y") as fecha')
            ->selectRaw('CONCAT(clientes.Nombres, " ", clientes.Apellidos) as nombreCliente')
            ->join('clientes', 'ventas.idCliente', '=', 'clientes.id')
            ->where('estado', 1)
            ->get();
        return $venta;
        
    }
    // es id de la venta
    public function obtener(string $id)
    {
        $venta = Venta::select('idCliente', 'fecha', 'hora', 'idComprobante', 'comprobantes.nro_comprobante','total_importe')
            ->selectRaw('CONCAT(clientes.Nombres, " ", clientes.Apellidos) as nombreCliente')
            ->join('clientes', 'ventas.idCliente', '=', 'clientes.id')
            ->join('comprobantes', 'ventas.idComprobante', '=', 'comprobantes.id')
            ->where('ventas.id', $id)
            ->first();
        $venta->productosVenta = DetalleVenta::select('detalle_ventas.id', 'idProducto', 'productos.nombre as producto', 'productos.cantidad as CantidadDisp', 'detalle_ventas.cantidad as CantidadVenta', 'importe')
            ->selectRaw('FORMAT(productos.precio_venta, 2) as precio_venta')
            ->join('productos', 'detalle_ventas.idProducto', '=', 'productos.id')
            ->where('idVenta', $id)->get();
        return $venta;
    }

    public function actualizar(Request $request, string $id)
    { // cambiar
        // evita que existan los productos en cantidades negativas
        foreach($request->productosVenta as $clave) {
            $ProductosExistentes = Producto::findOrFail($clave['idProducto']);
            $detalleActual = DetalleVenta::where('idVenta', $id)
            ->where('idProducto', $clave['idProducto'])
            ->first();
            if(($ProductosExistentes->cantidad - $clave['CantidadVenta'] +$detalleActual->cantidad) <0){
                return response()->json(['message' => 'Error: Cantidad sobrepasa el stock existente'],404);
            }
        }
        $venta = Venta::findOrFail($id);
        $venta->idCliente = $request->idCliente;
        $venta->estado = 1; // 1 quiere decir que no esta eliminado
        $venta->total_importe = $request->total_importe;
        $venta->save();

        foreach($request->productosVenta as $productoVendido) {
            $detalleVenta = DetalleVenta::where('idVenta', $id)
            ->where('idProducto', $productoVendido['idProducto'])
            ->first();
            if ($detalleVenta) {
                $detalleVenta->idProducto = $productoVendido['idProducto'];
                $detalleVenta->cantidad = $productoVendido['CantidadVenta'];
                $detalleVenta->importe = $productoVendido['importe'];
                $detalleVenta->save();
            }
        }

        return response()->json($venta->id);
    }
    public function eliminar(string $id)
    {
        $venta = Venta::findOrFail($id);
        $venta->estado = 0;
        $venta->save();
    }
}
