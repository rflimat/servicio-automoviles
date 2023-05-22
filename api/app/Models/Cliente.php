<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;
    protected $fillable = [
        'Nro_documento',
        'tipo_Documento',
        'Nombres',
        'Apellidos',
        'celular',
        'correo'
    ];
}
