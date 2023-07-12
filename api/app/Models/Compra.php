<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
    use HasFactory;
    protected $fillable = [
        'costo',
        'estado',
        'fecha_recepcion',
        'eliminado',
        'fecha_compra',
        'proveedor_id'
    ];

    public function detallesCompra()
    {
        return $this->hasMany(DetalleCompra::class);
    }

    public function calcularTotal()
    {
        return $this->detallesCompra->sum('importe');
    }
}
