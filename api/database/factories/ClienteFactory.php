<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cliente>
 */
class ClienteFactory extends Factory
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

        $createdAt = $this->faker->dateTimeThisYear('-5 months');
        $updatedAt = $this->faker->dateTimeThisYear('-5 months');
        while ($createdAt > $updatedAt) {
            $updatedAt = $this->faker->dateTimeThisYear('-5 months');
        }

        return [
            'Nombres' => $this->faker->name(),
            'Apellidos' => $this->faker->lastName(),
            'tipo_Documento' => $tipoDocumento,
            'Nro_documento' => $numeroDocumento,
            'celular' => strval($this->faker->numberBetween(900000000, 999999999)),
            'correo' => $this->faker->email(),
            'created_at' => $createdAt,
            'updated_at' => $updatedAt
        ];
    }
}
