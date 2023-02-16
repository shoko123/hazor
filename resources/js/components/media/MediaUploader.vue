<template>
  <v-card>
    <v-card-title class="orange py-0 mb-4">Upload media</v-card-title>

    <v-card-text>
      <div class="images-preview" v-if="filesAsUrlStrings.length">
        <v-container fluid>
          <v-row>
            <v-col
              v-for="image in filesAsUrlStrings"
              :key="image.file"
              class="d-flex child-flex"
              cols="4"
            >
              <v-card flat tile class="d-flex">
                <v-img :src="image" aspect-ratio="1" class="grey lighten-2">
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-container fluid>
        <v-row no-gutters>
          <v-col :cols="4">
            <v-file-input
              multiple
              chips
              v-model="files"
              label="Select Files..."
              accept="image/*"
              @change="onInputChange"
            ></v-file-input>
          </v-col>
          <v-col :cols="1">
            <v-btn @click="close" class="primary--text mr-2">cancel</v-btn>
          </v-col>
          <template v-if="filesAsUrlStrings.length">
            <v-col :cols="3" class="text-right">
              <v-btn @click="clear" class="primary--text mr-2">clear</v-btn>
              <v-btn
                @click="uploadMultiple"
                :disabled="disableButton"
                class="orange mr-2"
              >Upload Media as</v-btn>
            </v-col>
            <v-col :cols="2" class="text-left">
              <v-select label="media type" :items="mediaTypes" v-model="media_type"></v-select>
            </v-col>
            <v-col :cols="4"></v-col>
          </template>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  created() {
    this.clear();
  },
  data() {
    return {
      //file: null,
      mediaTypes: [
        { text: "Photo(s)", value: "photo" },
        { text: "Drawing(s)", value: "drawing" },
        { text: "Plan(s)", value: "plan" },
      ],
      media_type: "photo",
      files: [],
      filesAsUrlStrings: [],
    };
  },

  computed: {
    dialogAddMedia: {
      get() {
        return this.$store.getters["med/dialogAddMedia"];
      },
      set(data) {
        this.$store.commit("med/dialogAddMedia", data);
      },
    },

    disableButton() {
      return (
        this.files.length === 0 ||
        this.files.length > 6 ||
        this.files.length != this.filesAsUrlStrings.length
      );
    },
  },
  methods: {
    clear() {
      this.files = this.filesAsUrlStrings = [];
      this.media_type = "photo";
    },

    onInputChange(e) {
      console.log("OnInputChange");
      if (this.files.length > 6) {
        alert("Max number of files is 6 - Upload aborted!");
        //TODO truncate to 6
        this.clear();
        return;
      }
      this.files.forEach((file) => {
        if (file.size > 1024 * 1024 * 2) {
          alert(
            `Size of file ${file.name} exceeds max allowed of 2MB - Upload aborted!`
          );
          this.clear();
          return;
        }
      });
      this.files.forEach((file) => this.addImage(file));
    },

    addImage(file) {
      const img = new Image(),
        reader = new FileReader();
      reader.onload = (e) => this.filesAsUrlStrings.push(e.target.result);
      reader.readAsDataURL(file);
    },

    close() {
      this.clear();
      this.dialogAddMedia = false;
    },

    uploadMultiple() {
      const formData = new FormData();

      let totalSize = 0;
      this.files.forEach((file) => {
        formData.append("media_files[]", file, file.name);
      });

      formData.append("item_type", this.$store.getters["mgr/module"]);
      formData.append("id", this.$store.getters["mgr/item"].id);
      formData.append("media_type", this.media_type);

      this.$store.dispatch("med/store", formData).finally(() => {
        this.close();
      });
    },
  },
};
</script>

