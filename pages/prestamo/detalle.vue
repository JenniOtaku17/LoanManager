<template>

    <v-container class="px-6 pb-10" v-if="prestamo">
      <v-row class="px-4">
        <v-col cols="12" sm="5" class="text-left">
            <h3 class="primary--text moduleTitle">
                Código de Préstamo: {{prestamo.prestamoId}}
            </h3>
        </v-col>
        <v-col cols="12" sm="7" class="text-right">
        </v-col>
      </v-row>
  
      <v-row class="mt-4">
        <v-col>
          <v-card flat class="px-4">

            <v-tabs
              v-model="tabs"
            >
                <v-tabs-slider></v-tabs-slider>
                <v-tab>
                  Información<v-icon right>mdi-text-box-search-outline</v-icon>
                </v-tab>

                <v-tab>
                  Registro de Pagos<v-icon right>mdi-cash-multiple</v-icon>
                </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tabs">
              <v-tab-item>
                
                <v-row class="mt-4">
                  <v-col>
                    <v-card flat color="back" class="mx-4 py-8 px-8">
                      <v-card-text>
                          <v-row>
                              <v-col cols="12" md="6">
                                  <span class="titleText secondary--text">Monto: </span>
                                  <span class="descriptionText">{{ prestamo.monto }}</span>
                              </v-col>
                              <v-col cols="12" md="6">
                                  <span class="titleText secondary--text">Concepto: </span>
                                  <span class="descriptionText">{{ prestamo.concepto }}</span>
                              </v-col>
                          </v-row>

                          <v-row>
                              <v-col cols="12" md="6">
                                  <span class="titleText secondary--text">Interés: </span>
                                  <span class="descriptionText">{{ prestamo.interes }}</span>
                              </v-col>
                              <v-col cols="12" md="6">
                                  <span class="titleText secondary--text">Nombre del cliente: </span>
                                  <span class="descriptionText">{{ prestamo.clienteId }}</span>
                              </v-col>
                          </v-row>

                          <v-row >
                              <v-col cols="12" md="6">
                                  <span class="titleText secondary--text">Fecha de inicio: </span>
                                  <span class="descriptionText">{{ prestamo.fecha }}</span>
                              </v-col>
                              <v-col cols="12" md="6">
                                  <span class="titleText secondary--text">Fecha final: </span>
                                  <span class="descriptionText">{{ prestamo.fechaFin }}</span>
                              </v-col>
                          </v-row>

                          <v-row >
                              <v-col cols="12" md="6">
                                  <span class="titleText secondary--text">Frecuencia de interés: </span>
                                  <span class="descriptionText">{{ prestamo.frecuenciaInteresId }}</span>
                              </v-col>
                              <v-col cols="12" md="6">
                                  <span class="titleText secondary--text">Frecuencia de pago: </span>
                                  <span class="descriptionText">{{ prestamo.frecuenciaPagoId }}</span>
                              </v-col>
                          </v-row>

                          <v-row max-width="70%">
                              <v-col cols="12" md="12" >
                                  <span class="titleText secondary--text">Descripción: </span>
                                  <span class="descriptionText">{{ prestamo.descripcion }}</span>
                              </v-col>
                          </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

              </v-tab-item>

              <v-tab-item class="pt-8">
                  <v-row class="px-4">
                      <v-col cols="12" sm="8">
                      </v-col>
                      <v-col cols="12" sm="4" class="text-right">
                        <v-btn color="primary" elevation="0" @click="openPago(false, null)">
                            <v-icon left>mdi-plus</v-icon>Agregar Pago
                        </v-btn>
                      </v-col>
                  </v-row>
                  <v-card-text class="px-0">
                    <v-data-table :headers="headers" :items="pagos" :loading="isLoading" dense hide-default-footer
                      loading-text="Buscando registros..." class="customTable" no-data-text="No se han encontrado resultados"
                      :page="page" :items-per-page="itemsPerPage"
                    >
                      <template v-slot:body="{ items }" v-if="pagos && pagos.length > 0">
                        <tbody>
                          <tr v-for="item in items" class="puntero" :key="item.pagoId">
                              <td>{{ item.pagoId }}</td>
                              <td>{{ item.monto }}</td>
                              <td>{{ item.fc }}</td>
                              <td align="center">
                                <v-btn class="elevation-0" color="secondary" icon small @click="openPago(true, item)"><v-icon>mdi-pencil-circle-outline</v-icon></v-btn>
                                <v-btn class="elevation-0" color="error" icon small @click="deletePago(item)"><v-icon>mdi-close-circle-outline</v-icon></v-btn>
                              </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-data-table>
                  </v-card-text>
                  <v-row class="px-5">
                      <v-pagination
                          v-model="page"
                          class="my-4"
                          :length="paginationLength"
                          circle
                          :total-visible="6"
                      ></v-pagination>
                  </v-row>
              </v-tab-item>

            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
      <popup v-if="dialog" :activador="dialog" @actualizar="actualizar" :editable="editable" />
    </v-container>
  </template>
  
  <script>
  import popup from "~/components/pago/popup";
  
  export default {

    middleware: "auth-this",
  
    components: {
      popup
    },
  
    async mounted(){
        this.user = await this.$store.state.userManager.user;
        this.getDetallesPrestamo();
        this.getPagos();
    },
  
    data() {
        return {
            isLoading: false,
            pagos: [],
            filterText: '',
            user: null,
            prestamo: null,
            headers: [
                { text: "Código", value: 'cedula' },
                { text: "Monto", value: "nombre" },
                { text: "Fecha", value: "fc" },
                { text: "Acciones", align:'center', sortable: false }
            ],
            dialog: false,
            editable: null,
            tabs: null,
            itemsPerPage: 5,
            page: 1,
            paginationLength: 1,
        };
    },
  
    methods: {
        async getPagos() {
            try{
                this.isLoading = true;
                let id = this.$route.query.id;
                let pagos = await this.$api.get(`api/pago`);

                this.pagos = await pagos.data.filter((p)=> p.prestamoId == id && p.estado == true);
                this.$print(this.pagos);
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },

        async getDetallesPrestamo() {
            try{
                this.isLoading = true;
                let id = this.$route.query.id;
                let prestamo = await this.$api.get(`api/prestamo/${id}`);

                this.prestamo = await prestamo.data;
                this.$print(this.prestamo);
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },
    
        openPago( toEdit, obj){
            if(toEdit){
                this.editable = obj;
            }
            this.dialog = true;
        },
    
        actualizar( toUpdate ) {
            if(toUpdate){
                this.getPagos();
            }
            this.dialog = false;
            this.editable = null;
        },
    
        async deletePago(pago){
            try{

                let result = await this.$confirm('Va a eliminar el pago', `Está seguro que desea eliminar el pago ${pago.pagoId}?`)
                if(result.isConfirmed){
                    await this.$api.put("api/pago/changestatus/"+pago.pagoId );
                    this.getPagos();
                }

            }catch(error){
                this.$print(error);

                let text = "Ocurrió un error al eliminar prestamo"
                if(error.response.data.error){
                    text = error.response.data.error;
                }
                this.$alert('error', 'Pago', text, null);
            }
        },
  
    }

  };
  </script>
  
  <style lang='scss' >

    .v-slide-group__content{
      border-bottom: 2px solid #9ca39d;
    }

    .v-tabs-slider-wrapper{
      bottom: -2px;
    }

    .moduleTitle{
        font-size: 22px;
        font-weight: 500;
    }

  </style>