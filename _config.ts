import lume from "lume/mod.ts";
import date from "lume/plugins/date.ts";
import jsx from "lume/plugins/jsx_preact.ts";

import beautify from "npm:js-beautify@1.15.1";

const site = lume({
  src: "./src",
});

site.use(jsx({
  extensions: [".tsx"],
}));

site.use(date());

site.copy([".wgsl", ".css", ".jpg", ".png", ".gif", ".html", ".js", ".ttf"]);

site.process([".html"], (files) => {
  for (const file of files) {
    file.content = beautify.html(file.content, {
      indent_size: 2,
      wrap_line_length: 120,
    });
  }
});

export default site;
