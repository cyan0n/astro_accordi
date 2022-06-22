<template>
  <div class="widget">
    <button class="widget-close" @click="$emit('close')">×</button>
    <span class="widget-note-name">{{ note }}</span>
    <hr />
    <widget-canvas :note="note" :varID="varID" />
    <button @click="varID++" class="widget-next">Cambia</button>
  </div>
</template>

<script>
import WidgetCanvas from "./WidgetCanvas.vue";

export default {
  components: { WidgetCanvas },
  props: {
    note: String,
  },
  data() {
    return {
      varID: 0,
    };
  },
  methods: {
    next() {},
  },
};
</script>

<style lang="scss" scoped>
.widget {
  height: 240px;
  width: 160px;
  padding: 12px 16px;
  position: absolute;
  background-color: white;
  bottom: 32px;
  right: -45px;
  display: flex;
  z-index: 999999;
  flex-direction: column;
  border: 2px solid #c5c5c5;

  hr {
    border: 1px solid #e5e5e5;
    margin: 5px 4px 16px;
  }
  .widget-note-name {
    display: inline-block;
    z-index: 1;
    line-height: 36px;
    overflow: hidden;
    max-width: 94px;
  }
  .widget-close {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 99px;
    background-color: #e00057;
    color: white;
    position: absolute;
    right: 16px;
    float: right;
    z-index: 999999;
    padding: 0 1px 2px 0;
  }
  .widget-close:active {
    top: 13px;
    right: 15px;
    box-shadow: 1px 1px 3px #666;
  }
  .widget-next {
    margin-top: 30px;
    border-radius: 99px;
    padding: 0;
    height: 36px;
    background-color: #238eaf;
    color: white;
  }

  .widget-next:active {
    position: relative;
    top: 1px;
    left: 1px;
    box-shadow: 1px 1px 3px #666;
  }
}
</style>
