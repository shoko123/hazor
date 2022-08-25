<template>
  <v-card class="mx-auto" color="transparent" flat>
    <v-card-text v-if="hasMedia" class="text-body-1 white--text">
      {{ text }}</v-card-text
    >
    <v-card-actions>
      <v-btn :disabled="!isImplemented" @click="goTo(item)">Visit</v-btn>
      <v-btn v-if="hasMedia" @click="openLightBox()">Lightbox</v-btn>
    </v-card-actions>
  </v-card>
</template>
    

<script>
export default {
  props: {
    item: Object,
    page: Number,
    index: Number,
  },
  created() {
    /*
    console.log(
      `RelatedOL page: ${this.page} index: ${this.index} item: ${JSON.stringify(
        this.item,
        null,
        2
      )}`
    );
    */
  },

  computed: {
    hasMedia() {
      return this.item.hasMedia;
    },
    module() {
      return this.$store.getters["mgr/module"];
    },
    isImplemented() {
      return this.module === "Locus"
        ? this.$store.getters["mgr/isImplemented"](this.item.findable_type)
        : true;
    },
    text() {
      let text = this.item.description;
      if (text === null) {
        return "";
      } else {
        return text.length < 101 ? text : text.substr(0, 100) + "...";
      }
    },
  },
  methods: {
    openLightBox() {
      let c = this.$store.getters["mgr/collections"]("related");
      this.$store.commit("med/openLightBox", {
        value: true,
        source: "related",
        index: this.index % c.itemsPerPage,
      });
    },

    goTo(locus) {
      let module;
      switch (this.$store.getters["mgr/module"]) {
        case "Area":
        case "Season":
          module = "AreaSeason";
          break;
        case "AreaSeason":
          module = "Locus";
          break;
        case "Locus":
          module = this.item.findable_type;
          break;
      }
      this.$store.dispatch("mgr/goToRoute", {
        module: module,
        action: "show",
        dot: this.item.dot,
      });
    },
  },
};
</script>

