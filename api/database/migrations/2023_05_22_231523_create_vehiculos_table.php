<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehiculos', function (Blueprint $table) {
            $table->id();
            $table->string('placa');
            $table->string('tipo_vehiculo');
            $table->string('modelo');
            $table->string('marca');
            $table->integer('anio');
            $table->unsignedBigInteger('cliente_id');
            $table->timestamps();
            
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehiculos');
    }
};
