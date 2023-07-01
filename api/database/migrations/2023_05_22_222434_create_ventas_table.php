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
        Schema::create('ventas', function (Blueprint $table) {
            $table->id();
            $table->unsignedinteger('idCliente');
            //$table->unsignedInteger('idProducto');
            $table->date('fecha')->nullable();
            $table->time('hora')->nullable();
            $table->integer('estado')->nullable();
            $table->unsignedInteger('idComprobante')->nullable();
            $table->decimal('total_importe')->default(0);
            $table->timestamps();

        });

        Schema::create('detalle_ventas', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('idVenta');
            $table->unsignedInteger('idProducto');
            $table->integer('cantidad')->default(0);
            $table->decimal('importe')->default(0);
            $table->timestamps();

        });
        // cuando se agrega un detalle ventas
        DB::unprepared('DROP TRIGGER IF EXISTS actualizar_stock_producto_en_venta');
        DB::unprepared(' 
            CREATE TRIGGER actualizar_stock_producto_en_venta BEFORE INSERT ON detalle_ventas FOR EACH ROW 
            BEGIN 
                UPDATE productos SET productos.cantidad=productos.cantidad-NEW.cantidad WHERE productos.id=NEW.idProducto;
            END;
        ');
        // cuando se hace un update de detalle ventas
        DB::unprepared('DROP TRIGGER IF EXISTS actualizar_stock_producto_en_venta2');
        DB::unprepared(' 
            CREATE TRIGGER actualizar_stock_producto_en_venta2 BEFORE UPDATE ON detalle_ventas FOR EACH ROW 
            BEGIN
                UPDATE productos SET productos.cantidad=productos.cantidad-NEW.cantidad+OLD.cantidad WHERE productos.id=NEW.idProducto;
            END;
        ');
        
        DB::unprepared('DROP TRIGGER IF EXISTS rellenar_fecha_hora_venta');
        DB::unprepared(' 
            CREATE TRIGGER rellenar_fecha_hora_venta BEFORE INSERT ON ventas FOR EACH ROW 
            BEGIN 
                SET NEW.fecha = date(NEW.created_at), 
                NEW.hora= time(NEW.created_at);
            END;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};
