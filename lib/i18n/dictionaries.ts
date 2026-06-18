import "server-only";

const dictionaries = {
  en: () => import("@/messages/en.json").then((module) => module.default),
  id: () => import("@/messages/id.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: string) => {
  const safeLocale = (locale in dictionaries ? locale : "en") as Locale;
  return dictionaries[safeLocale]();
};

// Helper type to get the structure of the dictionary for client components
export type Dictionary = Awaited<ReturnType<typeof dictionaries.en>>;
