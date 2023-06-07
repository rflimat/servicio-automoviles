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
            $table->integer('eliminado')->nullable();
            $table->double('costo_total')->nullable();
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
        /*
        DB::unprepared(' 
            CREATE TRIGGER calcular_costo BEFORE INSERT ON comprobantes FOR EACH ROW 
            BEGIN
                if new.idServicio = 1 or then
                    set ct = ct + (select sum(importe) from ventas where idComprobante = new.id) +
                        (select sum(costo) from trabajos where idComprobante = new.id) ;
                end if;
                SET NEW.costo_total = ct;
            END;
        ');
        */
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comprobantes');
    }
};
