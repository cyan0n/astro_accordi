<template>
  <div id="container" ref="container">
    <header>
      <template v-if="song.category">
        <img src="/img/logo.png" id="logo" alt="" @click="$router.push('/')" />
        <div>
          <span class="back-to-menu" @click="$router.push('/')"
            >Torna al menu</span
          >
        </div>
      </template>
      <template v-else>
        <img src="/img/logo.png" id="logo" alt="" style="cursor: default" />
        <div>
          <span></span>
        </div>
      </template>
      <div id="title">
        <h1 class="song-title">{{ song.title }}</h1>
        <div id="song-artist-container">
          <img src="/img/mic.png" id="mic" alt="" />
          <h2 class="song-artist">{{ song.artist }}</h2>
        </div>
      </div>
    </header>
    <div id="tools">
      <section>
        Cambia tonalità
        <button class="circle adjust minus" @click="pitch--">-</button>
        <button class="circle adjust plus" @click="pitch++">+</button>
        <span class="pitch"
          ><template v-if="pitch > 0">+</template>{{ pitch }}</span
        >
      </section>
      <span class="section-divider">●</span>
      <section>
        Semplifica accordi
        <input
          type="checkbox"
          class="apple-switch"
          @click="simplified = !simplified"
        />
      </section>
      <span class="section-divider">●</span>
      <section class="last">
        Avvia scorrimento
        <button
          id="scroll"
          class="circle scroll"
          @click="autoscroll = !autoscroll"
        >
          <span id="scroll-text" class="icon-play"></span>
        </button>
      </section>
    </div>
    <div id="tools-2">
      <a @click="savePDF"
        ><span class="icon-pdf"></span> Stampa / Salva in PDF</a
      >
    </div>
    <div id="song" ref="song">
      <template v-for="(line, line_idx) in song.lines" :key="'line' + line_idx">
        <pre v-if="line.type == 'lyric'" :key="line_idx">{{ line.lyric }}</pre>
        <div v-else-if="line.type == 'tablature'">
          <tab
            v-for="(tab, j) in line.tabs"
            :key="j"
            :tab="tab"
            :pitch="pitch"
            :tab_key="line.key"
            :simplified="simplified"
          ></tab>
        </div>
        <div v-else><br /></div>
      </template>
    </div>
    <div id="footer">
      <a href="#"><span class="icon-up"></span> Torna in cima</a>
    </div>
  </div>
</template>

<script>
import Tab from "../Tab.vue";

export default {
  name: "song",
  components: { Tab },
  props: ["song"],
  data() {
    return {
      pitch: 0,
      simplified: false,
      autoscroll: false,
      scrollTimeout: 0,
      duration: 120,
      height: 0,
      speed: 0,
    };
  },
  watch: {
    autoscroll: function () {
      let scroll = document.getElementById("scroll-text");
      if (scroll.classList.contains("icon-play")) {
        scroll.classList.remove("icon-play");
        scroll.classList.add("icon-pause");
      } else {
        scroll.classList.remove("icon-pause");
        scroll.classList.add("icon-play");
      }
      if (this.autoscroll) {
        this.calculateSpeed();
        this.scroll();
      } else {
        clearTimeout(this.scrollTimeout);
      }
    },
  },
  methods: {
    scroll() {
      window.scrollBy(0, this.speed);
      if (window.innerHeight + window.scrollY >= this.height) {
        this.autoscroll = false;
      } else {
        this.scrollTimeout = setTimeout(this.scroll, 100);
      }
    },
    calculateSpeed() {
      var body = document.body,
        html = document.documentElement;

      this.height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight,
      );

      // Buffer?
      let buffer = window.innerHeight / 2;

      this.speed = Math.ceil((this.height + buffer) / this.duration / 100);
    },
    savePDF() {
      window.print();
    },
  },
};
</script>

<style lang="scss">
#container {
  background: #f5f5f5;
}
#song {
  text-align: left;
}
</style>
