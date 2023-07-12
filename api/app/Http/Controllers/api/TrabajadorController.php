<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trabajador;
use Illuminate\Http\Request;

class TrabajadorController extends Controller
{

    public function index()
    {
        $trabajador = Trabajador::all();
        return $trabajador;
    }
    public function store(Request $request)
    {
        $trabajador = new Trabajador();
        $trabajador->Nombres = $request->Nombres;
        $trabajador->Apellidos = $request->Apellidos;
        $trabajador->correo = $request->correo;
        $trabajador->celular = $request->celular;

        $trabajador->save();

        return response()->json($trabajador, 201);
    }
    public function show(string $id)
    {
        $trabajador = Trabajador::find($id);
        return $trabajador;
    }
    public function update(Request $request, string $id)
    {
        $trabajador = Trabajador::findOrFail($id);
        $trabajador->Nombres = $request->Nombres;
        $trabajador->Apellidos = $request->Apellidos;
        $trabajador->correo = $request->correo;
        $trabajador->celular = $request->celular;

        $trabajador->save();
        return response()->json($trabajador, 201);
    }
    public function destroy(string $id)
    {
        $trabajador = Trabajador::destroy($id);
        return response()->json($trabajador, 204);
    }
}
