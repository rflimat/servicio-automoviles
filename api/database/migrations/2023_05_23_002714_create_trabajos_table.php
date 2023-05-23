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
        Schema::create('trabajos', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('idTrabajador');
            $table->longText('problema_inicial');
            $table->dateTime('fecha_hora_ingreso')->nullable();
            $table->dateTime('fecha_hora_salida')->nullable();
            $table->double('costo');
            $table->unsignedInteger('idComprobante')->nullable();
            $table->timestamps();
        });

        // trabajo_evidencias (para imagenes solo idtrabajo y ruta)
        Schema::create('trabajo_evidencias', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idTrabajo');
            $table->string('ruta');
            $table->timestamps();
        });

        Schema::create('detalle_trabajos', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('idVehiculo');
            $table->unsignedInteger('idCliente');
            $table->longText('descripcion');
            $table->date('fecha');
            $table->time('hora');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trabajos');
    }
};
