import { defineField } from "sanity";

export default defineField({
  name: "aggregateRating",
  title: "Aggregate Rating",
  type: "object",
  description:
    "Manual aggregate rating data. Used for Schema.org AggregateRating structured data.",
  fields: [
    defineField({
      name: "ratingValue",
      title: "Rating Value",
      type: "number",
      validation: (Rule) => Rule.min(1).max(5).precision(1),
      description: "Average rating (1.0 - 5.0)",
    }),
    defineField({
      name: "reviewCount",
      title: "Review Count",
      type: "number",
      validation: (Rule) => Rule.min(1).integer(),
      description: "Total number of reviews",
    }),
    defineField({
      name: "bestRating",
      title: "Best Rating",
      type: "number",
      initialValue: 5,
      description: "Highest possible rating (default: 5)",
    }),
    defineField({
      name: "ratingSource",
      title: "Rating Source",
      type: "string",
      description: "Where this rating data comes from",
      options: {
        list: [
          { title: "Google Maps", value: "google-maps" },
          { title: "Internal Reviews", value: "internal" },
          { title: "Tokopedia", value: "tokopedia" },
          { title: "Shopee", value: "shopee" },
          { title: "Calculated from Reviews", value: "calculated" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      type: "url",
      description: "Link to the review profile (e.g. Google Maps listing URL)",
    }),
  ],
});
