import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z
      .object({
        title: z.string().trim().min(3, "Title is required"),
        description: z
          .string()
          .trim()
          .min(12, "Description should briefly summarize the post"),
        publishedDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        author: z.string().trim().default("Bibek Joshi"),
        tags: z
          .union([z.array(z.string()), z.string()])
          .default([])
          .transform((value) => {
            const rawTags = Array.isArray(value) ? value : value.split(",");
            const cleaned = rawTags
              .map((tag) => tag.trim())
              .filter(Boolean);

            return [...new Set(cleaned)];
          }),
        category: z.string().trim().min(1).default("General"),
        featuredImage: image().optional(),
        draft: z.boolean().default(false),
      })
      .refine(
        (data) => !data.updatedDate || data.updatedDate >= data.publishedDate,
        {
          message: "updatedDate must be on or after publishedDate",
          path: ["updatedDate"],
        },
      ),
});

export const collections = { blog };
