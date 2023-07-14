<template>

    <v-container class="px-15 pb-10" v-if="cliente">
      <v-row class="px-4">
        <v-col cols="12" sm="5" class="text-left">
            <h3 class="primary--text moduleTitle">
                {{ cliente.nombre }} {{ cliente.apellido }} &nbsp;<v-icon color="primary" class="mb-1">mdi-account</v-icon>
            </h3>
            <h4 class="text--secondary">
                Información detallada del cliente
            </h4>
        </v-col>
        <v-col cols="12" sm="7" class="text-right">
            <h3 class="primary--text">
                Código: {{ cliente.clienteId }}
            </h3>
        </v-col>
      </v-row>
  
      <v-row class="mt-4">
        <v-col>
          <v-card flat color="back" class="mx-4 py-8 px-8">
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="6">
                        <span class="titleText secondary--text">Nombre: </span>
                        <span class="descriptionText">{{ cliente.nombre }}</span>
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="titleText secondary--text">Apellido: </span>
                        <span class="descriptionText">{{ cliente.apellido }}</span>
                    </v-col>
                </v-row>

                <v-row >
                    <v-col cols="12" md="6">
                        <span class="titleText secondary--text">Cédula: </span>
                        <span class="descriptionText">{{ cliente.cedula }}</span>
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="titleText secondary--text">Fecha de Nacimiento: </span>
                        <span class="descriptionText">
                            <span v-if="cliente.fechaNacimiento">{{ formatDate(cliente.fechaNacimiento, false) }}</span>
                            <span v-else>Sin registrar</span>
                        </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" md="6">
                        <span class="titleText secondary--text">Teléfono: </span>
                        <span class="descriptionText">
                            <span v-if="cliente.telefono">{{ formatPhoneNumber(cliente.telefono) }}</span>
                            <span v-else>Sin registrar</span>
                        </span>
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="titleText secondary--text">Correo: </span>
                        <span class="descriptionText">
                            <span v-if="cliente.correo">{{ cliente.correo }}</span>
                            <span v-else>Sin registrar</span>
                        </span>
                    </v-col>
                </v-row>

                <v-row class="mt-15">
                    <v-col cols="12" md="6">
                        <span class="titleText secondary--text">Dirección: </span>
                        <span class="descriptionText">
                            <span v-if="cliente.direccio">{{ cliente.direccion }}</span>
                            <span v-else>Sin registrar</span>
                        </span>
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="titleText secondary--text">Observaciones: </span>
                        <span class="descriptionText">
                            <span v-if="cliente.observaciones">{{ cliente.observaciones }}</span>
                            <span v-else>Sin registrar</span>
                        </span>
                    </v-col>
                </v-row>

            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  
  export default {

    middleware: "auth-this",
  
    async mounted(){
        this.user = await this.$store.state.userManager.user;
        this.getAll();
    },
  
    data() {
        return {
            isLoading: false,
            cliente: null,
            user: null,
        };
    },
  
    methods: {
        async getAll() {
            try{
                this.isLoading = true;
                let id = this.$route.query.id;
                let cliente = await this.$api.get(`api/cliente/${id}`);

                this.cliente = await cliente.data;
                this.$print(this.cliente);
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },

        formatPhoneNumber( str ){
            let cleaned = ('' + str).replace(/\D/g, '');
    
            let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
            
            if (match) {
            let intlCode = (match[1] ? '+1 ' : '')
            return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
            }
            
            return str;
        },

        formatDate( date, hours){
            return this.$formatDate(date, hours);
        }
    
  
    },

  };
  </script>
  
  <style lang='scss' >

    .moduleTitle{
        font-size: 22px;
        font-weight: 500;
    }

    .titleText{
        font-size: 14px;
        font-weight: 500;
    }

    .descriptionText{
        font-size: 14px;
    }

  </style>