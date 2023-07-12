<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Producto>
 */
class ProductoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'codigo' => $this->faker->numerify('AP-###'),
            'nombre' => $this->faker->sentence(2),
            'precio_venta' => $this->faker->randomFloat(2, 50, 1000),
            'cantidad' => $this->faker->numberBetween(0, 100),
            'unidad_medida' => $this->faker->randomElement(["Unidad", "Pieza", "Juego"]),
            'marca' => $this->faker->sentence(2),
            'descripcion' => $this->faker->sentence(),
        ];
    }
}
