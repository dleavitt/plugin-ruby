import type { Plugin, Ruby } from "../types";

const alwaysSkippable: Ruby.AnyNode["type"][] = [
  "array",
  "dyna_symbol",
  "hash",
  "heredoc",
  "lambda",
  "regexp_literal"
];

const skippableWithOption = alwaysSkippable.concat([
  "begin",
  "method_add_block",
  "case",
  "vcall",
  "binary",
  "if",
  "unless",
  "words",
  "symbols",
  "qwords",
  "qsymbols"
]);

function skipAssignIndent(node: Ruby.AnyNode, opts: Plugin.Options): boolean {
  const skippable = opts.rubyAssignmentNewline
    ? alwaysSkippable
    : skippableWithOption;

  return (
    skippable.includes(node.type) ||
    (node.type === "call" && skipAssignIndent(node.receiver, opts))
  );
}

export default skipAssignIndent;
