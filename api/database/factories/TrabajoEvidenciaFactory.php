<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TrabajoEvidencia>
 */
class TrabajoEvidenciaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $image = $this->faker->image('storage/app/public/images', 800, 600); // Genera una imagen y guarda la ruta

        return [
            'ruta' => basename($image),
            'size' => filesize($image)
        ];
    }
}
