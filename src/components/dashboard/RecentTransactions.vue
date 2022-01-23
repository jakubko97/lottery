<template>
 <v-card>
    <v-card-title>
      Recent transactions
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="transactions"
      :search="search"
    ></v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "RecentTransactions",
  data(){
      return {
        search: '',
        headers: [
          {
            text: 'Tx',
            align: 'start',
            sortable: false,
            value: 'tx',
          },
          { text: 'From', value: 'from' },
          { text: 'To', value: 'to' },
          { text: 'Value', value: 'value' },
          { text: 'Tickets', value: 'tickets' }        ], 
        transactions: [
          {
            tx: '140',
            from: "0xc1da6e594a55faAD15fe1E5fF5c8FbE5EAbdaE2b",
            to: "0xa4C016f4f85FC0FD2E53f5B04DC490eb4858B599",
            value: 18,
            tickets: 7          }
        ]
      }
  },
  methods: {
    createProject() {
      this.$router.push("/CreateProject");
    },
  },
};
</script>
