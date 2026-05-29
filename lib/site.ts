export const siteConfig = {
  name: "ClearWord Lab",
  siteUrl: "https://clearwordlab.com",
  description:
    "A simple English learning tool for ESL learners, helping them understand confusing English words through clear explanations, examples, and practice quizzes.",
};

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.siteUrl).toString();
}
