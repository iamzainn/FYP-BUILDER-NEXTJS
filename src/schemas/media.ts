import { z } from "zod";

export const mediaFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().optional(),
  url: z.string().url("Invalid media URL"),
  fileKey: z.string(),
  mediaType: z.enum(["IMAGE", "VIDEO", "DOCUMENT", "AUDIO"]),
});

export type MediaFormValues = z.infer<typeof mediaFormSchema>; 