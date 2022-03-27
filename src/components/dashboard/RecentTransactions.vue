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
      :loading="loading"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
    >
      <template #[`item.value`]="{ item }">
        <v-chip v-if="item.method == 'buyTicket'" :color="'accent'">
          {{ $web3.utils.fromWei(item.value, "ether") }}
        </v-chip>
      </template>
      <template #[`item.hash`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <a
              :href="'https://rinkeby.etherscan.io/tx/' + item.hash"
              target="_blank"
              v-bind="attrs"
              v-on="on"
              >{{ truncateStart(item.hash) }}</a
            >
          </template>
          <span>{{ item.hash }}</span>
        </v-tooltip>
      </template>

      <template #[`item.from`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">{{ truncateStart(item.from) }}</span>
          </template>
          <span>{{ item.from }}</span>
        </v-tooltip>
      </template>
      <template #[`item.to`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">{{ truncateStart(item.to) }}</span>
          </template>
          <span>{{ item.to }}</span>
        </v-tooltip>
      </template>
      <template #[`item.timeStamp`]="{ item }">
        {{ getDateFormat(item.timeStamp) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import createLottery from "../../../contracts/createLotteryInstance";
import apiCalls from "../../services/index";

export default {
  name: "RecentTransactions",
  data() {
    return {
      search: "",
      loading: false,
      headers: [
        {
          text: "Tx",
          align: "start",
          sortable: false,
          value: "hash",
        },
        { text: "From", value: "from" },
        { text: "To", value: "to" },
        { text: "Value (eth)", value: "value" },
        { text: "Timestamp", value: "timeStamp" },
        { text: "Method", value: "method" },
        { text: "Tickets", value: "tickets" },
      ],
      sortBy: "timeStamp",
      sortDesc: true,
      transactions: [],
      projectAddress: [],
    };
  },
  created() {
    this.getAllProjects();
  },

  methods: {
    decodeInputData(inputData) {
      let decodedData = this.$abiDecoder.decodeMethod(inputData);
      // decodedData = JSON.parse(decodedData)
      return decodedData;
    },
    getDateFormat(uintDate) {
      return this.$utils.formatDate(new Date(+uintDate * 1000));
    },
    truncateMiddle(str, n) {
      return str.substr(0, 18) + "..." + str.substr(str.length - 3, str.length);
    },
    truncateStart(str) {
      return str.substr(0, 18) + "...";
    },
    async getAllProjects() {
      this.loading = true;
      await createLottery.methods
        .returnAllLotteries()
        .call()
        .then((res) => {
          this.projectAddress = res;
        })
        .catch((e) => {})
        .finally(() => {});

      await Array.from(this.projectAddress, (address) => {
        apiCalls.getTransactionsByAccount(address).then((res) => {
          this.transactions = this.transactions.concat(res.data.result);
          Array.from(this.transactions, (item) => {
            const decodedData = this.decodeInputData(item.input);
            item.method = decodedData.name;
            if (decodedData.params.length != 0) {
              item.tickets = decodedData.params[1].value;
            }
            console.log(decodedData);
          });
        });

        this.loading = false;
      });
    },
    createProject() {
      this.$router.push("/CreateProject");
    },
  },
};
</script>
