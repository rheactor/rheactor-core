export function removeDiacritics(word: string) {
  return word.normalize("NFD").replaceAll(/[\u{0300}-\u{036F}]/gv, "");
}

export function slugify(word: string, separator = "-") {
  return removeDiacritics(word.trim().toLowerCase())
    .replaceAll(/\W+/gv, separator)
    .replaceAll(/^-+|-+$/gv, "");
}

export function slugifyId(id: number, word: string) {
  return `${id}-${slugify(word)}`;
}

export function extractSlugId(id: string) {
  const [extractedId] = id.split("-", 1);
  const castId = Number(extractedId);

  return Number.isSafeInteger(castId) && String(castId) === extractedId ? castId : undefined;
}
