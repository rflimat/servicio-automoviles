<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User; // el modelo usuario
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // para el token

class UsuarioController extends Controller
{
    public function registrar(Request $request){
        $request->validate([
            'username' => 'required'
        ]);
        $usuario = new User();
        $usuario->username = $request->username;
        $usuario->email = $request->email;
        $usuario->name = $request->name;
        $usuario->telefono = $request->telefono;
        $usuario->password = $request->password;
        $usuario->token = Hash::make($request->password);
        $usuario->save(); // guarda en la bd
        return $usuario; // para prueba
    }

    public function listar(){
        return User::all();
    }

    public function obtener(string $id){
        return User::findOrFail($id);
    }

    public function actualizar(Request $request, string $id){ // cambiar
        $usuario = User::findOrFail($id);
        $usuario->username = $request->username;
        $usuario->email = $request->email;
        $usuario->name = $request->name;
        $usuario->telefono = $request->telefono;
        $usuario->save();
        return $usuario;
    }

    public function eliminar(string $id){
        User::destroy($id);
    }
}
