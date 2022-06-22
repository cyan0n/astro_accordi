<template>
  <canvas ref="canvas" height="80" width="120"></canvas>
</template>

<script>
import { getNote } from "../utils/notes";

const config = {
  notes: ["e", "B", "G", "D", "A", "E"],
  fs_start: { x: 12, y: 7 },
  fs_end: { x: 102, y: 7 },
  ls_start: { x: 12, y: 67 },
  symbols: { x: 0, y: 11 },
  dot: { x: 21, y: 7 },
  name: { x: 19, y: 80 },
  barre: { x: 19, y: 7 },
  barre_width: { x: 4, y: 12 },
  s_name_X: 107,
  fret_gap: 18,
  string_gap: 12,
  text_style: "bold 11px Poppins",
};

export default {
  props: {
    note: String,
    varID: Number,
  },
  data() {
    return {
      context: null,
      height: 80,
      width: 120,
      tab: null,
      capo: 1,
      min: 1,
    };
  },
  mounted() {
    this.context = this.$refs["canvas"].getContext("2d");
    this.paint();
  },
  watch: {
    varID() {
      this.varID = this.varID % getNote(this.note).length;
      this.paint();
    },
  },
  methods: {
    paint() {
      if (getNote(this.note)) {
        this.context.clearRect(0, 0, this.width, this.height);
        this.tab = getNote(this.note)[this.varID];
        this.drawFretboard();
        this.drawChord();
      } else {
        console.log(`${note} non found`);
      }
    },
    drawFretboard() {
      this.context.beginPath();
      this.context.strokeStyle = "#000";
      this.context.shadowColor = "white";
      this.context.font = config.text_style;
      this.context.lineWidth = "2";
      this.context.fillStyle = "#000";

      // Chord strings
      config.notes.forEach((chord, i) => {
        const y = config.fs_start.y + i * config.string_gap;
        this.context.moveTo(config.fs_start.x, y);
        this.context.lineTo(config.fs_end.x, y);
        this.context.stroke();

        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.fillText(chord, config.s_name_X, y + 3);
      });

      // Fret lines
      for (let i = 0; i < 6; i++) {
        const y = config.fs_start.x + i * config.fret_gap;
        this.context.moveTo(y, config.fs_start.y);
        this.context.lineTo(y, config.ls_start.y);
        this.context.stroke();
      }
      this.context.closePath();
    },
    drawChord() {
      this.context.shadowOffsetX = 0;
      this.context.shadowOffsetY = 0;
      let minFret = 99;
      let maxFret = 0;

      for (let i = 0; i < 6; i++) {
        if (this.tab[i] > 0) {
          if (this.tab[i] < minFret) {
            minFret = this.tab[i];
          }
          if (this.tab[i] > maxFret) {
            maxFret = this.tab[i];
          }
        }
      }

      this.capo = maxFret > 5 ? minFret : 1;
      this.min = minFret;
      this.drawDots();
      this.drawFIndex();
      if (this.tab.length > 6 && this.tab[6] !== 0) {
        this.drawBarre();
      }
    },
    drawDots() {
      this.context.font = config.text_style;
      for (let i = 0; i < 6; i++) {
        switch (this.tab[i]) {
          case -1:
            this.context.fillStyle = "#f00";
            this.context.fillText(
              "X",
              config.symbols.x,
              config.symbols.y + i * config.string_gap,
            );
            break;
          case 0:
            this.context.fillStyle = "#000";
            this.context.fillText(
              "O",
              config.symbols.x,
              config.symbols.y + i * config.string_gap,
            );
            break;
          default:
            this.context.beginPath();
            this.context.fillStyle = "#000";
            this.context.arc(
              config.dot.x + (this.tab[i] - this.capo) * config.fret_gap,
              config.dot.y + i * config.string_gap,
              5,
              0,
              360,
              false,
            );
            this.context.fill();
            this.context.closePath();
        }
      }
    },
    drawFIndex() {
      this.context.shadowOffsetX = 2;
      this.context.shadowOffsetY = 2;
      this.context.fillStyle = "#000";
      for (let i = 0; i < 5; i++) {
        this.context.fillText(
          String(this.capo + i),
          config.name.x + i * config.fret_gap,
          config.name.y,
        );
      }
    },
    drawBarre() {
      this.context.beginPath();
      this.context.shadowOffsetX = 0;
      this.context.shadowOffsetY = 0;
      this.context.fillStyle = "#000";
      this.context.fillRect(
        config.barre.x + (this.min - this.capo) * config.fret_gap,
        config.barre.y,
        config.barre_width.x,
        config.barre_width.y * (this.tab[6] - 1),
      );
      this.context.closePath();
    },
  },
};
</script>
