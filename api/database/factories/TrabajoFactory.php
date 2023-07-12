<?php

namespace Database\Factories;

use App\Models\Cliente;
use App\Models\Trabajador;
use App\Models\Vehiculo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Trabajo>
 */
class TrabajoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'idTrabajador' => Trabajador::factory()->create()->id,
            'idVehiculo' => function () {
                $cliente = Cliente::factory()->create();
                $vehiculo = Vehiculo::factory()->create([
                    'cliente_id' => $cliente->id,
                ]);
                return $vehiculo->id;
            },
            'problema_inicial' => $this->faker->sentence(),
            'fecha_hora_ingreso' => $this->faker->dateTime(),
            'fecha_hora_salida' => $this->faker->dateTime(),
            'costo' => $this->faker->randomFloat(2, 50, 1000),
            'estado' => $this->faker->numberBetween(0, 1),
        ];
    }
}
