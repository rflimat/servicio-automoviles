<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('compras', function (Blueprint $table) {
            $table->id();
            $table->string('costo');
            $table->boolean('estado');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('compras');
    }
};
