const axios = require("axios");
const fs = require("fs");
const path = require("path");

axios
  .post("https://freemovies.centos.vercel.app/api/load_index", { page: 1 })
  .then(({ data }) => {
    fs.writeFileSync(
      path.join(__dirname, "..", "public", "indexCached.json"),
      JSON.stringify(data)
    );
  });
