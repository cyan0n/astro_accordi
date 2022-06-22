<template>
  <pre
    class="chord"
    :class="{
      simplified: simplified,
    }">{{ tab.padding }}<span @mouseenter="show" @mouseleave="start_timer">{{ note }}<widget v-if=show_widget @close="show_widget=false" :note=widget_note /><template v-if=tab.minor>m</template><span :class="{ hide: simplified }">{{ tab.mod }}{{ tab.separator }}<template v-if="tab.slide">{{ slide_note }}{{ tab.slide.mod }}</template></span></span>{{ r_padding }}</pre>
</template>

<script>
import { transpose } from "../utils/notes";
import Widget from "./Widget.vue";

export default {
  components: { Widget },
  props: {
    tab: {
      required: true,
      type: Object,
    },
    pitch: {
      type: Number,
      default: 0,
    },
    tab_key: {
      type: Number,
      default: 0,
    },
    simplified: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show_widget: false,
      timer: 0,
    };
  },
  computed: {
    note() {
      return transpose(this.tab, this.tab_key, this.pitch);
    },
    widget_note() {
      let result = this.note;
      if (this.tab.minor) {
        result += this.tab.minor;
      }
      if (!this.simplified) {
        result += this.tab.mod;
        if (this.tab.separator) {
          result += this.tab.separator;
        }
        if (this.tab.slide) {
          result += this.slide_note + this.tab.slide.mod;
        }
      }
      return result;
    },
    slide_note() {
      if (this.tab.slide) {
        return transpose(this.tab.slide, this.tab_key, this.pitch);
      }
      return "";
    },
    r_padding() {
      let num = 4 - this.note.length;
      if (this.slide_note != "") {
        num += 4 - this.slide_note.length;
      }
      return new Array(num + 1).join(" ");
    },
  },
  methods: {
    show() {
      clearTimeout(this.timer);
      this.show_widget = true;
    },
    start_timer() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.show_widget = false;
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
pre {
  font-family: "Fira Code", monospace;
  display: inline;
  color: #238eaf;
  font-weight: 700;
  &.simplified {
    color: #753170;
  }
  .hide {
    visibility: hidden;
  }
  position: relative;
}
.chord[data-v-bc09d9d6] {
  cursor: pointer;
}
</style>
