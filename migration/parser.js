const NamedRegExp = require("named-js-regexp");

const notes = [
  "DO",
  "REb",
  "RE",
  "MIb",
  "MI",
  "FA",
  "FA#",
  "SOL",
  "LAb",
  "LA",
  "SIb",
  "SI",
];
const tones = ["DO", "RE", "MI", "FA", "SOL", "LA", "SI"];
const keyRx = new RegExp(
  `(?<=^\\s*{{\\s*KEY\\s*=\\s*)(?:${notes.join("|")})(?=\\s*}}\\s*$)`,
  "g",
);
const categoryRx = new RegExp(
  `(?<=^\\s*{{\\s*CATEGORY\\s*=\\s*)(?:\\d+(\\.\\d)?)(?=\\s*}}\\s*$)`,
  "g",
);
const titleRx = new RegExp(
  `(?<=^\\s*{{\\s*TITLE\\s*=\\s*)(?:.+)(?=\\s*}}\\s*$)`,
  "g",
);
const artistRx = new RegExp(
  `(?<=^\\s*{{\\s*ARTIST\\s*=\\s*)(?:.+)(?=\\s*}}\\s*$)`,
  "g",
);
const tabLineRx = new RegExp(
  `^(\\s*(?:${tones.join(
    "|",
  )})[b\\#]?m?(?:aug|dim|add|\\d|\\+|-|\\d\\/\\d)*[\\/]?)+\\s*$`,
  "g",
);
const tabRx = new NamedRegExp(
  `(?<padding>\\s*)(?<tone>${tones.join(
    "|",
  )})(?<semi>b|\\#)?(?<minor>m)?(?<mod>(aug|dim|add|\\d|\\+|-|\\/\\d)*)(?<separator>\\/)?`,
  "g",
);

const parseNote = (tab) => {
  const res = notes.indexOf(tab.tone);
  if (tab.semi == "#") {
    return res + 1;
  }
  if (tab.semi == "b") {
    return res - 1;
  }
  return res;
};
module.exports = {
  isCategory: (line) => line.match(categoryRx) !== null,
  category: (line) => {
    if (line.match(categoryRx) === null) {
      return false;
    }
    return categoryRx.exec(line)[0];
  },
  isTitle: (line) => line.match(titleRx) !== null,
  title: (line) => {
    if (line.match(titleRx) === null) return false;
    return titleRx.exec(line)[0].trim();
  },
  isArtist: (line) => line.match(artistRx) !== null,
  artist: (line) => {
    if (line.match(artistRx) === null) return false;
    return artistRx.exec(line)[0].trim();
  },
  isKey: (line) => line.match(keyRx) !== null,
  key: (line) => {
    if (line.match(keyRx) === null) {
      return false;
    }
    return notes.indexOf(keyRx.exec(line)[0]);
  },
  isTabs: (line) => line.match(tabLineRx) !== null,
  tabs: (line) => {
    if (line.match(tabLineRx) === null) {
      return false;
    }
    let result = [];
    let paddingBuffer = 0;

    let match = tabRx.exec(line);
    while (match) {
      let tab = match.groups();
      tab.padding = tab.padding.substring(paddingBuffer);
      // Convert note to numeric value
      tab.value = parseNote(tab);
      paddingBuffer = 4 - tab.tone.length;
      if (tab.semi) {
        paddingBuffer--;
      }
      // Find next match
      match = tabRx.exec(line);
      // Slide
      if (tab.separator == "/" && match.groups.padding == 0) {
        let slide = match.groups;
        slide.value = parseNote(slide);
        tab["slide"] = slide;
        paddingBuffer += 4 - slide.tone.length;
        if (slide.semi) {
          paddingBuffer++;
        }
        match = tabRx.exec(line);
      }
      result.push(tab);
    }
    return result;
  },
};
