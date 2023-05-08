<?php

namespace App\Http\Controllers\proveedores;

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
        $proveedor->RUC = $request->RUC;
        $proveedor->direccion = $request->direccion;
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
        $proveedor->RUC = $request->RUC;
        $proveedor->direccion = $request->direccion;
        $proveedor->celular = $request->celular;

        $proveedor->save();
    }
    public function destroy(string $id)
    {
        $proveedor = proveedores::destroy($id);
        return $proveedor;
    }
}
