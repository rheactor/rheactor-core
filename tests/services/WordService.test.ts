import { describe, expect, it } from "vitest";

import { extractSlugId, removeDiacritics, slugify, slugifyId } from "#/services/WordService";

describe("services/WordService", () => {
  const removeDiacriticsTests = [
    ["Ação", "Acao"],
    ["café", "cafe"],
    ["lápis", "lapis"],
    ["fácil", "facil"],
    ["último", "ultimo"],
    ["árvore", "arvore"],
    ["pêssego", "pessego"],
    ["pôr", "por"],
    ["irmã", "irma"],
    ["cabeça", "cabeca"],
    ["às", "as"],
  ] as const;

  it.each(removeDiacriticsTests)("removeDiacritics(%j) = %j", (test, expected) => {
    expect(removeDiacritics(test)).toStrictEqual(expected);
  });

  const slugifyTests = [
    ["Ação", "acao"],
    ["café", "cafe"],
    ["lápis", "lapis"],
    ["fácil", "facil"],
    ["último", "ultimo"],
    ["árvore", "arvore"],
    ["pêssego", "pessego"],
    ["pôr", "por"],
    ["irmã", "irma"],
    ["cabeça", "cabeca"],
    ["às", "as"],
    ["ação de teste", "acao-de-teste"],
    ["pôr-do-sol", "por-do-sol"],
    ["a--b--c", "a-b-c"],
    ["a,-b,-c", "a-b-c"],
    ["-2025-", "2025"],
  ] as const;

  it.each(slugifyTests)("slugify(%j) = %j", (test, expected) => {
    expect(slugify(test)).toStrictEqual(expected);
  });

  it.each(slugifyTests)('slugifyId(%j) = "123-%s"', (test, expected) => {
    expect(slugifyId(123, test)).toBe(`123-${expected}`);
  });

  const extractSlugIdTests = [
    ["", undefined],
    ["-test", undefined],
    ["test", undefined],
    ["-1-test", undefined],
    ["10e3-test", undefined],
    ["0-test", 0],
    ["123-test", 123],
  ] as const;

  it.each(extractSlugIdTests)("extractSlugId(%j) = %j", (input, expected) => {
    expect(extractSlugId(input)).toBe(expected);
  });
});
