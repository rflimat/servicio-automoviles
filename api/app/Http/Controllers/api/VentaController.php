<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Comprobante;
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

        foreach ($request->productosVenta as $producto) {
            $venta = new Venta();
            $venta->idCliente = $request["idCliente"];
            $venta->idProducto = $producto["idProducto"];
            $venta->cantidad = $producto["cantidadAct"];
            $venta->estado = 1;

            $comprobante = Comprobante::select('id')->where('nro_comprobante', $request->nro_comprobante)->first();
            if ($comprobante) {
                $venta->idComprobante = $comprobante->id;
                $comprobante->idServicio = ($comprobante->idServicio == 1 && 3);
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

            $venta->importe = $producto["importe"];
            $venta->save();
        }
        return $venta; // para prueba
    }

    public function listar()
    {
        $venta = Venta::select('idComprobante', 'idCliente', 'hora')
            ->selectRaw('DATE_FORMAT(fecha, "%d/%m/%Y") as fecha')
            ->selectRaw('CONCAT(clientes.Nombres, " ", clientes.Apellidos) as nombreCliente')
            ->selectRaw('CONCAT("S/. ", SUM(importe)) as importe')
            ->join('clientes', 'ventas.idCliente', '=', 'clientes.id')
            ->where('estado', 1)
            ->groupBy('idComprobante', 'idCliente', 'hora', 'fecha', 'nombreCliente')
            ->orderBy('fecha', 'desc')
            ->orderBy('hora', 'desc')
            ->get();
        return $venta;
    }
    // es id del comprobante
    public function obtener(string $id)
    {
        $venta = Venta::select('idCliente', 'fecha', 'hora', 'idComprobante', 'comprobantes.nro_comprobante')
            ->selectRaw('CONCAT(clientes.Nombres, " ", clientes.Apellidos) as nombreCliente')
            ->join('clientes', 'ventas.idCliente', '=', 'clientes.id')
            ->join('comprobantes', 'ventas.idComprobante', '=', 'comprobantes.id')
            ->where('idComprobante', $id)
            ->first();
        $venta->productosVenta = Venta::select('ventas.id as idVenta', 'productos.id', 'productos.nombre', 'productos.cantidad', 'ventas.cantidad as cantidadAct', 'ventas.importe')
            ->selectRaw('FORMAT(productos.precio_venta, 2) as precio_venta')
            ->join('productos', 'ventas.idProducto', '=', 'productos.id')
            ->where('idComprobante', $id)->get();
        $venta->costo_venta = Venta::where('idComprobante', '=', $id)->sum('importe');
        return $venta;
    }

    public function actualizar(Request $request, string $id)
    { // cambiar
        foreach ($request->productosVenta as $producto) {
            $venta = Venta::findOrFail($producto["idVenta"]);
            $venta->fecha = $request->fecha;
            $venta->hora = $request->hora;
            $venta->cantidad = $producto["cantidadAct"];
            $venta->importe = $producto["importe"];
        }
        $venta->save();
        return $venta; // para prueba
    }
    public function eliminar(string $id)
    {
        return Venta::where('idComprobante', $id)
            ->update(['estado' => 0]);
    }
}
