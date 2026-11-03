# Route loading verification — 2026-11-03

Measured in the evidence worktree after merging the integrated `main` baseline
(`bfa4810`). These are production-build payload measurements, not browser timing
or an assertion about the user's network.

| Output | Before | After |
|---|---:|---:|
| Initial Home JavaScript | 2,594.69 kB | 334.25 kB |
| Initial Home JavaScript gzip | 797.55 kB | 103.57 kB |
| Initial CSS | 194.95 kB | 103.69 kB |
| Deferred document editor | 431.16 kB | 431.16 kB |

The initial static JavaScript closure contains only the application entry. The
manifest does not preload Builder/React Flow, the configuration registry and its
notes, full chapter text, worked cases or the practice question bank for Home.
The full-text search index loads only after a nonempty user query. Stale search
responses cannot replace results for another query/exam or reopen a closed view.

Representative deferred chunks in this build:

| Chunk | Minified kB | Gzip kB |
|---|---:|---:|
| Builder route | 467.59 | 146.00 |
| Configuration registry (shared by demanding routes) | 878.15 | 263.10 |
| Chapter content | 333.36 | 103.92 |
| Practice page/question bank | 193.87 | 62.17 |
| Chapter reader/worked cases | 75.41 | 25.15 |
| Service-library entry | 9.21 | 3.14 |
| Coverage entry | 7.78 | 3.15 |

These are individual chunks, not complete route download costs. For example,
Practice and Service library also use the shared configuration registry in this
release. The registry remains above Vite's advisory threshold. Deferring it
improves initial loading; it does not make the registry small or establish fast
editing performance. The document editor stays separately deferred.

## Reproduce

```text
npm run typecheck
node node_modules/vite/bin/vite.js build --manifest
node scripts/report-route-chunks.mjs
```

The reporter traverses static `imports`, excludes `dynamicImports` from initial
load, and prints each lazy entry's incremental static closure after Home. It uses
actual emitted files and gzip sizes. Recompute after future source changes;
chunk names and sizes in this document describe this specific measurement.

## Navigation and compatibility checks

- Existing reading, bookmark, service and practice route guards are retained.
- Chapter/section IDs are in lightweight generated metadata; lesson bodies and
  question data remain in their original files. The metadata equivalence test
  ensures navigation cannot silently drift from the current curriculum.
- Run `node scripts/update-chapter-navigation.mjs` after changing chapter IDs,
  section IDs, exam membership or chapter order. `--check` compares without writes.
- Accepted navigation away from Builder clears unconsumed example/add-service
  requests synchronously. A late module download cannot replay them on return.
- Failed route loading leaves the app navigation available and offers reload.
- Real lazy imports are used in tests. No eager test-mode implementation bypass
  exists. Existing integration tests now await route mount; the slow-download
  regression delays the actual Builder module while testing both UI navigation
  and browser Back before resolving it.

Targeted verification: 22 tests across eight route/navigation/learning/Home files
passed before the final small search-selection cleanup; relevant search tests
were rerun afterward. TypeScript and the production build passed. The owner runs
integrated release verification and native-browser checks separately; no full
suite, paid AI call or native browser was run concurrently by this lane.
