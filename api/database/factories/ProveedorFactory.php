<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Proveedor>
 */
class ProveedorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => fake()->name(),
            'tipoDocumento' => $this->faker->randomElement(["DNI", "RUC"]),
            'numeroDocumento' => strval($this->faker->numberBetween(10000000000, 21000000000)),
            'celular' => strval($this->faker->numberBetween(900000000, 999999999)),
        ];
    }
}
