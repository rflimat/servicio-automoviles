<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleCompra extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'cantidad',
        'compra_id',
        'producto_id',
        'precio',
        'importe'
    ];
}