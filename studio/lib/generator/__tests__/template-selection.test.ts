import test from "node:test";
import assert from "node:assert/strict";

import { selectTemplateForRow } from "../template-selection";
import type { GeneratorRow, GeneratorTemplateLite } from "../types";

const templates: GeneratorTemplateLite[] = [
  { _id: "template-a", title: "Template A" },
  { _id: "template-b", title: "Template B" },
  { _id: "template-c", title: "Template C" },
];

const row: GeneratorRow = {
  _key: "row-surabaya",
  key: "stable-surabaya",
  service: "Cetak Buku",
  city: "surabaya",
  primaryKeyword: "cetak buku surabaya",
};

test("selectTemplateForRow returns the same template for the same program and row", () => {
  const first = selectTemplateForRow({ programId: "program-1", row, templates });
  const second = selectTemplateForRow({ programId: "program-1", row, templates });

  assert.equal(first?._id, second?._id);
});

test("selectTemplateForRow uses row fallback data when key is missing", () => {
  const selected = selectTemplateForRow({
    programId: "program-1",
    row: { ...row, key: undefined, _key: undefined },
    templates,
  });

  assert.ok(selected);
  assert.ok(templates.some((template) => template._id === selected?._id));
});

test("selectTemplateForRow returns the only template without hashing ambiguity", () => {
  const selected = selectTemplateForRow({ programId: "program-1", row, templates: [templates[1]!] });

  assert.equal(selected?._id, "template-b");
});

test("selectTemplateForRow returns null for an empty template list", () => {
  const selected = selectTemplateForRow({ programId: "program-1", row, templates: [] });

  assert.equal(selected, null);
});
