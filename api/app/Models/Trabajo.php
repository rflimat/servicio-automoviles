<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trabajo extends Model
{
    use HasFactory;
    protected $fillable = [
        'idTrabajador',
        'problema_inicial',
        'fecha_hora_ingreso',
        'fecha_hora_salida',
        'costo',
        'idComprobante',
        'estado'
    ];
}
