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
                if($ProductosExistentes->cantidad - $clave['cantidadAct'] <0 or $ProductosExistentes->cantidad == 0){
                    return response()->json(['message' => 'Error: Cantidad sobrepasa el stock existente STOCK ACTUAL: '. $ProductosExistentes->cantidad ],404);
                }
            }
        }
        if($request->nro_comprobante){
            $comprobante = Comprobante::select('idVenta')->where('nro_comprobante', $request->nro_comprobante)->first();
            if($comprobante && $comprobante->idVenta != NULL){
                // si es que el campo esa ocupado lanza un mensaje de error
                return response()->json(['message' => 'Error: Comprobante ya esta asociado a una venta'],404);
            }
        }
         // fin validaciones

        $venta = new Venta();
        $venta->idCliente = $request->idCliente;
        $venta->total_importe = $request->total_importe;
        $venta->estado = 1; // 1 quiere decir que no esta eliminado
        $venta->save();

        if($request->nro_comprobante){
            // Si es que se envia el nro de comprobante entonces busca un comprobante con el mismo numero para asociarlo
            $comprobante = Comprobante::select('id')->where('nro_comprobante', $request->nro_comprobante)->first();
            if($comprobante){
                // si es que el campo de comprobante sta vacio entonces se agrega el id de la venta
                    $comprobante->idVenta = $venta->id;
                    $comprobante->idServicio = $comprobante->idServicio = 1 ? 3 : 2;
                    $comprobante->save();
            }else{
                // en el caso de que se envia un numero de comprobante y no se encuentra se crea uno
                $comprobante = new Comprobante();
                $comprobante->idServicio = 2; // Id de tipo de servicio de ventas
                $comprobante->idMetodo_pago = 3; // Id del metodo de pago (Convencional por defecto)
                $comprobante->fecha_hora_creacion = now();
                $comprobante->nro_comprobante = $request->nro_comprobante; 
                $comprobante->estado = 0;
                $comprobante->eliminado = 0;
                $comprobante->idVenta = $venta->id;
                $comprobante->save();
            }

        }else{
            // caso de que no se envia un comprobante solo se crea uno con un numero null
            $comprobante = new Comprobante();
            $comprobante->idServicio = 2; // Id de tipo de servicio de ventas
            $comprobante->idMetodo_pago = 3; // Id del metodo de pago (Convencional por defecto)
            $comprobante->fecha_hora_creacion = now();
            $comprobante->nro_comprobante = NULL; 
            $comprobante->estado = 0;
            $comprobante->eliminado = 0;
            $comprobante->idVenta = $venta->id;
            $comprobante->save();
        }

        foreach($request->productosVenta as $productoVendido) {
            $detalleVenta = new DetalleVenta();
            $detalleVenta->idVenta = $venta->id;
            $detalleVenta->idProducto = $productoVendido['idProducto'];
            $detalleVenta->cantidad = $productoVendido['cantidadAct'];
            $detalleVenta->importe = $productoVendido['importe'];
            $detalleVenta->save();
        }
        
        return response()->json(['id' =>$venta->id, 'idComprobante' => $comprobante->id], 201);
    }


    public function listar()
    {
        $venta = Venta::select('ventas.id', 'idCliente', 'hora','total_importe')
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
        $venta = Venta::select('idCliente', 'fecha', 'hora','total_importe')
            ->selectRaw('CONCAT(clientes.Nombres, " ", clientes.Apellidos) as nombreCliente')
            ->join('clientes', 'ventas.idCliente', '=', 'clientes.id')
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
        if ($request->productosVenta) {
            foreach($request->productosVenta as $clave) {
                $ProductosExistentes = Producto::findOrFail($clave['idProducto']);
                $detalleActual = DetalleVenta::where('idVenta', $id)
                ->where('idProducto', $clave['idProducto'])
                ->first();
                if(($ProductosExistentes->cantidad - $clave['CantidadVenta'] +$detalleActual->cantidad) <0){
                    return response()->json(['message' => 'Error: Cantidad sobrepasa el stock existente'],404);
                }
            }
        }
        $venta = Venta::findOrFail($id);
        $venta->estado = 1; // 1 quiere decir que no esta eliminado
        $venta->total_importe = $request->total_importe;
        $venta->save();

        if ($request->productosVenta) {
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
        }

        $comprobante = Comprobante::where('idVenta','=',$venta->id)->first();

        return response()->json(['id' => $venta->id, 'idComprobante' => $comprobante->id, 'nroComprobante' => $comprobante->nro_comprobante], 201);
    }
    public function eliminar(string $id)
    {
        $venta = Venta::findOrFail($id);
        $venta->estado = 0;
        $venta->save();
        return response()->json($venta, 204);
    }
}
