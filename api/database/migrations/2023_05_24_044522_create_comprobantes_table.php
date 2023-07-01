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
        
        DB::unprepared(' 
            create trigger insert_venta_para_comprobante after insert on ventas for each row
            begin
                update comprobantes
                set costo_total = costo_total + new.total_importe
                where comprobantes.idVenta =new.id;
            end;
        ');
        /*
        DB::unprepared(' 
            create trigger insert_trabajo_para_comprobante after insert on trabajos for each row
            begin
                update comprobantes
                set costo_total = costo_total + new.costo
                where comprobantes.id =new.idComprobante;
            end;
        ');
        
        DB::unprepared(' 
            create trigger update_trabajo_para_comprobante after update on trabajos for each row
            begin
                if new.idComprobante = old.idComprobante then
                    update comprobantes
                    set costo_total = costo_total + new.costo - old.costo
                    where comprobantes.id =new.idComprobante;
                end if;
            end
        ');
        */
        /*
        DB::unprepared(' 
            create trigger update_venta_para_comprobante after update on ventas for each row
            begin
                if new.idComprobante = old.idComprobante then
                    update comprobantes
                    set costo_total = costo_total - old.total_importe + new.total_importe
                    where comprobantes.id =new.idComprobante;
                end if;
            end;
        ');
        */
        /*
        DB::unprepared(' 
            create trigger delete_venta_para_comprobante after delete on ventas for each row
            begin
                update comprobantes
                set costo_total = costo_total - old.total_importe
                where comprobantes.id =old.idComprobante;
            end;
        ');
        */
        /*
        DB::unprepared(' 
            create trigger delete_trabajo_para_comprobante after delete on trabajos for each row
            begin
                update comprobantes
                set costo_total = costo_total - old.costo
                where comprobantes.id =old.idComprobante;
            end;
        ');
        */
        
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
