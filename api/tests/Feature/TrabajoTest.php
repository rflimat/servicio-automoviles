<?php

namespace Tests\Feature;

use App\Models\Cliente;
use App\Models\DetalleTrabajo;
use App\Models\Trabajador;
use App\Models\Trabajo;
use App\Models\TrabajoEvidencia;
use App\Models\Vehiculo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use GuzzleHttp\Client;

class TrabajoTest extends TestCase
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
        $response = $this->get('/api/trabajos');
        $response->assertStatus(200);
    }

    public function test_store()
    {
        $this->login();
        // Crea un vehiculo de prueba
        $cliente = Cliente::factory()->create();
        $vehiculo = Vehiculo::factory()->create([
            'cliente_id' => $cliente->id,
        ]);

        // Crea un registro de prueba
        $trabajo = [
            'idTrabajador' => Trabajador::factory()->create()->id,
            'idVehiculo' => $vehiculo->id,
            'problema_inicial' => "Vehiculo no funciona motor",
            'fecha_hora_ingreso' => date('Y-m-d H:i:s'),
            'fecha_hora_salida' => date('Y-m-d H:i:s'),
            'costo' => 160.00,
            'estado' => 0,
            'detalleTrabajo' => [
                [
                    'descripcion' => 'Cambio de motor',
                    'fecha_hora' => date('Y-m-d H:i:s'),
                    'costo' => 100.00
                ],
                [
                    'descripcion' => 'Cambio de aceite',
                    'fecha_hora' => date('Y-m-d H:i:s'),
                    'costo' => 60.00
                ],
            ]
        ];

        $response = $this->post('/api/trabajos', $trabajo);
        $response->assertStatus(201); // Verifica el código de estado de respuesta esperado
        $this->assertDatabaseHas('trabajos', ['costo' => 160.00]); // Verifica que los datos se hayan almacenado en la base de datos

        // Subir imagenes de trabajos
        /*$multipart = TrabajoEvidencia::factory(2)->create([
            'idTrabajo' => $data->id,
        ]);

        $client = new Client();
        $response = $client->request('POST', '/api/trabajos/upload/' . $data->id, [
            'multipart' => $multipart
        ]);*/
    }


    public function test_show(): void
    {
        $this->login();
        $trabajo = Trabajo::factory()->create(); // Crea un registro de prueba
        $detalleTrabajo = DetalleTrabajo::factory(2)->create([
            'idTrabajo' => $trabajo->id,
        ]);
        $total = $trabajo->calcularTotal();
        $detalleEvidencia = TrabajoEvidencia::factory(2)->create([
            'idTrabajo' => $trabajo->id,
        ]);

        $response = $this->get('/api/trabajos/' . $trabajo->id);
        $response->assertStatus(200);
    }

    public function test_destroy()
    {
        $this->login();
        $trabajo = Trabajo::factory()->create(); // Crea un registro de prueba
        $detalleTrabajo = DetalleTrabajo::factory(2)->create([
            'idTrabajo' => $trabajo->id,
        ]);
        $total = $trabajo->calcularTotal();
        $detalleEvidencia = TrabajoEvidencia::factory(2)->create([
            'idTrabajo' => $trabajo->id,
        ]);

        $response = $this->delete('/api/trabajos/' . $trabajo->id);

        $response->assertStatus(204); // Verifica que la eliminación se haya realizado con éxito
        $this->assertDatabaseHas('trabajos', ['id' => $trabajo->id, 'eliminado' => 1]); // Verifica que los datos se haya cambiado de estado a 0
    }
}
