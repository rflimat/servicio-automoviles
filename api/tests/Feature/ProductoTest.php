<?php

namespace Tests\Feature;

use App\Models\Producto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProductoTest extends TestCase
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
        $response = $this->get('/api/productos');
        $response->assertStatus(200);
    }

    public function test_store()
    {
        $this->login();
        // Crea un registro de prueba
        $producto = [
            'codigo' => 'AP4-423',
            'nombre' => 'Bateria de arranque',
            'precio_venta' => 120.00,
            'cantidad' => 20,
            'unidad_medida' => 'Unidad',
            'marca' => 'Exide',
            'descripcion' => 'Este es un producto para poner bateria al vehiculo',
        ];

        $response = $this->post('/api/productos', $producto);

        $response->assertStatus(201); // Verifica el código de estado de respuesta esperado
        $this->assertDatabaseHas('productos', ['nombre' => 'Bateria de arranque', 'cantidad' => 20]); // Verifica que los datos se hayan almacenado en la base de datos
    }

    public function test_show(): void
    {
        $this->login();
        $producto = Producto::factory()->create(); // Crea un registro de prueba
        $response = $this->get('/api/productos/' . $producto->id);
        $response->assertStatus(200);
    }

    public function test_update(): void
    {
        $this->login();
        $producto = Producto::factory()->create(); // Crea un registro de prueba

        //Actualizar registros requeridos
        $precio_venta = 125.00;
        $newProducto = $producto->toArray();
        $newProducto["precio_venta"] = $precio_venta;

        $response = $this->put('/api/productos/' . $producto->id, $newProducto);

        $response->assertStatus(201);
        $this->assertDatabaseHas('productos', ['id' => $producto->id, 'precio_venta' => $precio_venta]);
    }

    public function test_destroy()
    {
        $this->login();
        $producto = Producto::factory()->create(); // Crea un registro de prueba

        $response = $this->delete('/api/productos/' . $producto->id);

        $response->assertStatus(204); // Verifica que la eliminación se haya realizado con éxito
        $this->assertDatabaseHas('productos', ['id' => $producto->id, 'estado' => 0]); // Verifica que los datos se haya cambiado de estado a 0
    }
}
