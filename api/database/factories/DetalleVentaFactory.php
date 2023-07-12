<?php

namespace Database\Factories;

use App\Models\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DetalleVenta>
 */
class DetalleVentaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $producto = Producto::factory()->create();
        $cantidad = intval($producto->cantidad);
        $cantidadAct = $this->faker->numberBetween(1, $cantidad);

        return [
            'idProducto' => $producto->id,
            'cantidad' => $cantidadAct,
            'importe' => $cantidad * $producto->precio_venta
        ];
    }
}
