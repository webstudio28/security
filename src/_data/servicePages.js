const fs = require("fs");
const path = require("path");

function loadServices() {
  const services = JSON.parse(fs.readFileSync(path.join(__dirname, "services.json"), "utf8"));
  const terrainServices = JSON.parse(fs.readFileSync(path.join(__dirname, "terrainServices.json"), "utf8"));
  return [...services, ...terrainServices];
}

/** Services that still get a `/uslugi/{slug}/` detail page (not an external href). */
module.exports = function () {
  return loadServices().filter((s) => !s.href && (!s.menuGroup || s.detailPage));
};
