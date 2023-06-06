<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('compras', function (Blueprint $table) {
            $table->id();
            $table->dateTime('fecha_compra');
            $table->dateTime('fecha_recepcion');
            $table->decimal('costo_compra', 10, 2);
            $table->tinyInteger('estado');
            $table->tinyInteger('eliminado');
            $table->unsignedBigInteger('proveedor_id');
            $table->timestamps();
        });

        Schema::create('detalle_compras', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('producto_id');
            $table->unsignedBigInteger('compra_id');
            $table->integer('cantidad');
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 10, 2);
            $table->decimal('importe', 10, 2);
        });

        DB::unprepared('DROP TRIGGER IF EXISTS actualizar_stock_compra');
        DB::unprepared(' 
            CREATE TRIGGER actualizar_stock_compra BEFORE INSERT ON detalle_compras FOR EACH ROW 
            BEGIN 
                UPDATE productos SET cantidad=cantidad+NEW.cantidad WHERE id=NEW.producto_id;
            END;
        ');

        DB::unprepared('DROP TRIGGER IF EXISTS cambiar_stock_compra');
        DB::unprepared(' 
            CREATE TRIGGER cambiar_stock_compra AFTER UPDATE ON detalle_compras FOR EACH ROW 
            BEGIN 
                UPDATE productos SET cantidad=cantidad-OLD.cantidad+NEW.cantidad WHERE id=NEW.producto_id;
            END;
        ');

        DB::unprepared('DROP TRIGGER IF EXISTS cancelar_compra');
        DB::unprepared(' 
            CREATE TRIGGER cancelar_compra AFTER UPDATE ON compras FOR EACH ROW 
            BEGIN 
                IF NEW.eliminado=1 THEN
                    UPDATE detalle_compras pe
                    INNER JOIN productos p ON pe.producto_id=p.id
                    SET p.cantidad=p.cantidad-pe.cantidad WHERE pe.compra_id=NEW.id;
                END IF;
            END;
        ');
        //trigger : eliminacion de compra
       DB::unprepared('DROP TRIGGER IF EXISTS cancelar_compra');
        DB::unprepared(' 
            CREATE TRIGGER cancelar_compra AFTER UPDATE ON compras FOR EACH ROW 
            BEGIN 
                IF NEW.eliminado=1 THEN
                    UPDATE detalle_compras pe
                    INNER JOIN productos p ON pe.producto_id=p.id
                    SET p.cantidad=p.cantidad-pe.cantidad WHERE pe.compra_id=NEW.id;
                END IF;
            END;
        ');

    }


    public function down(): void
    {
        Schema::dropIfExists('compras');
        Schema::dropIfExists('detalle_compras');
        DB::unprepared('DROP TRIGGER IF EXISTS actualizar_stock_compra');
        DB::unprepared('DROP TRIGGER IF EXISTS cambiar_stock_compra');
        DB::unprepared('DROP TRIGGER IF EXISTS cancelar_compra');
    }
};
