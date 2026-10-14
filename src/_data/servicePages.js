const fs = require("fs");
const path = require("path");

function loadServices() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "services.json"), "utf8"));
}

/** Services that still get a `/uslugi/{slug}/` detail page (not an external href). */
module.exports = function () {
  return loadServices().filter((s) => !s.href && !s.menuGroup);
};
