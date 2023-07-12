<?php

namespace Tests\Feature;

use App\Models\Cliente;
use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Models\Venta;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class VentaTest extends TestCase
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
        $response = $this->get('/api/ventas');
        $response->assertStatus(200);
    }

    public function test_store()
    {
        $this->login();
        // Crea un registro de prueba
        $venta = [
            'idCliente' => Cliente::factory()->create()->id,
            'fecha' => date('Y-m-d'),
            'hora' => date('H:i:s'),
            'total_importe' => 300.00,
            'productosVenta' => [
                [
                    'idProducto' => Producto::factory()->create()->id,
                    'cantidadAct' => 10,
                    'importe' => 150.00
                ],
                [
                    'idProducto' => Producto::factory()->create()->id,
                    'cantidadAct' => 10,
                    'importe' => 150.00
                ],
            ]
        ];

        $response = $this->post('/api/ventas', $venta);

        $response->assertStatus(201); // Verifica el código de estado de respuesta esperado
        $this->assertDatabaseHas('ventas', ['total_importe' => 300.00]); // Verifica que los datos se hayan almacenado en la base de datos
    }

    public function test_show(): void
    {
        $this->login();
        $venta = Venta::factory()->create(); // Crea un registro de prueba
        $detalleVenta = DetalleVenta::factory(2)->create([
            'idVenta' => $venta->id,
        ]);
        $total = $venta->calcularTotal();
        $response = $this->get('/api/ventas/' . $venta->id);
        $response->assertStatus(200);
    }

    public function test_destroy()
    {
        $this->login();
        $venta = Venta::factory()->create(); // Crea un registro de prueba
        $detalleVenta = DetalleVenta::factory(2)->create([
            'idVenta' => $venta->id,
        ]);
        $total = $venta->calcularTotal();

        $response = $this->delete('/api/ventas/' . $venta->id);

        $response->assertStatus(204); // Verifica que la eliminación se haya realizado con éxito
        $this->assertDatabaseHas('ventas', ['id' => $venta->id, 'estado' => 0]); // Verifica que los datos se haya cambiado de estado a 0
    }
}
