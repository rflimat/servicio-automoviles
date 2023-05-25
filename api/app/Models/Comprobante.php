<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comprobante extends Model
{
    use HasFactory;
    protected $fillable = [
        'fecha_hora_creacion',
        'fecha_hora_cancelacion',
        'idServicio',
        'idMetodo_pago',
        'estado',
        'eliminado',
        'nro_comprobante'
    ];
}
