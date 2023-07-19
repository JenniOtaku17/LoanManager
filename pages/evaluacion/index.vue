<template>

    <v-container class="px-6 pb-10 pageEvaluacion">
      <v-row class="px-4">
        <v-col cols="12" sm="5" class="text-left">
            <h3 class="primary--text moduleTitle">
                Evaluación de Cliente &nbsp;<v-icon color="primary" class="mb-1">mdi-account-search</v-icon>
            </h3>
            <h5 class="text--secondary">
                Evalua los ingresos y egresos de tus clientes para comprobar si califican para el monto del préstamo.
            </h5>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col>
          <v-card flat class="px-15 pt-4">
            <v-card-text class="px-15">
                <v-form ref="form">
                    <v-row>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Ingresos del cliente</span>
                            <v-text-field prepend-inner-icon="mdi-plus"  v-model="form.ingresos" type="number"  dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Egresos del cliente</span>
                            <v-text-field prepend-inner-icon="mdi-minus" v-model="form.egresos"  type="number" dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Monto del Préstamo</span>
                            <v-text-field append-icon="mdi-cash-multiple" v-model="form.monto" type="number" dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Interés del Préstamo</span>
                            <v-text-field append-icon="mdi-percent" v-model="form.interes" type="number" dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row >
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Frecuencia de Interés</span>
                            <v-select v-model="form.frecuenciaInteres" dense outlined :rules="inputRules" class="textFieldCustom" color="secondary" :items="frecuencias" item-text="nombre" item-value="key" append-icon="mdi-chevron-down"></v-select>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Frecuencia de Pagos</span>
                            <v-select v-model="form.frecuenciaPago" dense outlined :rules="inputRules" class="textFieldCustom" color="secondary" :items="frecuencias" item-text="nombre" item-value="key" append-icon="mdi-chevron-down"></v-select>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Fecha de Inicio</span>
                            <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                :return-value.sync="form.fechaInicio"
                                transition="scale-transition"
                                offset-y  
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                    v-model="form.fechaInicio" 
                                    outlined readonly append-icon="mdi-calendar"
                                    dense class="textFieldCustom fechaCustom" color="secondary"
                                    v-bind="attrs" :rules="inputRules"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="form.fechaInicio"
                                    no-title
                                    scrollable
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn elevation="0" text color="secondary white--text" @click="menu = false"
                                    >Cancelar</v-btn
                                    >
                                    <v-btn
                                    text elevation="0" 
                                    color="primary white--text"
                                    @click="$refs.menu.save(form.fechaInicio)"
                                    >Guardar</v-btn
                                    >
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Fecha de Finalización</span>
                            <v-menu
                                ref="menu1"
                                v-model="menu1"
                                :close-on-content-click="false"
                                :return-value.sync="form.fechaFin"
                                transition="scale-transition"
                                offset-y  
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                    v-model="form.fechaFin" 
                                    outlined readonly append-icon="mdi-calendar"
                                    dense class="textFieldCustom fechaCustom" color="secondary"
                                    v-bind="attrs" :rules="inputRules"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="form.fechaFin"
                                    no-title
                                    scrollable
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn elevation="0" text color="secondary white--text" @click="menu1 = false"
                                    >Cancelar</v-btn
                                    >
                                    <v-btn
                                    text elevation="0" 
                                    color="primary white--text"
                                    @click="$refs.menu1.save(form.fechaFin)"
                                    >Guardar</v-btn
                                    >
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="12" sm="12" justify="end" align="end">
                            <v-btn class="white--text" :disabled="isLoading" color="secondary" elevation="0" @click="clean">
                                Limpiar Campos
                            </v-btn>
                            <v-btn class="white--text" :disabled="isLoading" color="primary" elevation="0" @click="evaluar">
                                Evaluar Cliente
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import moment from 'moment';

  export default {

    middleware: "auth-this",
  
    async mounted(){
        this.user = await this.$store.state.userManager.user;
    },
  
    data() {
        return {
            isLoading: false,
            user: null,
            menu: false,
            menu1: false,
            form: {
                ingresos: null,
                egresos: null,
                monto: null,
                interes: null,
                frecuenciaInteres: null,
                frecuenciaPago: null,
                fechaInicio: null,
                fechaFin: null
            },
                inputRules: [
                v => !!v || '⚠ Campo requerido',
            ],
            frecuencias: [
                { nombre: 'Semanal', key: 'weeks' },
                { nombre: 'Mensual', key: 'months' },
                { nombre: 'Anual', key: 'years' }
            ]
        };
    },
  
    methods: {
        async evaluar() {
            try{
                if(this.$refs.form.validate()){
                    
                    this.isLoading = true;

                    let cuotaFI  = parseFloat(this.form.monto) / this.calcDiff(this.form.frecuenciaInteres) +
                    (parseFloat(this.form.monto))*(parseFloat(this.form.interes)/100);
                    let cuotaFP;

                    switch(this.form.frecuenciaInteres){
                        case 'weeks':

                            switch(this.form.frecuenciaPago){
                                case 'weeks':
                                    cuotaFP = cuotaFI;
                                    break;
                                case 'months':
                                    cuotaFP = cuotaFI * 4;
                                    break;
                                case 'years':
                                    cuotaFP = cuotaFI * 52;
                                    break;

                            }
                            break;

                        case 'months':

                            switch(this.form.frecuenciaPago){
                                case 'weeks':
                                    cuotaFP = cuotaFI / 4;
                                    break;
                                case 'months':
                                    cuotaFP = cuotaFI;
                                    break;
                                case 'years':
                                    cuotaFP = cuotaFI * 12;
                                    break;

                            }
                            break;

                        case 'years':

                            switch(this.form.frecuenciaPago){
                                case 'weeks':
                                    cuotaFP = cuotaFI/ 52;
                                    break;
                                case 'months':
                                    cuotaFP = cuotaFI/ 12;
                                    break;
                                case 'years':
                                    cuotaFP = cuotaFI;
                                    break;

                            }
                            break;

                    }

                    this.$print(cuotaFI);
                    this.$print(cuotaFP);

                    let frecuenciaPago = this.frecuencias.find(x=> x.key == this.form.frecuenciaPago)

                    if(cuotaFP <= ((this.form.ingresos - this.form.egresos) * 0.70)){
                        this.$alert('success', 'Evaluación Aprobada', `El cliente estaría pagando una cuota de ${this.numberFormat(Math.round(cuotaFP))} de forma ${frecuenciaPago.nombre}`, null)
                    
                    }else{
                        this.$alert('error', 'Evaluación Denegada', `El cliente estaría pagando una cuota de ${this.numberFormat(Math.round(cuotaFP))} de forma ${frecuenciaPago.nombre}, lo cual excede al 70% del de sus ingresos netos`, null)
                    }

                    this.isLoading = false;
                }

            }catch(error){
                this.$print(error)
            }
            
        },

        clean(){
            this.form = {
                ingresos: null,
                egresos: null,
                monto: null,
                interes: null,
                frecuenciaInteres: null,
                frecuenciaPago: null,
                fechaInicio: null,
                fechaFin: null
            };

        },

        calcDiff( frecuencia ){
            let fechaInicio = moment(this.form.fechaInicio);
            let fechaFin = moment(this.form.fechaFin);
            return fechaFin.diff(fechaInicio, frecuencia )
        },

        numberFormat(amount){
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            return formatter.format(amount);

        }
        
  
    },
  };
  </script>
  
  <style lang='scss' >

  .pageEvaluacion{

    .moduleTitle{
        font-size: 22px;
        font-weight: 500;
    }
  }

  </style>