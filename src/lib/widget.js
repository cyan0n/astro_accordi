var WidgetFactory = (function ($) {
  const DEFAULT_CONFIG = {
    height: 180,
    width: 130,
    canvas_height: 80,
    canvas_width: 120,
    r: 5,
    canvas: {
      style: {
        position: "absolute",
        margin: "40px auto auto auto",
        top: "20px",
        right: "0",
        bottom: "0",
        left: "0",
      },
      text_style: "bold 11px Poppins",
      O_color: "#000",
      X_color: "#f00",
      frets_index_color: "#000",
      fretboard_color: "#000",
    },
    coord: {
      first_string_start: [12, 7],
      last_string_start: [12, 67],
      first_string_end: [102, 7],
      symbols: [0, 11],
      first_dot: [21, 7],
      fret_name: [19, 80],
      barre: [19, 7],
      barre_dim: [4, 12],
      s_name_X: 107,
      fret_gap: 18,
      string_gap: 12,
    },
  };

  var widgets = 0;

  var closeAllWidgets = function () {
    $("div.widget").remove();
  };

  function variate($widget, amount) {
    var note = $widget.note;
    var variations = CanvasArtist.checkNote(note);
    if (variations) {
      var varID = circularIndex($widget.varID, amount, variations.length);
      var $canvas = $("canvas", $widget);
      $widget.varID = varID;
      CanvasArtist.paint($canvas, note, varID, $widget.mode);
    }
  }

  var setupWidget = function (note) {
    var widget_n = widgets;
    var widgetID = "widget_" + String(widget_n);

    var $widget = $("<div/>", {
      id: widgetID,
      class: "widget",
    })
      .css({
        height: WidgetFactory.config["height"],
        width: WidgetFactory.config["width"],
      })
      .draggabilly();

    var $canvas = $("<canvas/>")
      .attr({
        height: WidgetFactory.config["canvas_height"],
        width: WidgetFactory.config["canvas_width"],
      })
      .css(WidgetFactory.config["canvas"]["style"]);

    var $note_name = $("<span/>", {
      text: note,
      class: "note_name",
    });

    var $line = $("<hr/>").css({
      color: "#d5d5d5",
      margin: "5px 4px 16px",
    });

    var $close_btn = $("<button/>", { class: "close_btn" }).html("&times;");

    var $variationNext = $("<button/>", { class: "varnext_btn" }).html(
      "Cambia",
    );

    var $variationPrev = $("<button/>", { class: "varprev_btn" }).html(
      "&#8249;",
    );

    [
      $close_btn,
      $note_name,
      $line,
      $canvas,
      $variationPrev,
      $variationNext,
    ].forEach(function (elem) {
      $widget.append(elem);
    });

    $.extend($widget, {
      mode: "C",
      varID: 0,
      note: note,
      removeWidget: function () {
        widgets--;
        $widget.remove();
      },
      varPrev: function () {
        variate($widget, -1);
      },
      varNext: function () {
        variate($widget, 1);
      },
      switchInstrument: function (inst) {
        var $canvas = $("canvas", $widget);
        $widget.mode = inst;
        $widget.varID = 0;
        CanvasArtist.paint($canvas, note, 0, inst);
      },
    });

    $variationPrev
      .on("click", $widget.varPrev)
      .on("touchstart", $widget.varPrev);
    $variationNext
      .on("click", $widget.varNext)
      .on("touchstart", $widget.varNext);
    $close_btn
      .on("click", $widget.removeWidget)
      .on("touchstart", $widget.removeWidget);
    CanvasArtist.paint($canvas, note, 0, $widget.mode);

    widgets++;
    return $widget;
  };

  var showWidget = function (noteObj, $widget) {
    var offset = noteObj.offset();
    offset.top -= 200;
    offset.left += 0;
    noteObj.after($widget);
    $widget.css({
      position: "absolute",
      top: offset.top,
      left: offset.left,
    });
  };

  var setupTimer = function ($chord, $widget) {
    $.extend($chord, {
      startLeaveTimer: function () {
        $chord.leaveTimer = setTimeout(function () {
          clearTimeout($chord.leaveTimer);
          $widget.removeWidget();
        }, 200);
      },
      stopLeaveTimer: function () {
        clearTimeout($chord.leaveTimer);
      },
      leaveTimer: null,
    });

    $chord.on("mouseleave", function () {
      $chord.startLeaveTimer();
    });
    $widget.on("mouseover", function () {
      $chord.stopLeaveTimer();
    });
    $widget.on("mouseleave", function () {
      $chord.startLeaveTimer();
    });
  };

  var init = function (settings) {
    WidgetFactory.config = DEFAULT_CONFIG;
    // Allow overriding the default config
    $.extend(WidgetFactory.config, settings);
  };

  var newWidget = function (noteObj) {
    //closeAllWidgets();
    var $chord = $(noteObj);
    var note = $chord.text().trim();
    var $new_widget = setupWidget(note);
    setupTimer($chord, $new_widget);
    showWidget($chord, $new_widget);
  };

  return {
    newWidget: newWidget,
    init: init,
  };
})(jQuery);

