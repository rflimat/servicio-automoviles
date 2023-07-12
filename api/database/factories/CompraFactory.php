<?php

namespace Database\Factories;

use App\Models\Proveedor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Compra>
 */
class CompraFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'proveedor_id' => function () {
                return Proveedor::factory()->create()->id;
            },
            'fecha_compra' => $this->faker->dateTimeBetween('-1 days'),
            'fecha_recepcion' => $this->faker->dateTimeBetween('-1 days', '+2 days'),
            'costo_compra' => $this->faker->randomFloat(2, 50, 1000),
            'estado' => $this->faker->numberBetween(0, 1),
            'eliminado' => 0
        ];
    }
}
