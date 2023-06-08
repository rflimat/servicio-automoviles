<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Comprobante;
use App\Models\DetalleTrabajo;
use App\Models\TrabajoEvidencia;
use App\Models\Trabajo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
// controla los modelos DetalleTrabajo, Evidencias y trabajo

class TrabajoController extends Controller
{
    public function registrar(Request $request)
    {
        $request->validate([
            //'idTrabajador' => 'required|exists:trabajadors,id',
        ]);
        $trabajo = new Trabajo();
        $trabajo->idTrabajador = $request->idTrabajador;
        $trabajo->idVehiculo = $request->idVehiculo;
        $trabajo->problema_inicial = $request->problema_inicial;
        $trabajo->fecha_hora_ingreso = $request->fecha_hora_ingreso;
        $trabajo->fecha_hora_salida = $request->fecha_hora_salida;
        $trabajo->costo = $request->costo;
        if ($request->nro_comprobante) {
            $comprobante = Comprobante::select('id')->where('nro_comprobante', $request->nro_comprobante)->first();
            if ($comprobante) {
                $trabajo->idComprobante = $comprobante->id;
            } else {
                $nuevo_comprobante = new Comprobante();
                $nuevo_comprobante->nro_comprobante = $request->nro_comprobante;
                $nuevo_comprobante->save();
                $trabajo->idComprobante = $nuevo_comprobante->id;
            }
        }
        $trabajo->estado = $request->estado;
        $trabajo->eliminado = 0;
        $trabajo->save();

        // recorre los detalles del trabajo en la variable $trabajos 
        foreach ($request->detalleTrabajo as $trabajos) {
            $detalleTrabajo = new DetalleTrabajo();
            $detalleTrabajo->idTrabajo = $trabajo->id;
            $detalleTrabajo->descripcion = $trabajos['descripcion'];
            $detalleTrabajo->fecha_hora = $trabajos['fecha_hora'];
            $detalleTrabajo->costo = $trabajos['costo'];
            $detalleTrabajo->save();
        }
        foreach ((array) $request->evidencias as $evidencias) {
            $evidenciasTrabajo = new TrabajoEvidencia();
            $evidenciasTrabajo->idTrabajo = $trabajo->id;
            $evidenciasTrabajo->ruta = $evidencias['ruta'];
            $evidenciasTrabajo->save();
        }
        return $trabajo; // para prueba
    }

    public function listar()
    {
        $trabajos = Trabajo::select('trabajos.id', 'fecha_hora_ingreso', 'vehiculos.placa as vehiculo')
            ->selectRaw('CONCAT("S/. ", FORMAT(costo, 2)) as costo')
            ->selectRaw('CONCAT(clientes.Nombres, " ", clientes.Apellidos) as cliente')
            ->selectRaw('IF(estado >= 1, "Finalizado", "Iniciado") AS estado')
            ->join('vehiculos', 'vehiculos.id', '=', 'trabajos.idVehiculo')
            ->join('clientes', 'clientes.id', '=', 'vehiculos.cliente_id')
            ->where('eliminado', 0)
            ->get();
        return $trabajos;
    }

    public function obtener(string $id)
    {
        $trabajo = Trabajo::select('trabajos.id', 'idVehiculo', 'idTrabajador', 'fecha_hora_ingreso', 'fecha_hora_salida', 'problema_inicial')
            ->selectRaw('IF(estado >= 1, "Finalizado", "Iniciado") AS estado')
            ->where('id', $id)
            ->first(); // busca el id de trabajo y lo retorna
        $trabajo->detalleTrabajo = DetalleTrabajo::select('detalle_trabajos.id', 'descripcion', 'fecha_hora')
            ->selectRaw('FORMAT(detalle_trabajos.costo, 2) as costo')
            ->join('trabajos', 'trabajos.id', '=', 'detalle_trabajos.idTrabajo')
            ->where('idTrabajo', $id)
            ->get(); // busca los detalles asignados a un trabajo 
        $trabajo->evidencias = TrabajoEvidencia::select('trabajo_evidencias.id', 'ruta')
            ->join('trabajos', 'trabajos.id', '=', 'trabajo_evidencias.idTrabajo')
            ->where('idTrabajo', $id)
            ->get();
        return $trabajo; // retorna
    }
    public function actualizar(Request $request, string $id)
    { // cambiar
        // busca el trabajo y lo asigna a la variable $trabajo
        $trabajo = Trabajo::findOrFail($id);
        $trabajo->idTrabajador = $request->idTrabajador;
        $trabajo->idVehiculo = $request->idVehiculo;
        $trabajo->problema_inicial = $request->problema_inicial;
        $trabajo->fecha_hora_ingreso = $request->fecha_hora_ingreso;
        $trabajo->fecha_hora_salida = $request->fecha_hora_salida;
        $trabajo->costo = $request->costo;
        if ($request->nro_comprobante) {
            $comprobante = Comprobante::select('id')->where('nro_comprobante', $request->nro_comprobante);
            if ($comprobante) {
                $trabajo->idComprobante = $comprobante;
            } else {
                $nuevo_comprobante = new Comprobante();
                $nuevo_comprobante->idServicio = 1; // Id de tipo de servicio de trabajo
                $nuevo_comprobante->idMetodo_pago = 3; // Id del metodo de pago (Convencional por defecto)
                $nuevo_comprobante->fecha_hora_creacion = $request->fecha_hora_ingreso;
                $nuevo_comprobante->nro_comprobante = $request->nro_comprobante;
                $nuevo_comprobante->estado = 0;
                $nuevo_comprobante->eliminado = 0;
                $nuevo_comprobante->save();
                $trabajo->idComprobante = $nuevo_comprobante->id;
            }
        }
        $trabajo->estado = $request->estado;
        $trabajo->save();
        //actualiza datos y los guarda con save

        foreach ($request->detalleTrabajo as $trabajos) {
            if (isset($trabajos['id'])) {
                $detalleTrabajo = DetalleTrabajo::where('idTrabajo', $id)
                    ->where('id', $trabajos['id'])
                    ->first();
                $detalleTrabajo->descripcion = $trabajos['descripcion'];
                $detalleTrabajo->fecha_hora = $trabajos['fecha_hora'];
                $detalleTrabajo->costo = $trabajos['costo'];
                $detalleTrabajo->save();
            } else {
                $detalleTrabajo = new DetalleTrabajo();
                $detalleTrabajo->idTrabajo = $trabajo->id;
                $detalleTrabajo->descripcion = $trabajos['descripcion'];
                $detalleTrabajo->fecha_hora = $trabajos['fecha_hora'];
                $detalleTrabajo->costo = $trabajos['costo'];
                $detalleTrabajo->save();
            }
        }

        foreach ((array) $request->evidencias as $evidencias) {
            $evidenciasTrabajo = TrabajoEvidencia::where('idTrabajo', $id)
                ->where('id', $evidencias['id'])
                ->first();
            $evidenciasTrabajo->ruta = $evidencias['ruta'];
            $evidenciasTrabajo->save();
        }
        return $trabajo; // para prueba
    }

    public function eliminar(string $id)
    {
        //Trabajo::destroy($id);
        $trabajo = Trabajo::findOrFail($id);
        $trabajo->eliminado = 1;
        $trabajo->save();
    }

    public function upload(Request $request) {
        if($request->hasFile("file")){
            $file = $request->file('file');
            $ruta = '/trabajos/'. $request->id;
            /*foreach (array($request->file) as $archivo) {
                Storage::disk('local')->put($ruta, $archivo);
            }*/
        }
        return 1;
    }
}
