import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "cathiwarren-art",
  title: "Cathi Warren Art — Studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singleton — one Artist Profile document with a fixed ID
            S.listItem()
              .title("Artist Profile")
              .child(
                S.document()
                  .schemaType("artistProfile")
                  .documentId("artistProfile")
              ),
            S.divider(),
            // All other document types (artwork, blogPost) as normal lists
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== "artistProfile"
            ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
