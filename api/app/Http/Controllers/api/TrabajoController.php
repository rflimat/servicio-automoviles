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
        /*
        $request->validate([
            //'idTrabajador' => 'required|exists:trabajadors,id',
        ]);
        */

        // validaciones
        if($request->nro_comprobante){
            $comprobante = Comprobante::select('idTrabajo')->where('nro_comprobante', $request->nro_comprobante)->first();
            if($comprobante && $comprobante->idTrabajo != NULL){
                // si es que el campo esa ocupado lanza un mensaje de error
                return response()->json(['message' => 'Error: Comprobante ya esta asociado a un trabajo'],404);
            }
        }
        // fin validacoines

        $trabajo = new Trabajo();
        $trabajo->idTrabajador = $request->idTrabajador;
        $trabajo->idVehiculo = $request->idVehiculo;
        $trabajo->problema_inicial = $request->problema_inicial;
        $trabajo->fecha_hora_ingreso = $request->fecha_hora_ingreso;
        $trabajo->fecha_hora_salida = $request->fecha_hora_salida;
        $trabajo->costo = $request->costo;
        $trabajo->estado = $request->estado;
        $trabajo->eliminado = 0;
        $trabajo->save();

        if($request->nro_comprobante){
            // Si es que se envia el nro de comprobante entonces busca un comprobante con el mismo numero para asociarlo
            $comprobante = Comprobante::select('id')->where('nro_comprobante', $request->nro_comprobante)->first();
            if($comprobante){
                // si es que el campo de comprobante sta vacio entonces se agrega el id de la venta
                    $comprobante->idTrabajo = $trabajo->id;
                    $comprobante->idServicio = $comprobante->idServicio = 2 ? 3 : 1;
                    $comprobante->save();
            }else{
                // en el caso de que se envia un numero de comprobante y no se encuentra se crea uno
                $comprobante = new Comprobante();
                $comprobante->idServicio = 1; // Id de tipo de servicio de trabajos
                $comprobante->idMetodo_pago = 3; // Id del metodo de pago (Convencional por defecto)
                $comprobante->fecha_hora_creacion = now();
                $comprobante->nro_comprobante = $request->nro_comprobante; 
                $comprobante->estado = 0;
                $comprobante->eliminado = 0;
                $comprobante->idTrabajo = $trabajo->id;
                $comprobante->save();
            }

        }else{
            // caso de que no se envia un comprobante solo se crea uno con un numero null
            $comprobante = new Comprobante();
            $comprobante->idServicio = 1; // Id de tipo de servicio de trabajos
            $comprobante->idMetodo_pago = 3; // Id del metodo de pago (Convencional por defecto)
            $comprobante->fecha_hora_creacion = now();
            $comprobante->nro_comprobante = NULL; 
            $comprobante->estado = 0;
            $comprobante->eliminado = 0;
            $comprobante->idTrabajo = $trabajo->id;
            $comprobante->save();
        }

        // recorre los detalles del trabajo en la variable $trabajos 
        foreach ($request->detalleTrabajo as $trabajos) {
            $detalleTrabajo = new DetalleTrabajo();
            $detalleTrabajo->idTrabajo = $trabajo->id;
            $detalleTrabajo->descripcion = $trabajos['descripcion'];
            $detalleTrabajo->fecha_hora = $trabajos['fecha_hora'];
            $detalleTrabajo->costo = $trabajos['costo'];
            $detalleTrabajo->save();
        }

        return response()->json(['id' =>$trabajo->id, 'idComprobante' => $comprobante->id]);
    }

    public function listar()
    {
        $trabajos = Trabajo::select('trabajos.id', 'vehiculos.placa as vehiculo')
            ->selectRaw('DATE_FORMAT(fecha_hora_ingreso, "%d/%m/%Y %H:%i:%s") as fecha_hora_ingreso')
            ->selectRaw('CONCAT("S/. ", FORMAT(costo, 2)) as costo')
            ->selectRaw('CONCAT(clientes.Nombres, " ", clientes.Apellidos) as cliente')
            ->selectRaw('IF(estado >= 1, "Finalizado", "Iniciado") AS estado')
            ->join('vehiculos', 'vehiculos.id', '=', 'trabajos.idVehiculo')
            ->join('clientes', 'clientes.id', '=', 'vehiculos.cliente_id')
            ->where('eliminado', 0)
            ->orderBy('fecha_hora_ingreso', 'desc')
            ->get();
        return $trabajos;
    }

    public function obtener(string $id)
    {
        $trabajo = Trabajo::select('trabajos.id', 'idVehiculo', 'idTrabajador', 'fecha_hora_ingreso', 'fecha_hora_salida', 'problema_inicial','costo',)
            ->selectRaw('IF(trabajos.estado >= 1, "Finalizado", "Iniciado") AS estado')
            ->where('trabajos.id', $id)
            ->first(); // busca el id de trabajo y lo retorna
        $trabajo->detalleTrabajo = DetalleTrabajo::select('detalle_trabajos.id', 'descripcion', 'fecha_hora')
            ->selectRaw('FORMAT(detalle_trabajos.costo, 2) as costo')
            ->join('trabajos', 'trabajos.id', '=', 'detalle_trabajos.idTrabajo')
            ->where('idTrabajo', $id)
            ->get(); // busca los detalles asignados a un trabajo 
        $trabajo->evidencias = TrabajoEvidencia::select('trabajo_evidencias.id', 'ruta', 'size')
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

        /* Eliminar evidencias que se borraron al actualizar */
        $evidenciasTrabajo = TrabajoEvidencia::whereNotIn('id', $request->evidencias)->get();
        $noEvidencias = $evidenciasTrabajo->pluck('ruta');
        TrabajoEvidencia::whereNotIn('id', $request->evidencias)->delete();

        foreach ($noEvidencias as $noEvidencia) {
            $ruta = "/trabajos/" . strval($id) . "/" . $noEvidencia;
            Storage::disk('public')->delete($ruta);
        }

        $comprobante = Comprobante::where('idTrabajo','=',$trabajo->id)->first();

        return response()->json(['id' =>$trabajo->id, 'idComprobante' => $comprobante->id, 'nroComprobante' => $comprobante->nro_comprobante]); 
    }

    public function eliminar(string $id)
    {
        //Trabajo::destroy($id);
        $trabajo = Trabajo::findOrFail($id);
        $trabajo->eliminado = 1;
        $trabajo->save();
    }

    public function upload(Request $request, string $id)
    {
        $ruta = "/trabajos/" . $id . "/"; // selecciona la ruta donde se guardara los trabajos de acuerdo al id de un trabajo

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $namefile => $file) { // recorre los archivos
                $name = time() . "_" . $file->getClientOriginalName(); // Asignar nombre a archivo en el servidor
                $size = $file->getSize(); //Obtener y asignar tamaño de archivo
                Storage::disk('public')->put($ruta . $name, file_get_contents($file));  // guarda el archivo en la ruta y en el disco publico

                $evidenciasTrabajo = new TrabajoEvidencia();
                $evidenciasTrabajo->idTrabajo = $id;
                $evidenciasTrabajo->ruta = $name;
                $evidenciasTrabajo->size = $size;
                $evidenciasTrabajo->save();
            }
            return response()->json(['message' => 'Files uploaded successfully']);
        } else {
            return response()->json(['message' => 'Error to uploaded']);
        }
    }
}
