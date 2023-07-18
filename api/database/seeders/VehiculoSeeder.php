<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\Vehiculo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VehiculoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i=0; $i <100 ; $i++) { 
            $cliente = Cliente::factory()->create();
            Vehiculo::factory()->count(random_int(1, 3))->create([
                'cliente_id' => $cliente->id,
            ]);
        }
    }
}
