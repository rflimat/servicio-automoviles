<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehiculo;
use Illuminate\Http\Request;

class VehiculosController extends Controller
{

    public function index()
    {
        $vehiculo = Vehiculo::select('vehiculos.id', 'placa', 'marca', 'anio', 'modelo', 'tipo_vehiculo', 'cliente_id')
        ->selectRaw('CONCAT(clientes.Nombres, " ", clientes.Apellidos) as nombreCliente')
        ->join('clientes', 'clientes.id', '=', 'vehiculos.cliente_id')
        ->get();
        return $vehiculo;
    }

    public function store(Request $request)
    {
        $vehiculo = new Vehiculo();
        $vehiculo->placa = $request->placa;
        $vehiculo->tipo_vehiculo = $request->tipo_vehiculo;
        $vehiculo->modelo = $request->modelo;
        $vehiculo->marca = $request->marca;
        $vehiculo->anio = $request->anio;
        $vehiculo->cliente_id = $request->cliente_id;

        $vehiculo->save();
        return response()->json($vehiculo, 201);
    }

    public function show(string $id)
    {
        $vehiculo = Vehiculo::find($id);
        return $vehiculo;
    }

    public function update(Request $request, string $id)
    {
        $vehiculo = Vehiculo::findOrFail($id);
        $vehiculo->placa = $request->placa;
        $vehiculo->tipo_vehiculo = $request->tipo_vehiculo;
        $vehiculo->modelo = $request->modelo;
        $vehiculo->marca = $request->marca;
        $vehiculo->anio = $request->anio;
        $vehiculo->cliente_id = $request->cliente_id;

        $vehiculo->save();
        return response()->json($vehiculo, 201);
    }

    public function destroy(string $id)
    {
        $vehiculo = Vehiculo::destroy($id);
        return response()->json($vehiculo, 204);
    }
}
