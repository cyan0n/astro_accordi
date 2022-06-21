const fs = require("fs/promises");
const path = require("path");
const parser = require("./parser");
const urlSlug = require("url-slug");

const getTitleArtist = (filename) => {
  const split = path
    .basename(filename, ".txt")
    .split("-")
    .map((x) => x.trim());
  return split.length > 1 ? split.reverse() : split;
};

const generateSlug = (title, artist) => {
  let url = title;
  if (artist) {
    url = `${artist} ${title}`;
  }
  return urlSlug(url);
};

const readSong = async (song_path) => {
  const song = {
    category: null,
    sub_category: null,
    lines: [{ type: "empty" }, { type: "empty" }],
  };
  let key = 0;
  (await fs.readFile(song_path, "utf8")).split("\n").forEach((line) => {
    if (parser.isCategory(line)) {
      const category_split = parser.category(line).split(".");
      song.category = category_split[0];
      song.sub_category = category_split[1] || undefined;
      return;
    }
    if (parser.isKey(line)) {
      key = parser.key(line);
      return;
    }
    if (parser.isTabs(line)) {
      song.lines.push({
        type: "tablature",
        key,
        tabs: parser.tabs(line),
      });
      return;
    }
    if (line.trim() !== "") {
      song.lines.push({
        type: "lyric",
        lyric: line,
      });
      return;
    }
    song.lines.push({ type: "empty" });
  });
  return song;
};

const readSongs = async () => {
  const result = [];
  const songs_dir = path.join(__dirname, "songs");
  for (const song_filename of await fs.readdir(songs_dir)) {
    const [title, artist] = getTitleArtist(song_filename);
    result.push({
      title,
      artist,
      slug: generateSlug(title, artist),
      ...(await readSong(path.join(songs_dir, song_filename))),
    });
  }
  return result;
};

const output_dir = path.join(process.cwd(), "src", "data", "songs");
const clearFiles = async () => {
  for (const filename of await fs.readdir(output_dir)) {
    if (filename === ".gitkeep") {
      return;
    }
    await fs.unlink(path.join(output_dir, filename));
  }
};

const writeSongIndex = (songs) => {
  const songs_document = {};
  songs.forEach(({ category, sub_category, lines: _, ...song }) => {
    if (sub_category) {
      if (!songs_document.hasOwnProperty(category)) {
        songs_document[category] = {};
      }
      if (!songs_document[category].hasOwnProperty(sub_category)) {
        songs_document[category][sub_category] = [];
      }
      songs_document[category][sub_category].push(song);
    } else {
      if (!songs_document.hasOwnProperty(category)) {
        songs_document[category] = [];
      }
      songs_document[category].push(song);
    }
  });
  fs.writeFile(
    path.join(output_dir, "index.json"),
    JSON.stringify(songs_document, null, 2),
  );
};

const writeSongPaths = (songs) => {
  const document = [];
  songs.forEach(({ slug }) => {
    document.push(slug);
  });
  fs.writeFile(
    path.join(output_dir, "paths.json"),
    JSON.stringify(document, null, 2),
  );
};

const writeSong = (song) => {
  fs.writeFile(
    path.join(output_dir, `${song.slug}.json`),
    JSON.stringify(song, null, 2),
  );
};

(async () => {
  clearFiles();
  const songs = await readSongs();
  writeSongIndex(songs);
  writeSongPaths(songs);
  songs.forEach(writeSong);
})();
