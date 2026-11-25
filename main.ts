import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "Borborygmus";
const NEWLINE = "\n";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const entryPath = join(outputDir, "entry.txt");

function fail(reason: string): never {
  console.error(`entry.txt was not written: ${reason}`);
  process.exit(1);
}

if (!/^[A-Za-z]{1,30}$/.test(WORD)) {
  fail(
    `the word ${JSON.stringify(WORD)} is not a single unpunctuated word of 1..30 ASCII letters`,
  );
}

const text = WORD + NEWLINE;
const characters = [...text].length;
const bytes = Buffer.byteLength(text, "utf8");

if (/\s/.test(WORD)) {
  fail(`the word ${JSON.stringify(WORD)} contains white space`);
}
if (!text.endsWith(NEWLINE) || text.endsWith(NEWLINE + NEWLINE)) {
  fail("the text must end with exactly one trailing newline");
}
if (text.trimEnd() !== WORD) {
  fail("trimming the trailing newline must leave exactly the word");
}
if (characters < 1 || characters > 30) {
  fail(`the text is ${characters} characters, outside the allowed 1..30`);
}
if (bytes < 1 || bytes > 30) {
  fail(`the text is ${bytes} bytes, outside the allowed 1..30`);
}
if (!/[^\s]/.test(text)) {
  fail(
    `the text is only white space, so the entry would be invalid; the word must carry visible characters`,
  );
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(entryPath, text, { encoding: "utf8" });

const written = readFileSync(entryPath);
const expected = Buffer.from(text, "utf8");
if (!written.equals(expected)) {
  fail(
    `read-back mismatch: expected ${expected.length} bytes, found ${written.length}`,
  );
}

console.log(`path: ${entryPath}`);
console.log(`text: ${JSON.stringify(text)}`);
console.log(`characters: ${characters}`);
console.log(`bytes: ${bytes}`);
console.log(`file size: ${written.length}`);
