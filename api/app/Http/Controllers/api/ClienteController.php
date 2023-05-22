<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request; 

class ClienteController extends Controller
{

    public function index()
    {
        $cliente = Cliente::all();
        return $cliente;
    }

    public function store(Request $request)
    {
        $cliente = new Cliente();
        $cliente->Nro_documento = $request->Nro_documento;
        $cliente->tipo_Documento = $request->tipo_Documento;
        $cliente->Nombres = $request->Nombres;
        $cliente->Apellidos = $request->Apellidos;
        $cliente->celular = $request->celular;
        $cliente->correo = $request->correo;

        $cliente->save();
    }

    public function show(string $id)
    {
        $cliente = Cliente::find($id);
        return $cliente;
    }

    public function update(Request $request, string $id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->Nro_documento = $request->Nro_documento;
        $cliente->tipo_Documento = $request->tipo_Documento;
        $cliente->Nombres = $request->Nombres;
        $cliente->Apellidos = $request->Apellidos;
        $cliente->celular = $request->celular;
        $cliente->correo = $request->correo;

        $cliente->save();
    }

    public function destroy(string $id)
    {
        $cliente = Cliente::destroy($id);
        return $cliente;
    }
}
