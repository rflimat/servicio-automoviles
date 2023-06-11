<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Comprobante;
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
        $comprobantes = Comprobante::where('eliminado', 0)->get();
        return $comprobantes;
    }

    public function obtener(string $id)
    {
        $comprobante = Comprobante::select('comprobantes.id','nro_comprobante', 'fecha_hora_creacion', 'fecha_hora_cancelacion', 'estado', 'tipos_servicio.id as idServicio', 'tipos_servicio.servicio', 'metodos_pago.id as idMetodo_pago', 'metodos_pago.metodo', 'comprobantes.costo_total')
            ->join('tipos_servicio', 'comprobantes.idServicio', '=', 'tipos_servicio.id')
            ->join('metodos_pago','comprobantes.idMetodo_pago','=','metodos_pago.id')
            ->where('comprobantes.id', $id)
            ->first(); // busca los detalles asignados a un trabajo 
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
