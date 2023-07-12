<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Proveedor;
use Illuminate\Http\Request;

class ProveedoresController extends Controller
{
    public function index()
    {
        $proveedores = Proveedor::all();
        return $proveedores;
    }
    public function store(Request $request)
    {
        $proveedor = new Proveedor();
        $proveedor->nombre = $request->nombre;
        $proveedor->tipoDocumento = $request->tipoDocumento;
        $proveedor->numeroDocumento = $request->numeroDocumento;
        $proveedor->celular = $request->celular;
        
        $proveedor->save();
        return response()->json($proveedor, 201);
    }
    public function show(string $id)
    {
        $proveedor = Proveedor::find($id);
        return $proveedor;
    }
    public function update(Request $request, string $id)
    {
        $proveedor = Proveedor::findOrFail($id);
        $proveedor->nombre = $request->nombre;
        $proveedor->tipoDocumento = $request->tipoDocumento;
        $proveedor->numeroDocumento = $request->numeroDocumento;
        $proveedor->celular = $request->celular;

        $proveedor->save();
        return response()->json($proveedor, 201);
    }
    public function destroy(string $id)
    {
        $proveedor = Proveedor::destroy($id);
        return response()->json($proveedor, 204);
    }
}
