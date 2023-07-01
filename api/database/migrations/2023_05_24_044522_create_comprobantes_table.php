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
            $table->string('nro_comprobante')->nullable(); //asdasda
            $table->datetime('fecha_hora_creacion')->nullable();
            $table->datetime('fecha_hora_cancelacion')->nullable();
            $table->unsignedInteger('idServicio')->nullable();
            $table->unsignedInteger('idMetodo_pago')->nullable();
            $table->integer('estado')->nullable();
            $table->integer('eliminado')->nullable();
            $table->decimal('costo_total')->nullable()->default(0);
            $table->unsignedInteger('idVenta')->nullable();
            $table->unsignedInteger('idTrabajo')->nullable();
            $table->timestamps();
        });
        Schema::create('tipos_servicio', function (Blueprint $table) {
            $table->id();
            $table->string('servicio'); // TRABAjo ventas ambos
        });
        Schema::create('metodos_pago', function (Blueprint $table) {
            $table->id();
            $table->string('metodo'); // BOLETA FACTURA CONVENCIONAL
        });
        DB::table('tipos_servicio')->insert(['servicio' => 'Trabajo'],);
        DB::table('tipos_servicio')->insert(['servicio' => 'Ventas'],);
        DB::table('tipos_servicio')->insert(['servicio' => 'Ambos'],);

        DB::table('metodos_pago')->insert(['metodo' => 'Boleta']);
        DB::table('metodos_pago')->insert(['metodo' => 'Factura']);
        DB::table('metodos_pago')->insert(['metodo' => 'Convencional']);
        
        // añade el costo total en comprobante
        DB::unprepared(' 
            create trigger crear_costo_comprobante before insert on comprobantes
            for each row
            begin
                if new.idVenta is not null then
                    set new.costo_total = (select total_importe from ventas where ventas.id = new.idVenta);
                end if;
                if new.idTrabajo is not null then
                    set new.costo_total = (select costo from trabajos where trabajos.id = new.idTrabajo);
                end if;
            end;
        ');

        DB::unprepared(' 
            create trigger editar_costo_comprobante before update on comprobantes
            for each row
            begin
                set new.costo_total = 0;
                if new.idTrabajo is not null then
                    set new.costo_total = new.costo_total + (select costo from trabajos where trabajos.id = new.idTrabajo);
                end if;
                if new.idVenta is not null then
                    set new.costo_total = new.costo_total + (select total_importe from ventas where ventas.id = new.idVenta);
                end if;
            end;
        ');
        // simula un update para trabajos de modo que el trigger para actualizar costo de comprobante se ejecuta
        DB::unprepared(' 
            create trigger editar_costo_trabajo after update on trabajos 
            for each row
            begin
                if new.costo != old.costo then
                    update comprobantes
                    set idTrabajo = idTrabajo
                    where idTrabajo = new.id;
                end if;
            end;
        ');
        // simula un update para ventas de modo que el trigger para actualizar costo de comprobante se ejecuta
        DB::unprepared(' 
            create trigger editar_total_importe_venta after update on ventas 
            for each row
            begin
                if new.total_importe != old.total_importe then
                    update comprobantes
                    set idVenta = idVenta
                    where idVenta = new.id;
                end if;
            end;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comprobantes');
        Schema::dropIfExists('tipos_servicio');
        Schema::dropIfExists('metodos_pago');
    }
};
