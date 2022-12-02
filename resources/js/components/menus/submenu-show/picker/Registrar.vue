<template>
  <v-container fluid>
    <v-row>
      <StepButtons v-on:nextClicked="nextClicked"></StepButtons>
    </v-row>
    <v-row>
      <v-col :cols="3" class="px-1">
        <FieldPicker
          v-bind="{
            label: 'Season/Area',
            title: 'Pick Season/Area',
            collectionName: 'areasSeasons',
            fieldName: 'areaSeason',
          }"
        ></FieldPicker>
      </v-col>

      <v-col :cols="3" class="px-1">
        <FieldPicker
          v-bind="{
            label: 'Locus',
            title: 'Pick Locus Number',
            collectionName: 'loci',
            fieldName: 'locus',
          }"
        ></FieldPicker>
      </v-col>
    </v-row>

    <v-row v-if="showFindDetails">
      <v-col :cols="2" class="px-1">
        <FieldPicker
          v-bind="{
            label: 'Registration Code',
            title: 'Pick Registration',
            collectionName: 'registrationCategories',
            fieldName: 'registration_category',
          }"
        ></FieldPicker
      ></v-col>
      <v-col :cols="2" class="px-1">
        <FieldPicker
          v-bind="{
            label: 'Basket',
            title: 'Pick Basket Number',
            collectionName: 'basketNos',
            fieldName: 'basket',
          }"
        ></FieldPicker
      ></v-col>
      <v-col :cols="2" class="px-1">
        <FieldPicker
          v-bind="{
            label: 'Artifact',
            title: 'Pick Artifact Number',
            collectionName: 'artifactNos',
            fieldName: 'artifact',
          }"
        ></FieldPicker
      ></v-col>
    </v-row>
  </v-container>
</template>

<script>
import FieldPicker from "./FieldPicker";
import StepButtons from "../stepper/StepButtons";

export default {
  components: { FieldPicker, StepButtons },
  created() {
    console.log("Registrar.created");
    //this.$store.dispatch("regs/n/loadAreasSeasons", null);
  },

  destroyed() {
    console.log("Registrar.destroyed");
  },

  data() {
    return {};
  },

  computed: {
    flags() {
      return this.$store.getters["regs/flags"];
    },
    item() {
      return this.flags.isReady ? this.$store.getters["regs/selected"].item : null;
    },
    showFindDetails() {
      return this.$store.getters["regs/flags"].showFindRegistration;
    },
  },

  methods: {
    nextClicked() {
      console.log(
        "Registrar.nextClicked: " +
          JSON.stringify(this.item, null, 2)
      );

      if (!this.flags.isReady) {
        console.log("Registrar - validation error");
        this.$store.commit("stp/disableNextButton", true);
      } else {
        console.log("Registrar - validation passed - before next");
        this.$store.dispatch("regs/n/copyRegistration");
        this.$store.commit("stp/moveToStep", "next");
      }
    },
  },
};
</script>
