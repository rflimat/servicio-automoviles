<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use Illuminate\Http\Request;

class VentaController extends Controller
{
    public function registrar(Request $request){
        $request->validate([
            //'idCliente' => 'required|exists:clientes,id',
            'idProducto' => 'required|exists:productos,id',
        ]);
        
        foreach($request->productosVenta as $producto){
            $venta = new Venta();
            $venta->idCliente = $request->idCliente;
            $venta->idProducto = $producto->idProducto;
            $venta->cantidad = $producto->cantidad;
            $venta->estado = 1;
            if($request->idComprobante){
                $venta->idComprobante = $request->idComprobante;
            }
            $venta->importe = $producto->importe;
        }
        $venta->save();
        return $venta; // para prueba
    }

    public function listar(){
        $venta = Venta::where('estado', 1)->get();
        return $venta;
    }
    // es id del comprobante
    public function obtener(string $id){
        return Venta::select('idCliente','idProducto','cantidad','fecha','hora','idComprobante','importe')
        ->where('idComprobante','=',$id);
    }

    public function actualizar(Request $request, string $id){ // cambiar
        foreach($request->productosVenta as $producto){
            $venta = Venta::findOrFail($producto->id);
            $venta->cantidad = $producto->cantidad;
            $venta->importe = $producto->importe;
        }
        $venta->save();
        return $venta; // para prueba
    }
    public function eliminar(string $id){
        $venta = Venta::findOrFail($id);
        $venta->estado = 0;
        $venta->save();
        //Venta::destroy($id);
    }
}
