import { long, ruby } from "../../utils";

describe("assign", () => {
  describe("single assignment", () => {
    test("basic", () => {
      expect("a = 1").toMatchFormat();
    });

    test("multiline begin", () => {
      const content = ruby(`
        a =
          begin
            1
          end
      `);

      expect(content).toMatchFormat({ rubyAssignmentNewline: true });
    });

    test("multiline begin no newline", () => {
      const content = ruby(`
        a = begin
          1
        end
      `);

      expect(content).toMatchFormat({ rubyAssignmentNewline: false });
    });

    test("multiline block no newline", () => {
      const content = ruby(`
        a = myblock do |a, b, c|
          ${long}
        end
      `);

      expect(content).toMatchFormat({ rubyAssignmentNewline: false });
    });

    test("multiline block 2 no newline", () => {
      const content = ruby(`
        a = x.y.myblock do |a, b, c|
          ${long}
        end
      `);

      expect(content).toMatchFormat({ rubyAssignmentNewline: false });
    });

    test("case", () => {
      const content = ruby(`
        a =
          case b
          when c
            adsf
          else
            bsf
          end
      `);

      expect(content).toMatchFormat({ rubyAssignmentNewline: true });
    });

    test("case no newline", () => {
      const content = ruby(`
        a = case b
        when c
          adsf
        else
          bsf
        end
      `);

      expect(content).toMatchFormat({ rubyAssignmentNewline: false });
    });

    test("long rhs", () => {
      const content = ruby(`
        a =
          ${long}
      `);

      expect(content).toMatchFormat({ rubyAssignmentNewline: true });
    });

    test("long rhs no newline", () => {
      const content = `a = ${long}`;

      expect(content).toMatchFormat({ rubyAssignmentNewline: false });
    });

    test("multiline block 2 no newline", () => {
      const content = `a = myblock { ${long} }`;

      expect(content).toChangeFormat(
        ruby(`
        a = myblock do
          ${long}
        end
      `),
        { rubyAssignmentNewline: false }
      );
    });

    test("assignment from a conditional", () => {
      const content = ruby(`
        a =
          if true
            ${long}
          else
            ${long}
          end
      `);

      expect(content).toMatchFormat({ rubyAssignmentNewline: true });
    });

    test("assignment from a conditional no newline", () => {
      const content = ruby(`
        a = if true
          ${long}
        else
          ${long}
        end
      `);

      expect(content).toMatchFormat({ rubyAssignmentNewline: false });
    });

    test("with ||", () => {
      const content = `a = ${long} || ${long}`;

      expect(content).toChangeFormat(
        ruby(`
        a =
          ${long} ||
            ${long}
      `),
        { rubyAssignmentNewline: true }
      );
    });

    test("with || no newline", () => {
      const content = `a = ${long} || ${long}`;

      expect(content).toChangeFormat(
        ruby(`
        a = ${long} ||
          ${long}
      `),
        { rubyAssignmentNewline: false }
      );
    });

    test("other operator", () => {
      expect("a ||= b").toMatchFormat({ rubyAssignmentNewline: true });
      expect("a ||= b").toMatchFormat({ rubyAssignmentNewline: false });
    });
  });

  test("heredoc", () => {
    const content = ruby(`
      text = <<-TEXT
        abcd
      TEXT
    `);

    expect(content).toMatchFormat();
  });

  describe("breaking", () => {
    test("inline becomes multi line", () => {
      expect(`${long} = ${long}`).toChangeFormat(`${long} =\n  ${long}`);
    });

    test("arrays don't get force indented", () => {
      expect(`a = [${long}, ${long}, ${long}]`).toChangeFormat(
        ruby(`
          a = [
            ${long},
            ${long},
            ${long}
          ]
        `)
      );
    });

    test("hashes don't get force indented", () => {
      expect(`a = { a: ${long}, b: ${long}, c: ${long} }`).toChangeFormat(
        ruby(`
          a = {
            a:
              ${long},
            b:
              ${long},
            c:
              ${long}
          }
        `),
        { rubyAssignmentNewline: true }
      );
    });

    test("hash values indented correctly no newline", () => {
      expect(`a = { a: ${long}, b: ${long}, c: ${long} }`).toChangeFormat(
        ruby(`
          a = {
            a: ${long},
            b: ${long},
            c: ${long}
          }
        `),
        { rubyAssignmentNewline: false }
      );
    });

    test("chained methods on array literals don't get oddly indented", () => {
      expect(`a = [${long}].freeze`).toChangeFormat(
        ruby(`
          a = [
            ${long}
          ].freeze
        `)
      );
    });

    test("chained methods on hash literals don't get oddly indented", () => {
      expect(`a = { a: ${long} }.freeze`).toChangeFormat(
        ruby(`
          a = {
            a:
              ${long}
          }.freeze
        `)
      );
    });

    test("hash literal values aren't indented no newline", () => {
      expect(`a = { a: ${long} }.freeze`).toChangeFormat(
        ruby(`
          a = {
            a: ${long}
          }.freeze
        `),
        { rubyAssignmentNewline: false }
      );
    });

    test("quotewords and similar aren't weirdly indented", () => {
      const qwTypes = ["w", "W", "i", "I"];

      qwTypes.forEach((literal) => {
        expect(`a = %${literal}[${long} ${long}].freeze`).toChangeFormat(
          ruby(`
            a =
              %${literal}[
                ${long}
                ${long}
              ].freeze
          `),
          { rubyAssignmentNewline: true }
        );
      });
    });

    test("quotewords etc aren't weirdly indented no newline", () => {
      const qwTypes = ["w", "W", "i", "I"];

      qwTypes.forEach((literal) => {
        expect(`a = %${literal}[${long} ${long}].freeze`).toChangeFormat(
          ruby(`
            a = %${literal}[
              ${long}
              ${long}
            ].freeze
          `),
          { rubyAssignmentNewline: false }
        );
      });
    });
  });

  describe("constants", () => {
    test("assigning to constant", () => {
      expect("Pret::TIER = 'config'").toMatchFormat();
    });

    test("assigning to top level constants", () => {
      expect("::PRETTIER = 'config'").toMatchFormat();
    });
  });
});
