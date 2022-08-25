<template>
  <div>
    <v-btn v-if="showLightBoxOption" @click="openLightBox()">Lightbox</v-btn>
  </div>
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
      `MediaOL page: ${this.page} index: ${this.index} item: ${JSON.stringify(
        this.item,
        null,
        2
      )}`
    );
    */
  },
  computed: {
    showLightBoxOption() {
      return this.item.hasMedia;
    },
  },
  methods: {
    openLightBox() {
      let c = this.$store.getters["mgr/collections"]("media");
      this.$store.commit("med/openLightBox", {
        value: true,
        source: "media",
        index: this.index % c.itemsPerPage,
      });
    },
  },
};
</script>

