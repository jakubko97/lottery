<template>
        <v-dialog
        v-model="dialog"
        width="400"
        hide-overlay
        transition="dialog-bottom-transition"
        >
    <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
         Create project
        </v-btn>
      </template>
            <v-btn slot="activator" color="primary" dark>Start a Project</v-btn>
            <v-card>
              <v-card-title>
                <span class="headline font-weight-bold mt-2 ml-4">Bring your project to life</span>
              </v-card-title>
              <v-card-text class="pt-0">
                <v-container class="pt-0" grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-text-field
                        label="Title"
                        persistent-hint
                        v-model="newProject.title">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-textarea
                        label="Description"
                        persistent-hint
                        v-model="newProject.description">
                      </v-textarea>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-text-field
                        label="Ticket Price (ETH)"
                        type="number"
                        step="0.0001"
                        min="0"
                        v-model="newProject.ticketPrice">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-text-field
                        label="Duration (in days)"
                        type="number"
                        v-model="newProject.deadline">
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="dialog = false;
                  newProject.isLoading = false;">
                  Close
                </v-btn>
                <v-btn color="blue darken-1"
                  text
                  @click="startProject()"
                  :loading="newProject.isLoading">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
    </v-dialog>
</template>

<script>

export default { 
    name: 'StartProjectDialog', 
    data: () => ({ 
        dialog: false,
        newProject: { isLoading: false },
    }),
    methods: {
        startProject(){
            this.$emit('startProject', this.newProject, this.dialog)
        }
    }
}
</script>