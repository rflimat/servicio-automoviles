<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->string('Nro_documento');
            $table->string('tipo_Documento');
            $table->string('Nombres');
            $table->string('Apellidos');
            $table->integer('celular');
            $table->string('correo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
