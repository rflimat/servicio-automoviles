<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Trabajador>
 */
class TrabajadorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return  [
            'Nombres' => $this->faker->name(),
            'Apellidos' => $this->faker->lastName(),
            'celular' => strval($this->faker->numberBetween(900000000, 999999999)),
            'correo' => $this->faker->email()
        ];
    }
}
