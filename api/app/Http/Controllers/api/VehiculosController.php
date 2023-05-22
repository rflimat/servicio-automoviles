<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehiculo;
use Illuminate\Http\Request;

class VehiculosController extends Controller
{

    public function index()
    {
        $vehiculo = Vehiculo::all();
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

        $vehiculo->save();
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

        $vehiculo->save();
    }

    public function destroy(string $id)
    {
        $vehiculo = Vehiculo::destroy($id);
        return $vehiculo;
    }
}
