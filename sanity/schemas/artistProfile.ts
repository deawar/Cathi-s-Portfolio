import { defineField, defineType } from "sanity";

export default defineType({
  name: "artistProfile",
  title: "Artist Profile",
  type: "document",
  fields: [
    defineField({
      name: "photo",
      title: "Artist Photo",
      type: "image",
      options: { hotspot: true },
      description: "Portrait photo shown on the About page",
    }),
    defineField({
      name: "photoCaption",
      title: "Photo Caption",
      type: "string",
      description: "Optional caption shown below the photo",
    }),
    defineField({
      name: "artistStatement",
      title: "Artist Statement",
      type: "array",
      of: [{ type: "block" }],
      description: "Written statement about your artistic vision and practice",
    }),
    defineField({
      name: "biography",
      title: "Biography",
      type: "array",
      of: [{ type: "block" }],
      description: "Background, training, exhibitions, and career highlights",
    }),
    defineField({
      name: "cv",
      title: "CV / Exhibitions",
      type: "array",
      of: [{ type: "block" }],
      description: "Optional — exhibitions, awards, collections, education",
    }),
    defineField({
      name: "contactNote",
      title: "Contact Note",
      type: "text",
      rows: 2,
      description: "Short line shown at the bottom of the page (e.g. commission or inquiry info)",
      initialValue: "For inquiries about available work, commissions, or exhibitions, please use the contact form.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Artist Profile" };
    },
  },
});
