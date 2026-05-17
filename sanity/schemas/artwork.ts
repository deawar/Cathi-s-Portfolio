import { defineField, defineType } from "sanity";

export default defineType({
  name: "artwork",
  title: "Artwork",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "artworkType",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Painting", value: "painting" },
          { title: "Sculpture", value: "sculpture" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "medium",
      title: "Medium",
      type: "string",
      description: 'e.g. "Oil on Canvas", "Bronze", "Watercolor"',
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "string",
      description: 'e.g. "24\\" × 36\\""',
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "series",
      title: "Series / Category",
      type: "string",
      description: 'e.g. "Landscapes", "Portraits", "Abstract", "Florals"',
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      description: "Show this artwork in the homepage featured section",
      initialValue: false,
    }),
    defineField({
      name: "heroSlide",
      title: "Use as Hero Slideshow Image",
      type: "boolean",
      description: "Include in the top hero slideshow",
      initialValue: false,
    }),
    defineField({
      name: "available",
      title: "Available for Purchase",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "price",
      title: "Price (optional)",
      type: "number",
      description: "Leave blank if price on request",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      subtitle: "artworkType",
    },
  },
});
