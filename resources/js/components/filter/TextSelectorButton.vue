<template>
  <div>
    <v-btn large rounded slot="activator" @click="openModal" class="purple white--text no-uppercase">{{ searchText
    }}</v-btn>
    <v-dialog v-model="dialog" persistent max-width="600">
      <v-card class="elevation-12">
        <v-card-title class="primary white--text">Select a search term</v-card-title>
        <v-card-text>
          <PickerForm />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="select">Done</v-btn>
          <v-btn @click="reset" primary>Reset</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup >
import { computed, ref } from 'vue'
import { useTrioStore } from '../../scripts/stores/trio';

let dialog = ref<boolean>(false)
let trio = useTrioStore()

const searchText = computed(() => {
  return 'search text'
})

const cats = computed(() => {
  return trio.visibleCategories('Filter')
})

const groups = computed(() => {
  return trio.visibleGroups('Filter')
})

const params = computed(() => {
  return trio.visibleParams('Filter')
})



function openModal() {
  dialog.value = false
}

function select() {
  console.log(`select)`)
}
function reset() {
  console.log(`reset)`)
}

</script>
import PickerForm from "./PickerForm";

export default {
  components: { PickerForm },
  data() {
    return {
      dialog: false,
    };
  },

  computed: {
    status() {
      return this.$store.getters["regs/status"];
    },
    moduleName() {
      return this.$store.getters["mgr/module"];
    },
    isLocus() {
      return this.$store.getters["mgr/status"].isLocus;
    },
    isFind() {
      return this.$store.getters["mgr/status"].isFind;
    },
    isReady() {
      return this.$store.getters["regs/flags"]
        ? this.$store.getters["regs/flags"].isReady
        : false;
    },
   

    tag() {
      //return `${this.$store.getters["mgr/module"]} ${this.$store.getters["mgr/item"].tag}`;
      return this.$store.getters["mgr/item"]
        ? `${this.$store.getters["mgr/module"]} ${this.$store.getters["mgr/item"].tag}`
        : "loading...";
    },
    disable() {
      let ready = this.$store.getters["mgr/ready"];
      return !ready.item || !ready.collection;
    },

    disableGoTo() {
      return !this.isReady; // ? !this.status.ready : true;
    },
  },

  methods: {
    openModal() {
      if (["Area", "Season"].includes(this.$store.getters["mgr/module"])) {
        return;
      }
      this.dialog = true;
      this.$store.commit("mgr/isPicker", true);
      this.$store.dispatch("regs/p/preparePicker");
    },

    goTo() {
      if (!this.isReady) {
        alert("Not ready");
        return;
      }

      this.$store
        .dispatch("mgr/goToRoute", {
          module: this.$store.getters["mgr/module"],
          action: "show",
          dot: this.$store.getters["regs/selected"].dot
        })
        .then((res) => {
          this.$store.commit("regs/clear");
          this.$store.commit("mgr/isPicker", false);
          this.dialog = false;
          return res;
        });
    },

    cancel() {
      this.$store.commit("mgr/isPicker", false);
      this.dialog = false;
    },
  },
};
</script>
<style scoped>
.no-uppercase {
  text-transform: none;
}
</style>
