<template>
  <v-card class="mx-auto" color="transparent" flat>
    <v-card-text v-if="hasMedia" class="text-body-1 white--text"> {{ text }}</v-card-text> 
    <v-card-actions>
    <v-btn @click="goTo(item)">Visit</v-btn>
    <v-btn v-if="hasMedia" @click="openLightBox()">Lightbox</v-btn>
  </v-card-actions>
  </v-card>
  <!--h5 v-if="hasMedia">{{ text }}</h5-->
 
</template>
    

<script>
export default {
  props: {
    item: Object,
    page: Number,
    index: Number,
  },

  created() {
    //console.log(`collectionOL page: ${this.page} index: ${this.index} item: ${JSON.stringify(this.item, null, 2)}`);
  },

  computed: {
    hasMedia() {
      return this.item.hasMedia;
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
      let c = this.$store.getters["mgr/collections"]("main");
      this.$store.commit("med/openLightBox", {
        value: true,
        source: "main",
        index: this.index % c.itemsPerPage,
      });
    },

    goTo(item) {
      this.$store.dispatch("mgr/goToRoute", {
        module: this.$store.getters["mgr/module"],
        action: "show",
        dot: item.dot
      });
    },
  },
};
</script>

