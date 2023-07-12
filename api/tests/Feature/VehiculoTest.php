<?php

namespace Tests\Feature;

use App\Models\Cliente;
use App\Models\Vehiculo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class VehiculoTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function login(): void
    {
        $credentials = ["username" => "admin", "password" => "admin123"];
        $response = $this->post('/api/login', $credentials);
        $response->assertStatus(200);
    }

    public function test_index(): void
    {
        $this->login();
        $response = $this->get('/api/vehiculos');
        $response->assertStatus(200);
    }

    public function test_store()
    {
        $this->login();
        $cliente = Cliente::factory()->create(); // Crea un cliente de prueba

        $vehiculos =
            [
                [
                    'placa' => 'Z3W-233',
                    'tipo_vehiculo' => 'Auto',
                    'modelo' => 'Yaris',
                    'marca' => 'Toyota',
                    'anio' => 2022,
                    'cliente_id' => $cliente->id
                ],
                [
                    'placa' => 'Z1T-254',
                    'tipo_vehiculo' => 'Auto',
                    'modelo' => 'Elantra',
                    'marca' => 'Hyundai',
                    'anio' => 2021,
                    'cliente_id' => $cliente->id
                ]
            ];

        foreach ($vehiculos as $vehiculo) {
            $response = $this->post('/api/vehiculos', $vehiculo);
            $response->assertStatus(201); // Verifica el código de estado de respuesta esperado
        }


        $this->assertDatabaseHas('vehiculos', ['placa' => 'Z3W-233']); // Verifica que los datos se hayan almacenado en la base de datos
    }

    public function test_show(): void
    {
        $this->login();
        $cliente = Cliente::factory()->create(); // Crea un cliente de prueba
        // Crea un vehiculo de prueba
        $vehiculo = Vehiculo::factory()->create([
            'cliente_id' => $cliente->id,
        ]);

        $response = $this->get('/api/vehiculos/' . $vehiculo->id);
        $response->assertStatus(200);
    }

    public function test_update(): void
    {
        $this->login();
        $cliente = Cliente::factory()->create(); // Crea un cliente de prueba
        // Crea varios vehiculos de prueba
        $vehiculos = Vehiculo::factory(2)->create([
            'cliente_id' => $cliente->id,
        ]);

        foreach ($vehiculos as $vehiculo) {
            // Actualizar registros requeridos
            $tipo_vehiculo = "Taxi";
            $newVehiculo = $vehiculo->toArray();
            $newVehiculo["tipo_vehiculo"] = $tipo_vehiculo;

            $response = $this->put('/api/vehiculos/' . $vehiculo->id, $newVehiculo);
            $response->assertStatus(201);
            $this->assertDatabaseHas('vehiculos', ['id' => $vehiculo->id, 'tipo_vehiculo' => $tipo_vehiculo]);
        }
    }

    public function test_destroy()
    {
        $this->login();
        $cliente = Cliente::factory()->create(); // Crea un cliente de prueba
        // Crea varios vehiculos de prueba
        $vehiculos = Vehiculo::factory(2)->create([
            'cliente_id' => $cliente->id,
        ]);

        foreach ($vehiculos as $vehiculo) {
            $response = $this->delete('/api/vehiculos/' . $vehiculo->id);
            $response->assertStatus(204); // Verifica que la eliminación se haya realizado con éxito
            $this->assertDatabaseMissing('vehiculos', ['id' => $vehiculo->id]); // Verifica que los datos se hayan eliminado de la base de datos
        }
    }
}
