# Theory source and license research

Checked **2026-11-01**. This records provenance decisions for this project, not a legal opinion or a blanket endorsement of third-party content.

## Content policy

The expanded theory must be **original explanatory synthesis based on current official AWS documentation**, with links and dated source metadata. Public accessibility does not establish redistribution rights. No repository prose, diagrams, tables, question banks, course transcripts, or code were imported in this research. No plugins or repository scripts were installed or run.

Community repositories may be listed as clearly labeled **non-authoritative supplementary indexes**, not as official AWS material or evidence of complete exam coverage. Do not ingest exam dumps, leaked/recalled questions, pirated courses, or content with uncertain provenance. README references to commercial courses are not a license to reproduce those courses. Future reuse requires a separate file-level provenance/license review and appropriate notices.

[GitHub's repository licensing guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) explains why a public repository without a license is not automatically open for unrestricted reuse. Where a license was not found, this project adopts the conservative no-copy decision rather than inferring permission.

## Evidence method and recency

Opened each requested GitHub repository, its visible root and README, and available license file. Queried GitHub's public repository metadata, `/license`, and latest default-branch commit endpoints. `updated_at` can reflect non-content activity; it is **not** used as the content date. Dates below are the latest default-branch commit timestamps returned during review, not promises that every note was updated then. A `/license` 404 means the endpoint did not identify a license, not proof that no notice can exist in any nested file or historical commit. No exhaustive third-party authorship audit was conducted.

## Inventory

### 1. peorth80/aws-developer-associate-notes-DVA-C02

- **Existence:** [requested repository](https://github.com/peorth80/aws-developer-associate-notes-DVA-C02) exists; default branch `master`, a fork of the renamed itsmostafa repository.
- **Recency:** latest reviewed [commit](https://github.com/peorth80/aws-developer-associate-notes-DVA-C02/commit/0ce286c3eff8ef6e95acb4f90465cb1037e61c0d), **2025-07-03T12:16:03Z**. The README's 2025 label is not evidence of 2026 currency.
- **License evidence:** root lists no license; README search found none; [license API](https://api.github.com/repos/peorth80/aws-developer-associate-notes-DVA-C02/license) returned 404. Metadata license was null. Do not assume the upstream repository's current MIT notice retroactively covers this fork's historical contents.
- **Quality/risk:** broad service-organized notes, but exam overview includes an obsolete Refactoring domain. Individual service facts and inherited authorship would require verification.
- **Decision:** research inventory only; **no copy, adaptation, or content import**. Prefer the official guide over this index for exam alignment.

### 2. ihatesea69/aws-dva-c02-study-plan

- **Existence:** [repository](https://github.com/ihatesea69/aws-dva-c02-study-plan) exists; default branch `main`.
- **Recency:** latest reviewed [commit](https://github.com/ihatesea69/aws-dva-c02-study-plan/commit/dd3260b70ddcd259dd2d1fe9c01838acb087a650), **2026-02-14T15:42:30Z**.
- **License evidence:** [README License section](https://github.com/ihatesea69/aws-dva-c02-study-plan#license) states a personal educational purpose and AWS trademark notice; no explicit broad redistribution/adaptation grant was established. [License API](https://api.github.com/repos/ihatesea69/aws-dva-c02-study-plan/license) returned 404. A Hugo theme/submodule license does not automatically cover original study prose.
- **Quality/risk:** organized by exam domains and skills; author claims theory/labs and practice-question placeholders. That claim does not prove completeness, correctness, or question provenance. AWS-style presentation does not establish AWS endorsement.
- **Decision:** optional **community index link only**. No notes, labs, question content, layout assets, or course-derived content imported.

### 3. itsmostafa/certified-aws-developer-associate-notes

- **Existence/change:** [requested URL](https://github.com/itsmostafa/certified-aws-developer-associate-notes) currently redirects to [itsmostafa/aws-agent-skills](https://github.com/itsmostafa/aws-agent-skills), default branch `main`. It must not be described as the unchanged certification-notes project.
- **Recency:** current repository latest reviewed [commit](https://github.com/itsmostafa/aws-agent-skills/commit/3ee171adbe5ce02086fec9fde0b437a30958f34f), **2026-10-26T21:25:46Z**.
- **License evidence:** [actual LICENSE file](https://github.com/itsmostafa/aws-agent-skills/blob/main/LICENSE), GitHub blob `b77bf2ab726c6e7cb5a81a9d3b7dc38266ebfd3d`, identifies MIT and a 2025 copyright notice without a named holder in the displayed notice. If substantial covered material were reused, retain the copyright and permission notices; do not erase the disclaimer. MIT does not authenticate the accuracy or third-party rights of every file.
- **Quality/risk:** current project is an agent-oriented AWS skills collection. Its automatic-update claim was not independently audited; it is not an official exam authority. Installation instructions were not executed.
- **Decision:** inventory/reference only; **no reuse in this version**, despite the current permissive license. Do not infer licensing of older snapshots/forks from this current file.

### 4. azamuktam/aws-dva-c02-guides

- **Existence:** [repository](https://github.com/azamuktam/aws-dva-c02-guides) exists; default branch `main`.
- **Recency:** latest reviewed [commit](https://github.com/azamuktam/aws-dva-c02-guides/commit/7cdbc26377a7dd34cb97e7f6e993436d067afc1b), **2026-10-11T17:30:11Z**.
- **License evidence:** no root license or README license grant found; [license API](https://api.github.com/repos/azamuktam/aws-dva-c02-guides/license) returned 404 and metadata license was null.
- **Quality/risk:** scenario-oriented personal topic guides with an explicit nonofficial disclaimer; README says prose came from a Notion document. This review did not establish permission to republish that prose or verify the provenance of all question-style material.
- **Decision:** optional **community topic-index link only**, with nonauthoritative label and changing-facts warning. No prose, pocket cards, diagrams, or questions imported.

## Official-source authoring boundary

Use the selected version's AWS exam guide to identify learning objectives, and individual AWS service docs to establish behavior. Write original mechanisms, tradeoffs, failure explanations, and small teaching examples rather than mirroring a source's structure or copying its paragraphs. Cite sources; avoid bulk reproduction of AWS documentation too. AWS names are descriptive references, not claims of affiliation. Copyright/license notices for project dependencies remain separate from this research inventory.

Version-specific exam metadata is recorded in `src/examVersions.ts`; the source inventory for optional UI display is `src/theoryResearch.ts`. The review checklist `/tmp/theory-objectives.md` is an internal coverage aid, not proof that the lessons cover all possible exam content.

## Exam availability source discrepancy

The C03 overview says registration opens December 1, 2026, but the dated [AWS announcement of October 27, 2026](https://aws.amazon.com/blogs/training-and-certification/register-now-updated-developer-associate-and-solutions-architect-professional-exams/) says registration is already open. The [official comparison](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/dva-03-comparison.html) places C03 testing from December 1 and C02 through November 30. Visible metadata therefore states the testing transition, not the conflicting registration-opening claim; confirm appointment availability with AWS.

## Additional explicitly licensed leads

### 5. Adrian Cantrill — public Developer Associate course files

- [Author-published repository](https://github.com/acantril/aws-dev-associate), default branch `main`; [MIT LICENSE](https://github.com/acantril/aws-dev-associate/blob/main/LICENSE) verified through the GitHub license API, with copyright **2020 Adrian Cantrill**.
- Latest reviewed default-branch [commit](https://github.com/acantril/aws-dev-associate/commit/b56742ef6b7c890a5517197860f12819db0e1ba4): **2023-06-08T22:27:33Z**.
- Credibility is stronger for attribution because these are author-published public course files, not a third party claiming ownership of someone else's videos. Nevertheless, the repository is supplementary files rather than a complete current C03 textbook; its content date requires service-fact rechecking.
- Decision: optional supplementary resource/lab link. **No files copied or labs executed.** MIT-covered future reuse would retain copyright and permission notices; this license does not authorize copying separately hosted paid videos or other third-party content. Real labs can incur charges and need separate user authorization.

### 6. lethang7794/awssome — DVA-C02 mind maps

- [Repository](https://github.com/lethang7794/awssome) exists; [MIT LICENSE](https://github.com/lethang7794/awssome/blob/main/LICENSE) verified through the API, copyright **2024 Lê Quang Thắng**.
- Latest reviewed default-branch [commit](https://github.com/lethang7794/awssome/commit/34b1176afe592e7a2e85fdc247f28cfce1cebc68): **2026-11-01T08:16:19Z**. This does not prove all mind maps are current.
- README expressly attributes inputs to paid/free Cantrill courses, official documentation, and other sources. Attribution is useful evidence but not a complete file-level rights audit. Do not assume the wrapper project's license grants rights in all underlying course-derived content.
- Decision: optional, clearly nonofficial visual-study link; **no mind maps, course prose, screenshots, or assets imported**. Future covered reuse would need MIT notices plus provenance review.

### Lead not promoted

A search surfaced `kananinirav/AWS-Developer-Associate-Notes` with a cached MIT badge, but the current public GitHub API returned404 during this check. Its cached page was substantially older. Current availability and license could not be established, so it is not included in the app's resource inventory or used for content.
