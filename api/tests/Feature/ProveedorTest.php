<?php

namespace Tests\Feature;

use App\Models\Proveedor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProveedorTest extends TestCase
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
        $response = $this->get('/api/proveedores');
        $response->assertStatus(200);
    }

    public function test_store()
    {
        $this->login();
        // Crea un registro de prueba
        $proveedor = [
            'nombre' => 'Autos SAC',
            'tipoDocumento' => 'RUC',
            'numeroDocumento' => '20102031232',
            'celular' => '931212222',
        ];

        $response = $this->post('/api/proveedores', $proveedor);

        $response->assertStatus(200); // Verifica el código de estado de respuesta esperado
        $this->assertDatabaseHas('proveedores', ['nombre' => 'Autos SAC']); // Verifica que los datos se hayan almacenado en la base de datos
    }

    public function test_show(): void
    {
        $this->login();
        $proveedor = Proveedor::factory()->create(); // Crea un registro de prueba
        $response = $this->get('/api/proveedores/' . $proveedor->id);
        $response->assertStatus(200);
    }

    public function test_update(): void
    {
        $this->login();
        $proveedor = Proveedor::factory()->create(); // Crea un registro de prueba

        //Actualizar registros requeridos
        $celular = "952454443";
        $newProveedor = $proveedor->toArray();
        $newProveedor["celular"] = $celular;

        $response = $this->put('/api/proveedores/' . $proveedor->id, $newProveedor);

        $response->assertStatus(200);
        $this->assertDatabaseHas('proveedores', ['id' => $proveedor->id, 'celular' => $celular]);
    }

    public function test_destroy()
    {
        $this->login();
        $proveedor = Proveedor::factory()->create(); // Crea un registro de prueba

        $response = $this->delete('/api/proveedores/' . $proveedor->id);

        $response->assertStatus(200); // Verifica que la eliminación se haya realizado con éxito
        $this->assertDatabaseMissing('proveedores', ['id' => $proveedor->id]); // Verifica que los datos se hayan eliminado de la base de datos
    }
}
