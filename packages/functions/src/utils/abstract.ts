export const uniq = (strings: string[]): string[] =>
  strings.map((string) =>
    string
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
  );
