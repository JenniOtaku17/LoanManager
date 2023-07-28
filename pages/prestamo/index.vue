<template>

    <v-container class="px-6 pb-10 pagePrestamo">
      <v-row class="px-4">
        <v-col cols="12" sm="5" class="text-left">
            <h3 class="primary--text moduleTitle">
                Módulo de Préstamos &nbsp;<v-icon color="primary" class="mb-1">mdi-account-group</v-icon>
            </h3>
            <h5 class="text--secondary">
                Administra todos los préstamos de tu empresa, puedes añadir uno nuevo o modificar o eliminar alguno existente.
            </h5>
        </v-col>
        <v-col cols="12" sm="7" class="text-right">
            <v-btn color="primary" elevation="0" @click="openPrestamo(false, null)">
                <v-icon left>mdi-plus</v-icon>Agregar Préstamo
            </v-btn>
        </v-col>
      </v-row>
  
      <v-row class="mt-4">
        <v-col>
          <v-card flat>
            <v-row class="px-4">
                <v-col cols="12" sm="8">
                </v-col>
                <v-col cols="12" sm="4" class="text-right">
                    <v-text-field
                    v-model="filterText"
                    append-icon="mdi-magnify"
                    rounded flat outlined dense
                    label="Buscar"
                    id="id" class="not-form-input"
                    autocomplete="off"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-card-text>
              <v-data-table :headers="headers" :items="filteredPrestamos" :loading="isLoading" dense hide-default-footer
                loading-text="Buscando registros..." class="customTable" no-data-text="No se han encontrado resultados"
                :page="page" :items-per-page="itemsPerPage"
              >
                <template v-slot:body="{ items }" v-if="filteredPrestamos && filteredPrestamos.length > 0">
                  <tbody>
                    <tr v-for="item in items" class="puntero" :key="item.departamentoId">
                        <td>{{ item.prestamoId }}</td>
                        <td>
                            <span v-if="item.cliente">{{ item.cliente.nombre }} {{ item.cliente.apellido }}</span>
                        </td>
                        <td>{{ item.concepto }}</td>
                        <td align="end">{{ numberFormat(item.monto) }}</td>
                        <td align="end">{{ item.interes }}%</td>
                        <td align="end">{{ numberFormat(item.total) }}</td>
                        <td align="center">{{ formatDate(item.fecha, false) }} - {{ formatDate(item.fechaFin, false) }}</td>
                        <td align="center" style="white-space: pre;">
                          <v-btn class="elevation-0" color="primary" icon small @click="verDetalle(item.prestamoId)"><v-icon>mdi-file-eye</v-icon></v-btn>
                          <v-btn class="elevation-0" color="secondary" icon small @click="openPrestamo(true, item)"><v-icon>mdi-pencil-circle-outline</v-icon></v-btn>
                          <v-btn class="elevation-0" color="error" icon small @click="deletePrestamo(item)"><v-icon>mdi-close-circle-outline</v-icon></v-btn>
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
          </v-card>
        </v-col>
      </v-row>
      <popup v-if="dialog" :activador="dialog" @actualizar="actualizar" :editable="editable" />
    </v-container>
  </template>
  
  <script>
  import popup from "~/components/prestamo/popup";
  
  export default {
    middleware: "auth-this",
  
    components: {
      popup
    },
  
    async mounted(){
        this.user = await this.$store.state.userManager.user;
        this.getAll();
    },
  
    data() {
        return {
            isLoading: false,
            prestamos: [],
            filterText: '',
            user: null,
            headers: [
                { text: "Código", value: 'prestamoId' },
                { text: "Cliente", value: 'clienteId', sortable: false },
                { text: "Concepto", value: 'concepto' },
                { text: "Monto", value: 'monto', align: 'end' },
                { text: "Interés", value: 'interes', align: 'end' },
                { text: "Total", value: 'total', align: 'end' },
                { text: "Rango de fecha", value: 'fecha', align: 'center' },
                { text: "Acciones", align:'center', sortable: false }
            ],
            dialog: false,
            editable: null,
            itemsPerPage: 5,
            page: 1,
            paginationLength: 1,
        };
    },
  
    methods: {
        async getAll() {
            try{
                this.isLoading = true;
                let prestamos = await this.$api.get(`api/prestamo`);

                this.prestamos = await prestamos.data.filter((p)=>p.estado == true);
                this.$print(this.prestamos);
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },
    
        verDetalle( id ){
            this.$router.push({ path: '/prestamo/detalle', query: { id } })
        },

        openPrestamo( toEdit, obj){
            if(toEdit){
                this.editable = obj;
            }
            this.dialog = true;
        },
    
        actualizar( toUpdate ) {
            if(toUpdate){
                this.getAll();
            }
            this.dialog = false;
            this.editable = null;
        },
    
        async deletePrestamo(prestamo){
            try{

                let result = await this.$confirm('Va a eliminar un préstamo', `Está seguro que desea eliminar el préstamo ${prestamo.prestamoId}?`)
                if(result.isConfirmed){
                    await this.$api.put("api/prestamo/changestatus/"+prestamo.prestamoId );
                    this.getAll();
                }

            }catch(error){
                this.$print(error);

                let text = "Ocurrió un error al eliminar prestamo"
                if(error.response.data.error){
                    text = error.response.data.error;
                }
                this.$alert('error', 'Préstamo', text, null);
            }
        },

        numberFormat(amount){
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            return formatter.format(amount);

        },

        formatDate( date, hours){
            return this.$formatDate(date, hours);
        },
    
        filtro(prestamos,textoFiltro){
            try{
                if(!prestamos) return [];
        
                return prestamos
                .filter(
                    e => e.concepto.toLowerCase().includes(textoFiltro.toLowerCase())
                )
            }catch(error){
                console.log(error);
            }
    
        },
  
    },
  
    computed: {
    
        filteredPrestamos(){
            return this.filtro(this.prestamos, this.filterText)
        }
    
    }
  };
  </script>
  
  <style lang='scss' >

  .pagePrestamo{

    .moduleTitle{
        font-size: 22px;
        font-weight: 500;
    }
  }

  </style>