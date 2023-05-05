<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Response;

class AutenticacionController extends Controller
{
    public function login(Request $request){
        $credentials = $request->validate([
            'username' => ['required'],
            'password' => ['required'],
        ]);
        if(Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('token')->plainTextToken;
            $cookie = cookie('cookie_token', $token, 60*24);
            return response(["token"=>$token], Response::HTTP_OK)->withoutCookie($cookie);
        }else{
            return response(Response::HTTP_UNAUTHORIZED);
        }
    }
    public function perfil(Request $request){
        return response()->json([
            "message" => "Perfil de usuario",
            "Datos" => auth()->user()
        ], Response::HTTP_OK);
    }
    public function logout(){
        $cookie = Cookie::forget('cookie_token');
        return response(Response::HTTP_OK)->withCookie($cookie);
    }
}
