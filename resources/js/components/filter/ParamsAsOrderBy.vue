<template>
  <v-container>
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="6"
      >
        <v-card
          class="mx-auto"
          variant="outlined"
        >
          <v-card-title class="bg-grey text-black py-0 mb-4">
            OPTIONS
          </v-card-title>
          <v-card-item>
            <v-table>
              <thead>
                <tr>
                  <th class="text-left">
                    Name
                  </th>
                  <th class="text-left">
                    Add Ascend
                  </th>
                  <th class="text-left">
                    Add Descend
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in orderAvailableNames"
                  :key="item"
                >
                  <td>{{ item }}</td>
                  <td>
                    <v-btn
                      prepend-icon="mdi-arrow-up"
                      :disabled="full"
                      @click="orderParamClicked(index, true)"
                    >
                      Add
                    </v-btn>
                  </td>
                  <td>
                    <v-btn
                      prepend-icon="mdi-arrow-down"
                      :disabled="full"
                      @click="orderParamClicked(index, false)"
                    >
                      Add
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="1"
      >
        <v-row justify="center">
          <v-btn
            class="ma-2"
            @click="orderClear"
          >
            Clear
          </v-btn>
        </v-row>
      </v-col>
      <v-col
        cols="12"
        sm="3"
      >
        <v-card
          class="mx-auto"
          variant="outlined"
        >
          <v-card-title class="header py-0 mb-4">
            SELECTED (Max: 4)
          </v-card-title>
          <v-card-item>
            <v-table>
              <!-- <thead>
                <tr>
                  <th class="text-left">
                    Name
                  </th>
                </tr>
              </thead> -->
              <tbody>
                <tr
                  v-for="(item, index) in selected"
                  :key="index"
                >
                  <td>
                    <v-btn :prepend-icon="item.asc ? 'mdi-arrow-up' : 'mdi-arrow-down'">
                      {{ item.name }}
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFilterStore } from '../../scripts/stores/trio/filter'

let { orderAvailableNames, orderSelectedNames } = storeToRefs(useFilterStore())
let { orderParamClicked, orderClear } = useFilterStore()

const selected = computed(() => {
  return orderSelectedNames.value.map(x => { return { name: x.slice(0, -2), asc: x.slice(-1) === 'A' } })
})

const full = computed(() => {
  console.log(`full: ${orderSelectedNames.value.length === 4}`)
  return orderSelectedNames.value.length === 4
})

</script>


