<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\DetalleTrabajo;
use App\Models\Evidencias;
use App\Models\Trabajo;
use Illuminate\Http\Request;
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
        $trabajo->problema_inicial = $request->problema_inicial;
        $trabajo->fecha_hora_ingreso = $request->fecha_hora_ingreso;
        $trabajo->fecha_hora_salida = $request->fecha_hora_salida;
        $trabajo->costo = $request->costo;
        if($request->idComprobante){
            $trabajo->idComprobante = $request->idComprobante;
        }
        $trabajo->estado = 1;
        $trabajo->save();

        // recorre los detalles del trabajo en la variable $trabajos 
        foreach ($request->detalles as $trabajos) {
            $detalleTrabajo = new DetalleTrabajo();
            $detalleTrabajo->idTrabajo = $trabajo->id;
            $detalleTrabajo->idVehiculo = $trabajos['idVehiculo'];
            $detalleTrabajo->idCliente = $trabajos['idCliente'];
            $detalleTrabajo->descripcion = $trabajos['descripcion'];
            $detalleTrabajo->fecha = $trabajos['fecha'];
            $detalleTrabajo->hora = $trabajos['hora'];
            $detalleTrabajo->save();
        }
        foreach ($request->evidencias as $evidencias) {
            $evidenciasTrabajo = new Evidencias();
            $evidenciasTrabajo->idTrabajo = $trabajo->id;
            $evidenciasTrabajo->ruta = $evidencias['ruta'];
            $evidenciasTrabajo->save();
        }
        return $trabajo; // para prueba
    }

    public function listar()
    {
        $trabajos = Trabajo::where('estado', 1)->get();
        return $trabajos;
    }

    public function obtener(string $id)
    {
        $trabajo = Trabajo::findOrFail($id); // busca el id de trabajo y lo retorna
        $trabajo->detalles = DetalleTrabajo::select('detalle_trabajos.id', 'idVehiculo', 'idCliente', 'descripcion', 'fecha', 'hora')
            ->join('trabajos', 'trabajos.id', '=', 'detalle_trabajos.idTrabajo')
            ->where('idTrabajo', $id)
            ->get(); // busca los detalles asignados a un trabajo 
        $trabajo->evidencias = Evidencias::select('evidencias.id','ruta')
            ->join('trabajos', 'trabajos.id', '=', 'evidencias.idTrabajo')
            ->where('idTrabajo',$id)
            ->get();
        return $trabajo; // retorna
    }
    public function actualizar(Request $request, string $id)
    { // cambiar
        // busca el trabajo y lo asigna a la variable $trabajo
        $trabajo = Trabajo::findOrFail($id);
        $trabajo->idTrabajador = $request->idTrabajador;
        $trabajo->problema_inicial = $request->problema_inicial;
        $trabajo->fecha_hora_ingreso = $request->fecha_hora_ingreso;
        $trabajo->fecha_hora_salida = $request->fecha_hora_salida;
        $trabajo->costo = $request->costo;
        if($request->idComprobante){
            $trabajo->idComprobante = $request->idComprobante;
        }
        $trabajo->save();
        //actualiza datos y los guarda con save

        foreach ($request->detalles as $trabajos) {
            $detalleTrabajo = DetalleTrabajo::where('idTrabajo', $id)
                ->where('id', $trabajos['id'])
                ->first();

            if ($detalleTrabajo) {
                $detalleTrabajo->idVehiculo = $trabajos['idVehiculo'];
                $detalleTrabajo->idCliente = $trabajos['idCliente'];
                $detalleTrabajo->descripcion = $trabajos['descripcion'];
                $detalleTrabajo->fecha = $trabajos['fecha'];
                $detalleTrabajo->hora = $trabajos['hora'];
                $detalleTrabajo->save();
            }
        }

        foreach($request->evidencias as $evidencias){
            $evidenciasTrabajo = Evidencias::where('idTrabajo', $id)
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
        $trabajo->estado = 0;
        $trabajo->save();
    }
}
