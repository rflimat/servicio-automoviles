<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Comprobante;
use App\Models\DetalleTrabajo;
use App\Models\DetalleVenta;
use App\Models\Trabajo;
use App\Models\Venta;
use Illuminate\Http\Request;

class ComprobanteController extends Controller
{
    public function registrar(Request $request)
    {
        $request->validate([
            'idServicio' => ['bail','required','exists:tipos_servicio,id'],
            'idMetodo_pago' => ['bail','required','exists:metodos_pago,id'],
            'nro_comprobante' => 'unique:App\Models\Comprobante'
        ]);
        $comprobante = new Comprobante();
        $comprobante->fecha_hora_creacion = $request->fecha_hora_creacion;
        $comprobante->nro_comprobante = $request->nro_comprobante;
        $comprobante->fecha_hora_cancelacion = $request->fecha_hora_cancelacion;
        $comprobante->idServicio = $request->idServicio;
        $comprobante->idMetodo_pago = $request->idMetodo_pago;
        $comprobante->estado = $request->estado;
        $comprobante->eliminado = 0;
        $comprobante->costo_total = 0;
        $comprobante->save();
        /*
        $total_trabajos_lista = DB::table('trabajos')
            ->where('id',
                Comprobante::select(comprobante.id)->where(nro_comprobante,$request->nro_comprobante))
        */
    }

    public function listar()
    {
        $comprobantes = Comprobante::select('comprobantes.id','nro_comprobante','fecha_hora_creacion','fecha_hora_cancelacion','idServicio','servicio','idMetodo_pago','metodo','estado','costo_total')
            ->join('tipos_servicio','idServicio','=','tipos_servicio.id')
            ->join('metodos_pago','idMetodo_pago','=','metodos_pago.id')
            ->where('eliminado', 0)
            ->get();
        foreach($comprobantes as $comprobante){
            $comprobante['ventas'] = Venta::select('ventas.id','fecha','hora','total_importe')
                ->selectRaw('CONCAT(clientes.Nombres, " ", clientes.Apellidos) as nombreCliente')
                ->join('clientes', 'ventas.idCliente', '=', 'clientes.id')
                ->where('idComprobante', $comprobante->id)
                ->where('estado','1')
                ->get();
            foreach($comprobante['ventas'] as $venta){
                $venta['productosVenta'] = DetalleVenta::select('detalle_ventas.id','productos.nombre','detalle_ventas.cantidad','detalle_ventas.descripcion','importe')
                ->join('productos', 'detalle_ventas.idProducto', '=', 'productos.id')
                ->where('detalle_ventas.idVenta', $venta['id'])
                ->get();
            }
            // trabajos
            $comprobante['trabajos'] = Trabajo::select('trabajos.id','idVehiculo','placa','problema_inicial','fecha_hora_ingreso','fecha_hora_salida','costo','estado','idTrabajador')
                ->selectRaw('CONCAT(trabajadors.Nombres, " ", trabajadors.Apellidos) as nombreTrabajador')
                ->join('trabajadors', 'trabajos.idTrabajador', '=', 'trabajadors.id')
                ->join('vehiculos','trabajos.idVehiculo','=','vehiculos.id')
                ->where('idComprobante', $comprobante->id)
                ->where('eliminado','0')
                ->get();
            foreach($comprobante['trabajos'] as $trabajos){
                $trabajos['detalleTrabajo'] = DetalleTrabajo::select('id','descripcion','fecha_hora','costo')
                ->where('detalle_trabajos.idTrabajo', $trabajos['id'])
                ->get();
            }

        }
        return $comprobantes;
    }

    public function obtener(string $id)
    {
        
        $comprobante = Comprobante::select('comprobantes.id','nro_comprobante','fecha_hora_creacion','fecha_hora_cancelacion','idServicio','servicio','idMetodo_pago','metodo','estado','costo_total')
            ->join('tipos_servicio','idServicio','=','tipos_servicio.id')
            ->join('metodos_pago','idMetodo_pago','=','metodos_pago.id')
            ->where('comprobantes.id', $id)
            ->first();

        $comprobante['ventas'] = Venta::select('ventas.id','fecha','hora','total_importe')
        ->selectRaw('CONCAT(clientes.Nombres, " ", clientes.Apellidos) as nombreCliente')
        ->join('clientes', 'ventas.idCliente', '=', 'clientes.id')
        ->where('idComprobante', $comprobante->id)
        ->where('estado','1')
        ->get();
        foreach($comprobante['ventas'] as $venta){
            $venta['productosVenta'] = DetalleVenta::select('detalle_ventas.id','productos.nombre','detalle_ventas.cantidad','detalle_ventas.descripcion','importe')
            ->join('productos', 'detalle_ventas.idProducto', '=', 'productos.id')
            ->where('detalle_ventas.idVenta', $venta['id'])
            ->get();
        }
        // trabajos
        $comprobante['trabajos'] = Trabajo::select('trabajos.id','idVehiculo','placa','problema_inicial','fecha_hora_ingreso','fecha_hora_salida','costo','estado','idTrabajador')
            ->selectRaw('CONCAT(trabajadors.Nombres, " ", trabajadors.Apellidos) as nombreTrabajador')
            ->join('trabajadors', 'trabajos.idTrabajador', '=', 'trabajadors.id')
            ->join('vehiculos','trabajos.idVehiculo','=','vehiculos.id')
            ->where('idComprobante', $comprobante->id)
            ->where('eliminado','0')
            ->get();
        foreach($comprobante['trabajos'] as $trabajos){
            $trabajos['detalleTrabajo'] = DetalleTrabajo::select('id','descripcion','fecha_hora','costo')
            ->where('detalle_trabajos.idTrabajo', $trabajos['id'])
            ->get();
        }
        return $comprobante; // retorna
    }
    public function actualizar(Request $request, string $id)
    { // cambiar
        $comprobante = Comprobante::findOrFail($id);
        $comprobante->fecha_hora_creacion = $request->fecha_hora_creacion;
        $comprobante->nro_comprobante = $request->nro_comprobante;
        $comprobante->fecha_hora_cancelacion = $request->fecha_hora_cancelacion;
        $comprobante->idServicio = $request->idServicio;
        $comprobante->idMetodo_pago = $request->idMetodo_pago;
        $comprobante->estado = $request->estado;
        $comprobante->eliminado = 0;
        $comprobante->save();

        return $comprobante;
    }

    public function eliminar(string $id)
    {
        $comprobante = Comprobante::findOrFail($id);
        $comprobante->eliminado = 1;
        $comprobante->save();
    }
}
