<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Proveedores;
use Illuminate\Http\Request;

class Proveedorescontroller extends Controller
{
    public function index()
    {
        $proveedores = Proveedores::all();
        return $proveedores;
    }
    public function store(Request $request)
    {
        $proveedor = new Proveedores();
        $proveedor->nombre = $request->nombre;
        $proveedor->tipoDocumento = $request->tipoDocumento;
        $proveedor->numeroDocumento = $request->numeroDocumento;
        $proveedor->celular = $request->celular;
        
        $proveedor->save();
    }
    public function show(string $id)
    {
        $proveedor = Proveedores::find($id);
        return $proveedor;
    }
    public function update(Request $request, string $id)
    {
        $proveedor = Proveedores::findOrFail($id);
        $proveedor->nombre = $request->nombre;
        $proveedor->tipoDocumento = $request->tipoDocumento;
        $proveedor->numeroDocumento = $request->numeroDocumento;
        $proveedor->celular = $request->celular;

        $proveedor->save();
    }
    public function destroy(string $id)
    {
        $proveedor = Proveedores::destroy($id);
        return $proveedor;
    }
}
