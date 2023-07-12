<?php

namespace Database\Factories;

use App\Models\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DetalleCompra>
 */
class DetalleCompraFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cantidad = $this->faker->numberBetween(1, 10);
        $precio = $this->faker->randomFloat(2, 1, 100);

        return [
            'producto_id' => function () {
                return Producto::factory()->create()->id;
            },
            'descripcion' => $this->faker->paragraph(),
            'cantidad' => $cantidad,
            'precio' => $precio,
            'importe' => $cantidad * $precio
        ];
    }
}
