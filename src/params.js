const { concat, group, join } = require("prettier").doc.builders;

const printKwargRestParam = (path, options, print) => (
  concat(["**", path.call(print, "body", 0)])
);

const printRestParam = (path, options, print) => (
  concat(["*", path.call(print, "body", 0)])
);

const printParams = (path, options, print) => {
  const [reqs, opts, rest, post, kwargs, kwarg_rest, block] = path.getValue().body;
  let parts = [];

  if (reqs) {
    parts = parts.concat(path.map(print, "body", 0));
  }

  if (opts) {
    parts = parts.concat(opts.map((_, index) => concat([
      path.call(print, "body", 1, index, 0),
      " = ",
      path.call(print, "body", 1, index, 1)
    ])));
  }

  if (rest) {
    parts.push(path.call(print, "body", 2));
  }

  if (post) {
    parts = parts.concat(path.map(print, "body", 3));
  }

  if (kwargs) {
    parts = parts.concat(kwargs.map(([kwarg, value], index) => {
      if (!value) {
        return path.call(print, "body", 4, index, 0);
      }
      return group(join(" ", path.map(print, "body", 4, index)));
    }));
  }

  if (kwarg_rest) {
    parts.push(path.call(print, "body", 5));
  }

  if (block) {
    parts.push(path.call(print, "body", 6));
  }

  return join(", ", parts);
};

module.exports = {
  printKwargRestParam,
  printRestParam,
  printParams
};
