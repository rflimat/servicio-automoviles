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
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->array_unique();
            $table->string('nombre');
            $table->double('precio_venta');
            $table->integer('cantidad');
            $table->string('unidad_medida')->nullable();
            $table->string('marca');  //  ultima actualizacion bd
            $table->string('descripcion'); // ultima actualizacion
            $table->integer('estado')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
