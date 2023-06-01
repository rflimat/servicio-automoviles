<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Comprobante;
use App\Models\Venta;
use Illuminate\Http\Request;

class VentaController extends Controller
{
    public function registrar(Request $request){
        /*$request->validate([
            //'idCliente' => 'required|exists:clientes,id',
            'idProducto' => 'required|exists:productos,id',
        ]);*/
        
        foreach($request->productosVenta as $producto){    
            $venta = new Venta();
            $venta->idCliente = $request["idCliente"];
            $venta->idProducto = $producto["idProducto"];
            $venta->cantidad = $producto["cantidadAct"];
            $venta->estado = 1;
            if($request->nro_comprobante){ 
                $venta->idComprobante = Comprobante::select('id')->where('nro_comprobante',$request->nro_comprobante);
            }
            $venta->importe = $producto["importe"];
            $venta->save();
        }
        return 1; // para prueba
    }

    public function listar(){
        $venta = Venta::select('idComprobante', 'idCliente', 'hora')
        ->selectRaw('DATE_FORMAT(fecha, "%d/%m/%Y") as fecha')
        ->selectRaw('CONCAT(clientes.Nombres, " ", clientes.Apellidos) as nombreCliente')
        ->selectRaw('SUM(importe) as importe')
        ->join('clientes', 'ventas.idCliente', '=', 'clientes.id')
        ->where('estado', 1)
        ->groupBy('idComprobante', 'idCliente', 'hora', 'fecha', 'nombreCliente')
        ->orderBy('fecha', 'desc')
        ->orderBy('hora', 'desc')
        ->get();
        return $venta;
    }
    // es id del comprobante
    public function obtener(string $id) {
        $venta = Venta::select('idCliente', 'fecha', 'hora', 'idComprobante')
        ->selectRaw('CONCAT(clientes.Nombres, " ", clientes.Apellidos) as nombreCliente')
        ->join('clientes', 'ventas.idCliente', '=', 'clientes.id')
        ->where('idComprobante', $id)
        ->first();
        $venta->productosVenta = Venta::select('ventas.id as idVenta', 'productos.id', 'productos.nombre', 'productos.cantidad', 'ventas.cantidad as cantidadAct', 'productos.precio_venta', 'ventas.importe')
            ->join('productos', 'ventas.idProducto', '=', 'productos.id')
            ->where('idComprobante', $id)->get();
        $venta->costo_venta = Venta::where('idComprobante','=',$id)->sum('importe');
        return $venta;
    }

    public function actualizar(Request $request, string $id){ // cambiar
        foreach($request->productosVenta as $producto){
            $venta = Venta::findOrFail($producto["idVenta"]);
            $venta->cantidad = $producto["cantidadAct"];
            $venta->importe = $producto["importe"];
        }
        $venta->save();
        return $venta; // para prueba
    }
    public function eliminar(string $id){
        return Venta::where('idComprobante', $id)
            ->update(['estado' => 0]);
    }
}
