<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Trabajo;
use App\Models\Venta;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Cantidad de Ventas diarias
        $ventas = Venta::whereDate('fecha', Carbon::now()->format('Y-m-d'))->count();
        // Cantidad de Trabajos diarias
        $trabajos = Trabajo::whereDate('fecha_hora_salida', Carbon::now()->format('Y-m-d'))->count();
        // Ganancias
        $gventas = Venta::whereDate('fecha', Carbon::now()->format('Y-m-d'))->sum('total_importe');
        $gtrabajos = Trabajo::whereDate('fecha_hora_salida', Carbon::now()->format('Y-m-d'))->sum('costo');
        $ganancias = $gventas + $gtrabajos;
        // Trabajos pendientes
        $trabajosPendientes = Trabajo::select('trabajos.id', 'detalle_trabajos.descripcion')
            ->selectRaw('DATE_FORMAT(detalle_trabajos.fecha_hora, "%d %b") as fecha')
            ->join('detalle_trabajos', 'trabajos.id', '=', 'detalle_trabajos.idTrabajo')
            ->where('estado', 0)
            ->where('eliminado', 0)
            ->orderBy('fecha_hora_ingreso', 'desc')
            ->take(5)
            ->get();
        // Top clientes
        $topClientes = Trabajo::selectRaw('CONCAT(clientes.Nombres, " ", clientes.Apellidos) as cliente')
            ->selectRaw('COUNT(trabajos.id) as cantidad')
            ->join('vehiculos', 'vehiculos.id', '=', 'trabajos.idVehiculo')
            ->join('clientes', 'clientes.id', '=', 'vehiculos.cliente_id')
            ->where('eliminado', 0)
            ->groupBy('cliente')
            ->orderBy('cantidad', 'desc')
            ->take(3)
            ->get();

        return response()->json([
            'reports' => [
                [
                    'title' => "Trabajos (Hoy)",
                    'iconClass' => "bx-desktop",
                    'description' => $trabajos
                ], 
                [
                    'title' => "Ventas (Hoy)",
                    'iconClass' => "bx-shopping-bag",
                    'description' => $ventas
                ],
                [
                    'title' => "Ganancias (Hoy)",
                    'iconClass' => "bx-money",
                    'description' => "S/. ".$ganancias
                ],
            ],
            'trabajosPendientes' => $trabajosPendientes,
            'topClientes' => $topClientes
        ]);
    }
}
