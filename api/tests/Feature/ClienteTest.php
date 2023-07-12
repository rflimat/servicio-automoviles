<?php

namespace Tests\Feature;

use App\Models\Cliente;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ClienteTest extends TestCase
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
        $response = $this->get('/api/clientes');
        $response->assertStatus(200);
    }

    public function test_store()
    {
        $this->login();
        // Crea un registro de prueba
        $cliente = [
            'Nombres' => 'Joel',
            'Apellidos' => 'Flores',
            'tipo_Documento' => 'DNI',
            'Nro_documento' => '72342343',
            'celular' => '931212222',
            'correo' => 'jflores@gmail.com'
        ];

        $response = $this->post('/api/clientes', $cliente);

        $response->assertStatus(201); // Verifica el código de estado de respuesta esperado
        $this->assertDatabaseHas('clientes', ['nombres' => 'Joel', 'apellidos' => 'Flores']); // Verifica que los datos se hayan almacenado en la base de datos
    }

    public function test_show(): void
    {
        $this->login();
        $cliente = Cliente::factory()->create(); // Crea un registro de prueba
        $response = $this->get('/api/clientes/' . $cliente->id);
        $response->assertStatus(200);
    }

    public function test_update(): void
    {
        $this->login();
        $cliente = Cliente::factory()->create(); // Crea un registro de prueba

        //Actualizar registros requeridos
        $celular = "984212323";
        $newCliente = $cliente->toArray();
        $newCliente["celular"] = $celular;

        $response = $this->put('/api/clientes/' . $cliente->id, $newCliente);

        $response->assertStatus(201);
        $this->assertDatabaseHas('clientes', ['id' => $cliente->id, 'celular' => $celular]);
    }

    public function test_destroy()
    {
        $this->login();
        $cliente = Cliente::factory()->create(); // Crea un registro de prueba

        $response = $this->delete('/api/clientes/' . $cliente->id);

        $response->assertStatus(204); // Verifica que la eliminación se haya realizado con éxito
        $this->assertDatabaseMissing('clientes', ['id' => $cliente->id]); // Verifica que los datos se hayan eliminado de la base de datos
    }
}
