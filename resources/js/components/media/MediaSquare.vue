<template>
  <div v-if="item">
    <v-hover>
      <template v-slot:default="{ hover }">
        <v-card class="mx-auto" max-width="size" max-height="size">
          <v-img
            :src="size > 250 ? item.fullUrl : item.tnUrl"
            :lazy-src="item.tnUrl"
            contain
            aspect-ratio="1"
            class="grey lighten-2"
          >
            <v-btn
              v-if="tagText"
              class="text-subtitle-1 font-weight-medium black--text"
              color="grey"
              >{{ tagText }}</v-btn
            >
            <v-card class="mx-auto"  color="transparent" flat>
              <v-card-text class="text-body-1 white--text">
                {{ overlayText }}</v-card-text
              >
            </v-card>
          </v-img>
          <v-fade-transition>
            <v-overlay v-if="hover" absolute color="#036358">
              <component
                v-bind:is="overlay"
                v-bind:item="item"
                v-bind:source="source"
                v-bind:page="page"
                v-bind:index="index"
              ></component>
            </v-overlay>
          </v-fade-transition>
        </v-card>
      </template>
    </v-hover>
  </div>
</template>

<script>
import OverlayRelated from "./OverlayRelated";
import OverlayItemMedia from "./OverlayItemMedia";
import OverlayMediaEdit from "./OverlayMediaEdit";
import OverlayCollectionItem from "./OverlayCollectionItem";

export default {
  components: {
    OverlayRelated,
    OverlayItemMedia,
    OverlayMediaEdit,
    OverlayCollectionItem,
  },
  props: {
    source: String,
    caller: String,
    page: Number,
    index: Number,
    item: Object,
    size: Number,
  },

  created() {
    //console.log(
    //  `MediaSquare.created() source: ${this.source} index: ${this.index}`
    //);
  },
  computed: {
    tagText() {
      switch (this.source) {
        case "main":
        case "related":
          return this.item.tag;

        case "media":
          if (this.caller === "mediaPrimary") {
            let c = this.$store.getters["mgr/collections"]("media");
            return `media (${c.collection.length})`;
          } else {
            return "";
          }
      }
    },
    overlayText() {
      switch (this.source) {
        case "main":
        case "related":
          if (!this.item.hasMedia) {
            let text = this.item.description;
            if (text === null || text === undefined) {
              return "";
            } else {
              return text.length < 101 ? text : text.substr(0, 100) + "...";
            }
          }

        case "media":
          return "";
      }
    },

    overlay() {
      switch (this.source) {
        case "main":
          return OverlayCollectionItem;
        case "related":
          return OverlayRelated;
        case "media":
          return this.$store.getters["mgr/status"].isMediaEdit
            ? OverlayMediaEdit
            : OverlayItemMedia;
      }
    },
  },
};
</script>

