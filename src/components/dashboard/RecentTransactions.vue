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
        outlined
        dense
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
      :page.sync="page"
      :items-per-page="offset"
      no-data-text="No transactions found"
      loading-text="Loading transactions. Please wait."
    >
      <template #[`header.age`]="{ header }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span
              style="cursor: pointer"
              class="primary--text"
              @click="changeTimeFormat()"
              v-bind="attrs"
              v-on="on"
              attrs="attrs"
              >{{ header.text }}</span
            >
          </template>
          <span
            >Click to show
            {{ dateTimeFormat ? "Age Format" : "Datetime Format" }}</span
          >
        </v-tooltip>
      </template>
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
            <span v-bind="attrs" v-on="on">
              <v-icon small>mdi-file-document</v-icon
              >{{ truncateStart(item.to) }}</span
            >
          </template>
          <span>
            {{ item.to }}
          </span>
        </v-tooltip>
      </template>
      <template #[`item.age`]="{ item }">
        {{ dateTimeFormat ? item.dateTime : dateInMilliseconds(item.age) }}
      </template>
    </v-data-table>
    <!-- <v-pagination
      color="accent"
      @input="updatePage"
      v-model="page"
      :length="pageCount"
    ></v-pagination> -->
  </v-card>
</template>

<script>
import createLottery from "../../../contracts/BuildLotteryInstance";
import apiCalls from "../../services/index";

export default {
  name: "RecentTransactions",
  props: {
    projectAddresses: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      search: "",
      loading: false,
      headers: [
        {
          text: "Tx Hash",
          align: "start",
          sortable: false,
          value: "hash",
        },
        { text: "From", value: "from", sortable: false },
        { text: "To", value: "to", sortable: false },
        { text: "Value (eth)", value: "value", sortable: false },
        { text: "Age", value: "age", sortable: false },
        { text: "Method", value: "method", sortable: false },
        { text: "Tickets", value: "tickets", sortable: false },
      ],
      sortBy: "timeStamp",
      sortDesc: true,
      transactions: [],
      page: 1,
      pageCount: 2,
      offset: 10,
      dateTimeFormat: false,
      now: Math.trunc(new Date().getTime() / 1000),
    };
  },
  created() {
    if (this.projectAddresses.length != 0) {
      this.getAllTransactions();

      // apiCalls.getTransactionsByAccount(this.projectAddresses[0]).then((res) => {
      //   console.log(res);
      // });
    }
  },
  methods: {
    updatePage() {
      this.getAllTransactions();
    },
    dateInMilliseconds(age) {
      const milliseconds = Math.trunc(Date.parse(age) / 1000);
      const seconds = Math.abs((milliseconds - this.now) % 60);
      const minutes = Math.abs(Math.trunc((milliseconds - this.now) / 60) % 60);
      const hours = Math.abs(
        Math.trunc((milliseconds - this.now) / 60 / 60) % 24
      );
      const days = Math.abs(
        Math.trunc((milliseconds - this.now) / 60 / 60 / 24)
      );
      let finalString = "";
      const secondsOverall = Math.abs(milliseconds - this.now);
      if (secondsOverall < 60) {
        finalString = seconds + " sec";
      } else if (secondsOverall >= 60 && secondsOverall < 3600) {
        finalString = minutes + " mins";
      } else if (secondsOverall >= 3600 && secondsOverall < 86400) {
        finalString = hours + " hrs " + minutes + " mins";
      } else {
        finalString = days + " days ";
      }
      return finalString + " ago";
    },
    parseDateToAge() {
      return this.minutes;
    },
    changeTimeFormat() {
      this.dateTimeFormat = !this.dateTimeFormat;
    },
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
    async getAllTransactions() {
      this.transactions = [];
      this.loading = true;
      await Array.from(this.projectAddresses, (address) => {
        apiCalls
          .getTransactionsByAccount(address, this.page, this.offset)
          .then((res) => {
            this.transactions = this.transactions.concat(res.data.result);
            Array.from(this.transactions, (item) => {
              item.age = new Date(item.timeStamp * 1000);
              item.dateTime = this.getDateFormat(item.timeStamp);
              const decodedData = this.decodeInputData(item.input);
              item.method = decodedData.name;
              if (decodedData.params.length != 0) {
                item.tickets = decodedData.params[1].value;
              }
            });
          })
          .catch((e) => {})
          .finally(() => {
            this.loading = false;
          });
      });
    },
    createProject() {
      this.$router.push("/CreateProject");
    },
  },
};
</script>
