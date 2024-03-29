<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
        'codigo',
        'nombre',
        'precio_venta',
        'cantidad',
        'unidad_medida',
        'marca',
        'descripcion',
        'estado'
    ];
}
