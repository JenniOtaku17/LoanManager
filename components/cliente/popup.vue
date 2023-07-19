<template>
    <div v-if="mounted">
      <v-dialog v-model="activador" width="650" persistent>
        <v-card class="clientePopup">
            <v-card-title>
                <h3 class="primary--text">{{title}}</h3>
                <v-spacer></v-spacer>
                <v-btn icon @click="clean"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text class="pt-4 pb-9 px-10">
                <v-form ref="form">
                    <v-row>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Nombre</span>
                            <v-text-field  v-model="cliente.nombre"  dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Apellido</span>
                            <v-text-field  v-model="cliente.apellido"  dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Cédula</span>
                            <v-text-field  v-model="cliente.cedula" type="number"  dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Fecha Nacimiento</span>
                            <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                :return-value.sync="cliente.fechaNacimiento"
                                transition="scale-transition"
                                offset-y  
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                    v-model="cliente.fechaNacimiento" 
                                    outlined readonly append-icon="mdi-calendar"
                                    dense class="textFieldCustom fechaCustom" color="secondary"
                                    v-bind="attrs"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="cliente.fechaNacimiento"
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
                                    @click="$refs.menu.save(cliente.fechaNacimiento)"
                                    >Guardar</v-btn
                                    >
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                    <v-row >
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Teléfono</span>
                            <v-text-field  v-model="cliente.telefono" type="number"  dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Correo</span>
                            <v-text-field  v-model="cliente.correo" type="email"  dense outlined class="textFieldCustom" color="secondary"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row >
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Dirección</span>
                            <v-textarea v-model="cliente.direccion" rows="3" no-resize outlined class="textFieldCustom" color="secondary"></v-textarea>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Observaciones</span>
                            <v-textarea v-model="cliente.observaciones" rows="3" no-resize outlined class="textFieldCustom" color="secondary"></v-textarea>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="12" sm="12" justify="end" align="end">
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
  
  export default {
    props: [
        "activador",
        "editable"
    ],
    data: () => ({
        menu: false,
        cliente: {
            cedula: null,
            nombre: null,
            correo: null,
            apellido: null,
            telefono: null,
            direccion: null,
            fechaNacimiento: null,
            estado: true
        },
        inputRules: [
            v => !!v || '⚠ Campo requerido',
        ],
        isCreating: false,
        user: null,
        title: 'Crear cliente',
        mounted: false,
    }),
    async mounted(){

      if(this.editable){
        this.title = "Editar Cliente"
        this.cliente = this.editable;
      }
      this.mounted = true;

    },
    methods: {

        clean(){
            this.cliente = {
                cedula: null,
                nombre: null,
                apellido: null,
                telefono: null,
                direccion: null,
                fechaNacimiento: null,
                estado: true
            };
            this.$emit("actualizar", false);
        },

        close(){
            this.cliente = {
                cedula: null,
                nombre: null,
                apellido: null,
                telefono: null,
                direccion: null,
                fechaNacimiento: null,
                estado: true
            };
            this.$emit("actualizar", true);
        },

        async guardar(){

            if(this.$refs.form.validate()){
                try{
                    this.isCreating = true;
                    let response;

                    if(this.editable == null){
                        response = await this.$api.post("api/cliente", this.cliente);
                    }else{
                        response = await this.$api.put("api/cliente", this.cliente);
                    }

                    this.$print(response);
                    this.close();

                }catch(error){
                    this.$print(error);
                    let text = "Ocurrió un error"
                    if(error.response){
                        text = error.response.data.error;
                    }

                    this.$alert('error', 'Cliente', text, 3000);
                
                }finally{
                    this.isCreating = false;
                }
            }
            
        }
    }
}
</script>
<style lang="scss">

    .clientePopup{

        .inputTitle{
            font-size: 14px;
            font-weight: 500;
            
        }
    }

</style>