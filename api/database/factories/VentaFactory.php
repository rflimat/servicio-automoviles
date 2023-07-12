<?php

namespace Database\Factories;

use App\Models\Cliente;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Venta>
 */
class VentaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'idCliente' => function () {
                return Cliente::factory()->create()->id;
            },
            'fecha' => $this->faker->date('Y-m-d', '-1 days'),
            'hora' => $this->faker->time('H:i:s', '-1 days'),
            'total_importe' => $this->faker->randomFloat(2, 50, 1000),
        ];
    }
}
