# AGENTS.md

## Project overview

`@rheactor/rheactor-core` is a shared utility library with five entry points:

- `src/index.ts`: base functions, universal (browser, server, edge)
- `src/index.node.ts`: Node.js functions
- `src/index.next.ts`: Next.js functions
- `src/index.postgres.ts`: PostgreSQL escaping functions, universal (browser, server, edge)
- `src/index.tailwind.ts`: Tailwind CSS class merging, universal (browser, server, edge)

Each entry point re-exports functions from files under `src/services/`.

## Mandatory rules

1. Every new exported function MUST be documented in `README.md`, under the matching entry point
   section (`Base functions`, `Node functions`, `Next functions`, `Postgres functions`, or
   `Tailwind functions`), inside the group of its service, in the exact format described below.
2. Every new exported function MUST have unit tests in `tests/services/<ServiceName>.test.ts`,
   mirroring the service file name.
3. Functions live in `src/services/<ServiceName>.ts` and are re-exported from the matching
   `src/index*.ts`. Only exports in the index files are public API and documented.
4. Internal imports use the `#/` alias (mapped to `./src/*` in `package.json` and `tsconfig.json`);
   tests may additionally use `#tests/*`.
5. `README.md`, `AGENTS.md`, and `CHANGELOG.md` are maintained by the `/create-agents` skill, which
   audits them against the code. Never generate or regenerate them with ad hoc scripts.

## Testing policy

- Framework: Vitest, always executed through `bun run test` (single run) or `bun run test:watch`.
- Tests live in `tests/services/<ServiceName>.test.ts`, one file per service, mirroring the service
  file name.
- Every bug fix MUST include a regression test that reproduces the bug before the fix.
- No coverage threshold is configured; do not introduce one without need.

## Documentation format

Functions are grouped under `## <Service> functions` headings (e.g. `## Array functions`,
`## JSON functions`), ordered alphabetically by service name inside each entry point section. Each
group heading is followed by a brief description of what that group does. Individual functions use
`### functionName` and follow this pattern:

````markdown
### functionName

```ts
signature in TypeScript;
// list every overload in the same code block
```

One to three sentences stating: what it does, when to use it, and notable edge-case behavior, in
that order.

```ts
// minimal TypeScript example with expected output as a comment
```
````

**Additional conventions:**

- Entry point sections use `# Base functions`, `# Node functions`, etc., each opened by an import
  example pointing at the correct subpath import.
- Keep groups in alphabetical order by service name; add new groups in the correct position.
- Document overloads by listing every overload signature in the same code block, then explain each
  use case briefly.
- Document exported types (e.g. `Arrayable`, `RequestOptions`) next to the functions that use them.
- Descriptions must be LLM-friendly: purpose, typical use case, and edge-case behavior come first.
- Examples must be TypeScript, minimal, and self-contained.

## Dependency policy

- Bun is the official package manager (`bun.lock`); install with `bun install`.
- No new runtime dependencies without justification. `is-path-inside` is bundled into the node
  build; `next` and `tailwind-merge` are optional peer dependencies of their own entry points.

## Build and publish

- Private package: it is consumed directly, not published to npm.
- `tsdown` bundles each entry point into `dist/`; `bun run build` runs lint and tests first.

## Quality gates

Scripts available in `package.json`: `build`, `lint`, `lint:fix`, `oxfmt`, `oxfmt:fix`, `oxlint`,
`oxlint:fix`, `test`, `test:watch`, `typecheck`.

Run before finishing any change:

- `bun run typecheck`
- `bun run lint`
- `bun run test`

> Always use `bun run <script>` (the `package.json` scripts), never a direct binary: bare
> `bun test`, for instance, bypasses the project's vitest configuration.
