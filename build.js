const { exec } = require("child_process");
const fs = require("fs");
require("dotenv").config();

const destination = "./src/data/song.json";

if (fs.existsSync(destination)) {
  fs.unlinkSync(destination);
}

fs.copyFileSync(`./src/data/songs/${process.env.SONG_SLUG}.json`, destination);

exec("npm run astro-build", (error, out, err) => {
  if (error) {
    console.log("error");
    return;
  }
  if (err) {
    console.log(err);
  }
  console.log(out);
});
