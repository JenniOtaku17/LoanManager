<template>
    <div v-if="mounted">
      <v-dialog v-model="activador" width="650" persistent>
        <v-card class="prestamoPopup">
            <v-card-title>
                <h3 class="primary--text">{{title}}</h3>
                <v-spacer></v-spacer>
                <v-btn icon @click="clean"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text class="pt-3 pb-8 px-10">
                <v-form ref="form">

                    <v-row >
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Concepto</span>
                            <v-text-field  v-model="prestamo.concepto" dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Cliente</span>
                            <v-select v-model="prestamo.clienteId" dense outlined :rules="inputRules" class="textFieldCustom" color="secondary" :items="clientes" :item-text="nombreCompleto" item-value="clienteId" append-icon="mdi-chevron-down" :disabled="!mounted"></v-select>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Monto</span>
                            <v-text-field  v-model="prestamo.monto" type="number" dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Interés</span>
                            <v-text-field  v-model="prestamo.interes"  dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row >
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Frecuencia de Interés</span>
                            <v-select v-model="prestamo.frecuenciaInteresId" dense outlined :rules="inputRules" class="textFieldCustom" color="secondary" :items="frecuencias" item-text="nombre" item-value="frecuenciaId" append-icon="mdi-chevron-down" :disabled="!mounted"></v-select>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Frecuencia de Pagos</span>
                            <v-select v-model="prestamo.frecuenciaPagoId" dense outlined :rules="inputRules" class="textFieldCustom" color="secondary" :items="frecuencias" item-text="nombre" item-value="frecuenciaId" append-icon="mdi-chevron-down" :disabled="!mounted"></v-select>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Fecha de inicio</span>
                            <v-menu
                                ref="menuFechaInicio"
                                v-model="menuFechaInicio"
                                :close-on-content-click="false"
                                :return-value.sync="prestamo.fecha"
                                transition="scale-transition"
                                offset-y  
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                    v-model="prestamo.fecha" 
                                    outlined readonly append-icon="mdi-calendar"
                                    dense class="textFieldCustom fechaCustom" color="secondary"
                                    v-bind="attrs"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="prestamo.fecha"
                                    no-title color="primary"
                                    scrollable
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn elevation="0" text color="secondary white--text" @click="menuFechaInicio = false"
                                    >Cancelar</v-btn
                                    >
                                    <v-btn
                                    text elevation="0" 
                                    color="primary white--text"
                                    @click="$refs.menuFechaInicio.save(prestamo.fecha)"
                                    >Guardar</v-btn
                                    >
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Fecha de finalización</span>
                            <v-menu
                                ref="menuFechaFin"
                                v-model="menuFechaFin"
                                :close-on-content-click="false"
                                :return-value.sync="prestamo.fechaFin"
                                transition="scale-transition"
                                offset-y  
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                    v-model="prestamo.fechaFin" 
                                    outlined readonly append-icon="mdi-calendar"
                                    dense class="textFieldCustom fechaCustom" color="secondary"
                                    v-bind="attrs"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="prestamo.fechaFin"
                                    no-title color="primary"
                                    scrollable
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn elevation="0" text color="secondary white--text" @click="menuFechaFin = false"
                                    >Cancelar</v-btn
                                    >
                                    <v-btn
                                    text elevation="0" 
                                    color="primary white--text"
                                    @click="$refs.menuFechaFin.save(prestamo.fechaFin)"
                                    >Guardar</v-btn
                                    >
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                    
                    <v-row >
                        <v-col cols="12" md="12" class="py-0">
                            <span class="inputTitle" >Descripción</span>
                            <v-textarea outlined name="input-7-4" rows="2" v-model="prestamo.descripcion" dense class="textAreaCustom" color="secondary" ></v-textarea>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="12" sm="12" justify="end" align="end" class="py-0">
                            <v-btn class="white--text" :disabled="isCreating" color="primary" elevation="0" @click="guardar">
                                Guardar cambios
                            </v-btn>
                        </v-col>
                    </v-row>

                </v-form>
            </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <script>

  import moment from 'moment';

  export default {
    props: [
        "activador",
        "editable"
    ],
    data: () => ({
        menuFechaInicio: false, 
        menuFechaFin: false, 
        prestamo: {
            monto: null,
            interes: null,
            fecha: null,
            fechaFin: null,
            concepto: null,
            descripcion: null,
            clienteId: null,
            frecuenciaInteresId: null,
            frecuenciaPagoId: null,
            estado: true
        },
        inputRules: [ 
            v => !!v || '⚠ Campo requerido',
        ], 
        isCreating: false,
        user: null,
        title: 'Crear préstamo',
        mounted: false,
        clientes: [],
        frecuencias: [],
    }),
    async mounted(){
    
    this.getFrecuencias();
    this.getClientes();

      if(this.editable){
        this.title = "Editar préstamo"
        this.prestamo = this.editable;
        this.prestamo.fecha= this.prestamo.fecha.replace("T00:00:00","");
        this.prestamo.fechaFin = this.prestamo.fechaFin.replace("T00:00:00","");
      }
      this.mounted = true;

    },
    methods: {

        nombreCompleto: item => item.nombre + ' ' + item.apellido,

        clean(){
            this.prestamo = {
                monto: null,
                interes: null,
                fechaInicio: null,
                fechaFin: null,
                concepto: null,
                descripcion: null,
                clienteId: null,
                frecuenciaInteresId: null,
                frecuenciaPagoId: null,
                estado: true
            },
            this.$emit("actualizar", false);
        },

        close(){
            this.prestamo = {
            monto: null,
            interes: null,
            fechaInicio: null,
            fechaFin: null,
            concepto: null,
            descripcion: null,
            clienteId: null,
            frecuenciaInteresId: null,
            frecuenciaPagoId: null,
            estado: true
        },
            this.$emit("actualizar", true);
        },

        async guardar(){

            if(this.$refs.form.validate()){
                try{
                    this.isCreating = true;
                    let response;
                    let prestamo = this.prestamo;
                    prestamo.total = await this.getTotal();

                    if(this.editable == null){
                        response = await this.$api.post("api/prestamo", prestamo);
                    }else{
                        response = await this.$api.put("api/prestamo", prestamo);
                    }

                    this.$print(response);
                    this.close();

                }catch(error){
                    this.$print(error);
                    let text = "Ocurrió un error"
                    if(error.response){
                        text = error.response.data.error;
                    }

                    this.$alert('error', 'prestamo', text, 3000);
                
                }finally{
                    this.isCreating = false;
                }
            }
            
        },

        async getTotal() {
            try{
                    
                let frecuenciaInteres = await this.frecuencias.find(x=>x.frecuenciaId == this.prestamo.frecuenciaInteresId)
                this.$print(frecuenciaInteres)

                let cuotaFI  =  parseFloat(this.prestamo.monto) / await this.calcDiff(frecuenciaInteres.key) +
                (parseFloat(this.prestamo.monto))*(parseFloat(this.prestamo.interes)/100);

                let total = cuotaFI * await this.calcDiff(frecuenciaInteres.key);
                this.$print(total);

                return total;

            }catch(error){
                this.$print(error);
            }
            
        },

        calcDiff( frecuencia ){
            let fechaInicio = moment(this.prestamo.fecha);
            let fechaFin = moment(this.prestamo.fechaFin);
            return fechaFin.diff(fechaInicio, frecuencia )
        },

        
        async getClientes() {
            try{
                this.isLoading = true;
                let clientes = await this.$api.get(`api/cliente`);

                this.clientes = await clientes.data;
                this.$print(this.clientes);
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },

        async getFrecuencias() {
            try{
                this.isLoading = true;
                let frecuencias = await this.$api.get(`api/frecuencias`);

                this.frecuencias = await frecuencias.data;
                this.$print(this.frecuencias);
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },
    }
}
</script>
<style lang="scss">

    .prestamoPopup{

        .inputTitle{
            font-size: 14px;
            font-weight: 500;
            
        }
    }

</style>