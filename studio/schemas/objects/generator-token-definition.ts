import { defineField, defineType } from "sanity";

const hasUsableTokenResolution = (value: unknown, context: { parent?: unknown }) => {
  const isRequired = value === true;
  if (!isRequired) {
    return true;
  }

  const parent = (context.parent ?? {}) as {
    sourceField?: unknown;
    fallbackValue?: unknown;
  };
  const sourceField =
    typeof parent.sourceField === "string" ? parent.sourceField.trim() : "";
  const fallbackValue =
    typeof parent.fallbackValue === "string" ? parent.fallbackValue.trim() : "";

  return sourceField || fallbackValue
    ? true
    : "Required tokens must define sourceField or fallbackValue.";
};

export default defineType({
  name: "generatorTokenDefinition",
  title: "Generator Token Definition",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sourceField",
      title: "Source Field",
      type: "string",
      description: "Field key expected from keyword sets or rows.",
    }),
    defineField({
      name: "fallbackValue",
      title: "Fallback Value",
      type: "string",
    }),
    defineField({
      name: "required",
      title: "Required",
      type: "boolean",
      initialValue: false,
      validation: (Rule) => Rule.custom(hasUsableTokenResolution),
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "name",
    },
  },
});
