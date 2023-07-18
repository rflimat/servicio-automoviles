<?php

namespace Database\Factories;
use Faker\Provider\Fakecar;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vehiculo>
 */
class VehiculoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $this->faker->addProvider(new Fakecar($this->faker));

        $createdAt = $this->faker->dateTimeThisYear('-5 months');
        $updatedAt = $this->faker->dateTimeThisYear('-5 months');
        while ($createdAt > $updatedAt) {
            $updatedAt = $this->faker->dateTimeThisYear('-5 months');
        }

        return [
            'placa' => $this->faker->vehicleRegistration,
            'tipo_vehiculo' => $this->faker->vehicleType,
            'modelo' => $this->faker->vehicleModel,
            'marca' => $this->faker->vehicleBrand,
            'anio' => $this->faker->biasedNumberBetween(1987, date('Y')),
            'created_at' => $createdAt,
            'updated_at' => $updatedAt
        ];
    }
}
