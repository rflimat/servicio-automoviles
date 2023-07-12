<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserTest extends TestCase
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

    public function test_login(): void
    {
        $this->login();
    }

    public function test_logout(): void
    {
        $this->login();
        $response = $this->post('/api/logout');
        $response->assertStatus(200);
    }

    public function test_index(): void
    {
        $this->login();
        $response = $this->get('/api/usuarios');
        $response->assertStatus(200);
    }

    public function test_store()
    {
        $this->login();
        // Crea un registro de prueba
        $user = [
            'username' => 'soporte663',
            'tipo' => 'soporte',
            'email' => 'soporte663@selaser.com',
            'name' => 'Fernando Lima',
            'telefono' => '931212222',
            'password' => 'soporte123'
        ];

        $response = $this->post('/api/usuarios', $user);

        $response->assertStatus(201); // Verifica el código de estado de respuesta esperado
        $this->assertDatabaseHas('users', ['name' => 'Fernando Lima', 'tipo' => 'soporte']); // Verifica que los datos se hayan almacenado en la base de datos
    }

    public function test_show(): void
    {
        $this->login();
        $user = User::factory()->create(); // Crea un registro de prueba
        $response = $this->get('/api/usuarios/' . $user->id);
        $response->assertStatus(200);
    }

    public function test_update(): void
    {
        $this->login();
        $user = User::factory()->create(); // Crea un registro de prueba

        //Actualizar registros requeridos
        $telefono = "944235668";
        $newUser = $user->toArray();
        $newUser["telefono"] = $telefono;

        $response = $this->put('/api/usuarios/' . $user->id, $newUser);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['id' => $user->id, 'telefono' => $telefono]);
    }

    public function test_destroy()
    {
        $this->login();
        $user = User::factory()->create(); // Crea un registro de prueba

        $response = $this->delete('/api/usuarios/' . $user->id);

        $response->assertStatus(204); // Verifica que la eliminación se haya realizado con éxito
        $this->assertDatabaseMissing('users', ['id' => $user->id]); // Verifica que los datos se hayan eliminado de la base de datos
    }
}