var CanvasArtist = (function ($) {
  const EMPTY_STRING = 0;
  const BARRE = -1;

  var init = function (settings) {
    //TODO separare settings
  };

  var checkNote = function (note) {
    if (Tabs[note] !== undefined) {
      return Tabs[note];
    } else {
      return 0;
    }
  };

  var paint = function ($canvas, note, varID, mode) {
    if (checkNote(note)) {
      var canvas = $canvas.get(0);
      if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(
          0,
          0,
          WidgetFactory.config["canvas_width"],
          WidgetFactory.config["canvas_height"],
        );
        switch (mode) {
          case "C":
            var tab = Tabs[note][varID];
            drawFretboard(ctx);
            drawChord(ctx, tab);
            break;
          case "P":
            var chord;
            break;
          default:
            var tab = Tabs[note][varID];
            drawFretboard(ctx);
            drawChord(ctx, tab);
            break;
        }
      } else {
        $canvas.text("Canvas not supported");
      }
    } else {
      console.log(
        "L'accordo " +
          note +
          " non è presente nel modulo. Aggiungerlo al dizionario.",
      );
    }
  };

  var drawChord = function (ctx, tab) {
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    var minFret = 0;
    var maxFret = 0;
    var i;

    //Trova il minimo e massimo tasto contenuti nell'accordo
    //[14,14,15,16,16,14] --> 14, 16
    // [0,2,2,2,0,0] --> 2,2
    for (i = 0; i < 6; i++) {
      if (tab[i] <= 0) {
        continue;
      } else {
        // se minFret === 0 non ho ancora trovato un tasto premuto
        // se tab[i] < minFret tab[i] è il minimo
        minFret = minFret === 0 || tab[i] < minFret ? tab[i] : minFret;
        maxFret = tab[i] > maxFret ? tab[i] : maxFret;
      }
    }

    var capo = maxFret > 5 ? minFret : 1;

    drawDots(ctx, capo, tab);
    drawFIndex(ctx, capo);
    if (tab[6] !== 0) {
      drawBarre(ctx, minFret, capo, tab);
    }
  };

  var drawFretboard = function (ctx) {
    var notes = ["e", "B", "G", "D", "A", "E"];
    var fs_start = new Point(
      WidgetFactory.config["coord"]["first_string_start"][0],
      WidgetFactory.config["coord"]["first_string_start"][1],
    );
    var ls_start = new Point(
      WidgetFactory.config["coord"]["last_string_start"][0],
      WidgetFactory.config["coord"]["last_string_start"][1],
    );
    var fs_end = new Point(
      WidgetFactory.config["coord"]["first_string_end"][0],
      WidgetFactory.config["coord"]["first_string_end"][1],
    );
    var string_gap = WidgetFactory.config["coord"]["string_gap"];
    var fret_gap = WidgetFactory.config["coord"]["fret_gap"];
    var string_name = WidgetFactory.config["coord"]["s_name_X"];
    var ch = 0;
    var i;
    ctx.beginPath();
    for (i = fs_start.y; i <= ls_start.y; i = i + string_gap) {
      ctx.moveTo(fs_start.x, i);
      ctx.lineTo(fs_end.x, i);
      ctx.strokeStyle = WidgetFactory.config["canvas"]["fretboard_color"];
      ctx.shadowColor = "white";
      ctx.font = WidgetFactory.config["canvas"]["canvas_text_style"];
      ctx.lineWidth = "2";
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.stroke();
      ctx.fillStyle = WidgetFactory.config["canvas"]["fretboard_color"];
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillText(notes[ch], string_name, i + 3);
      ch++;
    }
    ctx.closePath();

    ctx.beginPath();
    for (i = fs_start.x; i <= fs_end.x; i = i + fret_gap) {
      ctx.moveTo(i, fs_start.y);
      ctx.lineTo(i, ls_start.y);
      ctx.strokeStyle = WidgetFactory.config["canvas"]["fretboard_color"];
      ctx.lineWidth = "2";
      ctx.stroke();
    }
    ctx.closePath();
  };

  var drawDots = function (ctx, capo, tab) {
    var symbols = new Point(
      WidgetFactory.config["coord"]["symbols"][0],
      WidgetFactory.config["coord"]["symbols"][1],
    );
    var first_dot = new Point(
      WidgetFactory.config["coord"]["first_dot"][0],
      WidgetFactory.config["coord"]["first_dot"][1],
    );
    var string_gap = WidgetFactory.config["coord"]["string_gap"];
    var fret_gap = WidgetFactory.config["coord"]["fret_gap"];
    var i;
    ctx.font = WidgetFactory.config["canvas"]["canvas_text_style"];
    for (i = 0; i < 6; i++) {
      switch (tab[i]) {
        case EMPTY_STRING:
          ctx.fillStyle = WidgetFactory.config["canvas"]["O_color"];
          ctx.fillText("O", symbols.x, symbols.y + i * string_gap);
          break;
        case BARRE:
          ctx.fillStyle = WidgetFactory.config["canvas"]["X_color"];
          ctx.fillText("X", symbols.x, symbols.y + i * string_gap);
          break;
        default:
          ctx.beginPath();
          ctx.fillStyle = WidgetFactory.config["canvas"]["fretboard_color"];
          ctx.arc(
            first_dot.x + fret_gap * (tab[i] - capo),
            i * string_gap + first_dot.y,
            WidgetFactory.config["r"],
            0,
            360,
            false,
          );
          ctx.fill();
          break;
      }
    }
  };

  var drawFIndex = function (ctx, capo) {
    var fret_name = new Point(
      WidgetFactory.config["coord"]["fret_name"][0],
      WidgetFactory.config["coord"]["fret_name"][1],
    );
    var fret_gap = WidgetFactory.config["coord"]["fret_gap"];
    var i;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = WidgetFactory.config["canvas"]["frets_index_color"];
    ctx.fillText(String(capo), fret_name.x, fret_name.y);
    for (i = 1; i < 5; i++) {
      ctx.fillText(String(capo + i), fret_name.x + i * fret_gap, fret_name.y);
    }
  };

  var drawBarre = function (ctx, minFret, capo, tab) {
    var barre = new Point(
      WidgetFactory.config["coord"]["barre"][0],
      WidgetFactory.config["coord"]["barre"][1],
    );
    var barre_width = new Point(
      WidgetFactory.config["coord"]["barre_dim"][0],
      WidgetFactory.config["coord"]["barre_dim"][1],
    );
    var fret_gap = WidgetFactory.config["coord"]["fret_gap"];
    ctx.beginPath();
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = "#000";
    ctx.fillRect(
      barre.x + (minFret - capo) * fret_gap,
      barre.y,
      barre_width.x,
      barre_width.y * (tab[6] - 1),
    );
    ctx.closePath();
  };

  return {
    init: init,
    checkNote: checkNote,
    paint: paint,
  };
})(jQuery);
