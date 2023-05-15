<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Compra;
use Illuminate\Http\Request;


class ComprasController extends Controller
{

    public function index()
    {
        $compra = Compra::all();
        return $compra;
    }
    public function store(Request $request)
    {
        $compra = new Compra();
        $compra->costo = $request->costo; 
        $compra->estado = $request->estado;

        $compra->save();
    }
    public function show(string $id)
    {
        $compra = Compra::find($id);
        return $compra;
    }
    public function update(Request $request, string $id)
    {
        $compra = Compra::findOrFail($id);
        $compra->costo = $request->costo;
        $compra->estado = $request->estado;

        $compra->save();
    }

    public function destroy(string $id)
    {
        $compra = Compra::destroy($id);
        return $compra;
    }
}
