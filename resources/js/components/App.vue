<!-- App.vue -->
<template>
  <v-app>
    <!-- <MenuMain /> -->
 <MenuMain />
    <!-- Sizes your content based upon application components -->
    <v-main>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>

     
        <!-- If using vue-router -->
        <!-- <div class="d-flex justify-space-around align-center flex-column flex-sm-row fill-height">
          <v-btn flat>
            Normal
          </v-btn>

          <v-btn flat color="secondary">
            Secondary
          </v-btn>

          <v-btn flat color="error">
            Error
          </v-btn>

          <v-btn flat disabled>
            Disabled
          </v-btn>
        </div>

        <div class="text-center">
          <v-chip class="ma-2">
            Default
          </v-chip>

          <v-chip class="ma-2" color="primary">
            Primary
          </v-chip>

          <v-chip class="ma-2" color="secondary">
            Secondary
          </v-chip>

          <v-chip class="ma-2" color="error" text-color="white">
            Red Chip
          </v-chip>

          <v-chip class="ma-2 green" color="green" text-color="white">
            Green Chip
          </v-chip>
        </div> -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script lang="ts" script>
import { defineComponent } from "vue";
//import Test from '@/views/components/Test.vue'
import MenuMain from './menus/MenuMain.vue'

export default defineComponent({
  name: "App",
  components: {
    MenuMain,
    // Footer,
    // LoadingSpinner,
    // Snackbar,
    // MediaLightBox
  },
});
</script>