<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrabajoEvidencia extends Model
{
    use HasFactory;

    protected $fillable = [
        'idTrabajo',
        'ruta'
    ];
}
