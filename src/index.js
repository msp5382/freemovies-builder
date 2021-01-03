const axios = require("axios");
const fs = require("fs");
const path = require("path");
const jsdom = require("jsdom");
// axios
//   .post("https://freemovies.centos.vercel.app/api/load_index", { page: 1 })
//   .then(({ data }) => {
//     fs.writeFileSync(
//       path.join(__dirname, "..", "public", "indexCached.json"),
//       JSON.stringify(data)
//     );
//   });

axios
  .post("https://freemovies.centos.vercel.app/api/load_index", { page: 1 })
  .then(({ data }) => {
    Promise.all(
      data.map((movie) => {
        return axios.get("https://movie285.com/" + movie.href);
      })
    ).then((dataList) => {
      fs.writeFileSync(
        path.join(__dirname, "..", "public", "movie.json"),
        JSON.stringify(
          dataList.map((_data) => {
            const dom = new jsdom.JSDOM(_data.data);
            console.log(
              dom.window.document
                .getElementsByClassName("titlex")[0]
                .querySelector("h1").innerHTML
            );
            return {
              src: dom.window.document
                .getElementsByClassName("video-box")[0]
                .querySelector("iframe").src,
              title: dom.window.document
                .getElementsByClassName("titlex")[0]
                .querySelector("h1").innerHTML,
              synopsis: dom.window.document
                .querySelector(".x-content")
                .innerHTML.replace(/(<([^>]+)>)/gi, ""),
            };
          })
        )
      );
    });
  });
