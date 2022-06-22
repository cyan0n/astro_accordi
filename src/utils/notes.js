import tabs from "../data/tabs.json";
import notes from "../data/notes.json";

export const getNote = (note) => {
  if (tabs[note] === undefined) {
    return false;
  }
  return tabs[note];
};

export const transpose = (tab, key, modifier) => {
  if (modifier == 0) {
    return tab.tone + (tab.semi || "");
  }

  // Normalize modifier
  if (modifier && modifier < 0) {
    modifier = 12 + (modifier % 12);
  }

  let newkey = (key + modifier) % 12;
  let scale = notes[newkey].scale;

  let newnote = (tab.value + modifier) % 12;
  let res;
  // Is new note semi
  if (notes[newnote].type == "semi" && scale != "N") {
    if (scale == "b") {
      res = notes[newnote + 1].legal;
    } else if (scale == "#") {
      res = notes[newnote - 1].legal;
    }
    res += scale;
  } else {
    res = notes[newnote].legal;
  }
  return res;
};
