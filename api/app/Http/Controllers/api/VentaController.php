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
        $venta = new Venta();
        $venta->idCliente = $request->idCliente;
        $venta->idProducto = $request->idProducto;
        $venta->cantidad = $request->cantidad;
        $venta->estado = 1;
        if($request->idComprobante){
            $venta->idComprobante = $request->idComprobante;
        }
        $venta->save();
        return $venta; // para prueba
    }

    public function listar(){
        $venta = Venta::where('estado', 1)->get();
        return $venta;
    }

    public function obtener(string $id){
        return Venta::findOrFail($id);
    }

    public function actualizar(Request $request, string $id){ // cambiar
        $venta = Venta::findOrFail($id);
        $venta->idCliente = $request->idCliente;
        $venta->idProducto = $request->idProducto;
        $venta->cantidad = $request->cantidad;
        $venta->estado = 1;
        if($request->idComprobante){
            $venta->idComprobante = $request->idComprobante;
        }
        $venta->save();
        return $venta;
    }

    public function eliminar(string $id){
        $venta = Venta::findOrFail($id);
        $venta->estado = 0;
        $venta->save();
        //Venta::destroy($id);
    }
}
