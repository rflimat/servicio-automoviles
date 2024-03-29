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
        $tipoDocumento = $this->faker->randomElement(["DNI", "RUC"]);
        $numeroDocumento = ($tipoDocumento === "DNI") ? $this->faker->dni() : $this->faker->ruc();

        return [
            'nombre' => $this->faker->company(),
            'tipoDocumento' => $tipoDocumento,
            'numeroDocumento' => $numeroDocumento,
            'celular' => strval($this->faker->numberBetween(900000000, 999999999)),
        ];
    }
}
