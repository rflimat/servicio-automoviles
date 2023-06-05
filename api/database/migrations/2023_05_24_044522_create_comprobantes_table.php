<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    
    public function up(): void
    {
        Schema::create('comprobantes', function (Blueprint $table) {
            $table->id();
            $table->string('nro_comprobante'); //asdasda
            $table->datetime('fecha_hora_creacion')->nullable();
            $table->datetime('fecha_hora_cancelacion')->nullable();
            $table->unsignedInteger('idServicio')->nullable();
            $table->unsignedInteger('idMetodo_pago')->nullable();
            $table->integer('estado')->nullable();
            $table->integer('eliminado');
            $table->timestamps();
        });
        Schema::create('tipos_servicio', function (Blueprint $table) {
            $table->id();
            $table->string('servicio');
        });
        Schema::create('metodos_pago', function (Blueprint $table) {
            $table->id();
            $table->string('metodo');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comprobantes');
    }
};
