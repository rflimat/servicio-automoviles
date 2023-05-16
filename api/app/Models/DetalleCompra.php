<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class detalle_compra extends Model
{
    use HasFactory;
    protected $fillable = [
        'cantidad',
        'compra_id',
        'producto_id',
        'precio',
        'descripcion',
        'importe'
    ];
}