import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_PROJECT_ID,
  dataset: import.meta.env.VITE_DATASET,
  apiVersion: "2021-03-25",
  token: import.meta.env.VITE_TOKEN,
  useCdn: false,
  ignoreBrowserTokenWarning: true,
});
