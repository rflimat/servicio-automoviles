<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proveedor extends Model
{
    use HasFactory;
    protected $table = 'proveedores'; // agrege esto porque sino daba error (no guardaba en proveedores e intentaba guardar en proveedors)

    protected $fillable = [
        'nombre',
        'RUC',
        'direccion',
        'celular'
    ];

}
