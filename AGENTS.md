# AGENTS.md

## Project overview

`@rheactor/rheactor-core` is a shared utility library with four entry points:

- `src/index.ts`: base functions, universal (browser, server, edge)
- `src/index.node.ts`: Node.js functions
- `src/index.next.ts`: Next.js functions
- `src/index.postgres.ts`: PostgreSQL escaping functions, universal (browser, server, edge)

Each entry point re-exports functions from files under `src/services/`.

## Mandatory rules for new functions

1. Every new exported function MUST be documented in `README.md`, under the matching entry point
   section (`Base functions`, `Node functions`, or `Next functions`), inside the group of its
   service, in the exact format described below.
2. Every new exported function MUST have unit tests in `tests/services/<ServiceName>.test.ts`,
   mirroring the service file name.
3. `README.md` is maintained manually. Never generate or regenerate it with a script.
4. Functions live in `src/services/<ServiceName>.ts` and are re-exported from the matching
   `src/index*.ts`. Only exports in the index files are public API and documented.

## README.md entry format

Functions are grouped under `## <Service> functions` headings (e.g. `## Array functions`,
`## JSON functions`), ordered alphabetically by service name. Each group heading is followed by a
brief description of what that group does. Individual functions use `### functionName` and follow
this pattern:

````markdown
### functionName

```ts
signature in TypeScript;
```

One to three sentences stating: what it does, when to use it, and notable edge-case behavior.

```ts
// minimal TypeScript example with expected output as a comment
```
````

**Additional conventions:**

- Keep groups in alphabetical order by service name; add new groups in the correct position.
- Document overloads by listing every overload signature in the same code block, then explain each
  use case briefly.
- Document exported types (e.g. `Arrayable`) next to the functions that use them.
- Descriptions must be LLM-friendly: purpose, typical use case, and edge-case behavior come first.
- Examples must be TypeScript, minimal, and self-contained.

## Quality gates

Run before finishing any change:

- `bun run typecheck`
- `bun run lint`
- `bun run test`

> Always use `bun run test` (the `package.json` script). Never use bare `bun test`: it bypasses
> the project's vitest configuration.
