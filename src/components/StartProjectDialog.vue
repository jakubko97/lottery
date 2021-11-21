<template>
  <v-dialog v-model="dialog" width="70%" hide-overlay>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" v-on="on">
        Create project
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline font-weight-bold mt-2 ml-4"
          >Bring your project to life</span
        >
      </v-card-title>
      <v-card-text class="pt-0">
        <v-row class="pt-0">
          <v-col md="12">
            <v-text-field
              label="Title"
              persistent-hint
              v-model="newProject.title"
            >
            </v-text-field>
          </v-col>
          <v-col md="12">
            <v-textarea
              label="Description"
              persistent-hint
              v-model="newProject.description"
            >
            </v-textarea>
          </v-col>
          <v-col md="12">
            <v-text-field
              label="Ticket Price (ETH)"
              type="number"
              step="0.0001"
              min="0"
              v-model="newProject.ticketPrice"
            >
            </v-text-field>
          </v-col>
          <v-col md="6">
            <v-date-picker :min="nowDate" v-model="date"></v-date-picker>
          </v-col>
          <v-col md="6">
            <v-time-picker
              :min="nowDate == date ? nowTime : ''"
              v-model="time"
              format="24hr"
            ></v-time-picker>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="
            dialog = false;
            newProject.isLoading = false;
          "
        >
          Close
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="startProject()"
          :loading="newProject.isLoading"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "StartProjectDialog",
  data: () => ({
    dialog: false,
    nowDate: new Date().toISOString().slice(0, 10),
    nowTime: new Date().toISOString().substring(11, 16),
    date: null,
    time: null,
    newProject: { isLoading: false },
  }),
  created() {},
  methods: {
    startProject() {
      this.newProject.deadline = new Date(
        this.date + "T" + this.time + ":00"
      ).getTime();
      this.newProject.deadline = this.newProject.deadline / 1000;
      this.$emit("startProject", this.newProject);
    },
    closeDialog() {
      this.dialog = false;
      this.newProject.title = "";
      this.newProject.description = "";
      this.newProject.ticketPrice = "";
      this.newProject.deadline = "";
    },
  },
};
</script>
