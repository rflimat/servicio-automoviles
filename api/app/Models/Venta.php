<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    use HasFactory;
    protected $fillable = [
        'idCliente',
        //'idProducto',
        'cantidad',
        'estado',
        //'idComprobante',
        'total_importe'
    ];

}
