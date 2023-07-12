<?php

namespace Tests\Feature;

use App\Models\Compra;
use App\Models\DetalleCompra;
use App\Models\Producto;
use App\Models\Proveedor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CompraTest extends TestCase
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
        $response = $this->get('/api/compras');
        $response->assertStatus(200);
    }

    public function test_store()
    {
        $this->login();
        // Crea un registro de prueba
        $compra = [
            'proveedor_id' => Proveedor::factory()->create()->id,
            'fecha_compra' => date('Y-m-d H:i:s'),
            'fecha_recepcion' => date('Y-m-d H:i:s'),
            'costo_compra' => 290.00,
            'estado' => 0,
            'productosCompra' => [
                [
                    'id' => Producto::factory()->create()->id,
                    'observacion' => 'Producto en buen estado',
                    'cantidad' => 10,
                    'precio' => 15.00,
                    'importe' => 150.00
                ],
                [
                    'id' => Producto::factory()->create()->id,
                    'observacion' => 'Producto con empaque',
                    'cantidad' => 4,
                    'precio' => 35.00,
                    'importe' => 140.00
                ],
            ]
        ];

        $response = $this->post('/api/compras', $compra);

        $response->assertStatus(201); // Verifica el código de estado de respuesta esperado
        $this->assertDatabaseHas('compras', ['costo_compra' => 290.00]); // Verifica que los datos se hayan almacenado en la base de datos
    }

    public function test_show(): void
    {
        $this->login();
        $compra = Compra::factory()->create(); // Crea un registro de prueba
        $detalleCompra = DetalleCompra::factory(2)->create([
            'compra_id' => $compra->id,
        ]);
        $total = $compra->calcularTotal();
        $response = $this->get('/api/compras/' . $compra->id);
        $response->assertStatus(200);
    }

    public function test_update(): void
    {
        $this->login();
        $compra = Compra::factory()->create(); // Crea un registro de prueba
        $detalleCompra = DetalleCompra::factory(2)->create([
            'compra_id' => $compra->id,
        ]);
        $total = $compra->calcularTotal();

        //Actualizar registros requeridos
        $estado = 1;
        $newCompra = $compra->toArray();
        $newCompra['fecha_compra'] = $compra->fecha_compra->format('Y-m-d H:i:s');
        $newCompra['fecha_recepcion'] = $compra->fecha_recepcion->format('Y-m-d H:i:s');
        $newCompra["estado"] = $estado;
        
        $response = $this->put('/api/compras/' . $compra->id, $newCompra);

        $response->assertStatus(201);
        $this->assertDatabaseHas('compras', ['id' => $compra->id, 'estado' => $estado]);
    }

    public function test_destroy()
    {
        $this->login();
        $compra = Compra::factory()->create(); // Crea un registro de prueba
        $detalleCompra = DetalleCompra::factory(2)->create([
            'compra_id' => $compra->id,
        ]);
        $total = $compra->calcularTotal();

        $response = $this->delete('/api/compras/' . $compra->id);

        $response->assertStatus(204); // Verifica que la eliminación se haya realizado con éxito
        $this->assertDatabaseHas('compras', ['id' => $compra->id, 'eliminado' => 1]); // Verifica que los datos se haya cambiado de estado a 0
    }
}
