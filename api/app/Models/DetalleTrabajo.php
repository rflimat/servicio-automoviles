<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleTrabajo extends Model
{
    use HasFactory;
    protected $fillable = [
        'idTrabajo',
        'idVehiculo',
        'idCliente',
        'descripcion',
        'fecha',
        'hora'
    ];
}
