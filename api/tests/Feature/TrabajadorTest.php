<?php

namespace Tests\Feature;

use App\Models\Trabajador;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TrabajadorTest extends TestCase
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
        $response = $this->get('/api/trabajadores');
        $response->assertStatus(200);
    }

    public function test_store()
    {
        $this->login();
        // Crea un registro de prueba
        $trabajador = [
            'Nombres' => 'Manuel',
            'Apellidos' => 'Ticona',
            'celular' => '952342433',
            'correo' => 'manuelticona@gmail.com'
        ];

        $response = $this->post('/api/trabajadores', $trabajador);

        $response->assertStatus(201); // Verifica el código de estado de respuesta esperado
        $this->assertDatabaseHas('trabajadors', ['Nombres' => 'Manuel', 'Apellidos' => 'Ticona']); // Verifica que los datos se hayan almacenado en la base de datos
    }

    public function test_show(): void
    {
        $this->login();
        $trabajador = Trabajador::factory()->create(); // Crea un registro de prueba
        $response = $this->get('/api/trabajadores/' . $trabajador->id);
        $response->assertStatus(200);
    }

    public function test_update(): void
    {
        $this->login();
        $trabajador = Trabajador::factory()->create(); // Crea un registro de prueba

        //Actualizar registros requeridos
        $celular = "964217432";
        $newTrabajador = $trabajador->toArray();
        $newTrabajador["celular"] = $celular;

        $response = $this->put('/api/trabajadores/' . $trabajador->id, $newTrabajador);

        $response->assertStatus(201);
        $this->assertDatabaseHas('trabajadors', ['id' => $trabajador->id, 'celular' => $celular]);
    }

    public function test_destroy()
    {
        $this->login();
        $trabajador = Trabajador::factory()->create(); // Crea un registro de prueba

        $response = $this->delete('/api/trabajadores/' . $trabajador->id);

        $response->assertStatus(204); // Verifica que la eliminación se haya realizado con éxito
        $this->assertDatabaseMissing('trabajadors', ['id' => $trabajador->id]); // Verifica que los datos se hayan eliminado de la base de datos
    }
}
