<template>
  <v-btn class="primary--text" large outlined v-for="(btn, index) in buttons" :key="index"
    @click="btnClicked(btn.method)">{{ btn.text }}</v-btn>
</template>

<script lang="ts" setup>
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'
import { useMainStore } from '../../scripts/stores/main'
import { useModelStore } from '../../scripts/stores/model'


defineComponent({
  name: "SubWelcome",
  components: {

  }
})

const model = useModelStore()

const buttons = computed(() => {
  let btns = [];
  if (model.name === 'Stone') {
    btns.push({ text: "Query Collection", method: "filter" });
  }
  btns.push({ text: "Show All", method: "showAll" });
  btns.push({ text: "Show Item", method: "showItem" });

  return btns;
});

function btnClicked(f: string) {
  switch (f) {
    case "showAll":
      showAll()
      break
    case 'filter':
      filter()
      break

    case 'showItem':
      showItem()
      break
  }
}
function filter() {

}
function showAll() {

}
function showItem() {

}



</script>


 
    goToQuery() {
      this.$store.dispatch("aux/clearFilters");
      this.$store.dispatch("mgr/goToRoute", "filter");
    },

    showAll() {
      this.$store.dispatch("aux/clearFilters");
      this.$store.dispatch("mgr/goToRoute", {
        module: this.$store.getters["mgr/module"],
        action: "list",
        params: {},
      });
      return;
    },

    goToItem() {
      this.$store.dispatch("aux/clearFilters");
      this.$store.dispatch("mgr/goToRoute", {
        module: this.$store.getters["mgr/module"],
        action: "show",
        dot: this.$store.getters["mgr/welcomeData"].firstDot
      });
    },

    goToAreas() {
      console.log("goToAreas");
      this.$store.dispatch("mgr/goToRoute", {
        module: "Area",
        action: "welcome",
      });
    },
    goToSeasons() {
      console.log("goToSeasons");
      this.$store.dispatch("mgr/goToRoute", {
        module: "Season",
        action: "welcome",
      });
    },
  },
};