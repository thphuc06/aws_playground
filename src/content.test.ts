import { describe, expect, it } from 'vitest';
import { chapters, glossary, roadmap, sources } from './content';
import { assumptions } from './engine';

describe('curriculum content integrity', () => {
  it('uses unique source, chapter, glossary and per-chapter section IDs', () => {
    const unique = (values: string[]) => expect(new Set(values).size).toBe(values.length);
    unique(sources.map(source => source.id));
    unique(chapters.map(chapter => chapter.id));
    unique(glossary.map(entry => entry.term));
    for (const chapter of chapters) unique(chapter.sections.map(section => section.id));
  });

  it('resolves every section source to a verified official URL', () => {
    const byId = new Map(sources.map(source => [source.id, source]));
    for (const chapter of chapters) {
      for (const section of chapter.sections) {
        expect(section.sourceIds.length).toBeGreaterThan(0);
        for (const id of section.sourceIds) {
          const source = byId.get(id);
          expect(source, `${chapter.id}/${section.id}: missing ${id}`).toBeDefined();
          expect(['docs.aws.amazon.com','kiro.dev']).toContain(new URL(source!.url).hostname);
          expect(source!.verified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
      }
    }
  });

  it('has complete questions with one valid answer and an explanation for each choice', () => {
    for (const chapter of chapters) {
      expect(chapter.checks.length).toBeGreaterThan(0);
      for (const check of chapter.checks) {
        expect(check.options).toHaveLength(4);
        expect(check.explanations).toHaveLength(check.options.length);
        expect(Number.isInteger(check.answer)).toBe(true);
        expect(check.answer).toBeGreaterThanOrEqual(0);
        expect(check.answer).toBeLessThan(check.options.length);
        expect(check.explanations[check.answer]).toMatch(/^Correct:/);
        expect(check.explanations.every(explanation => explanation.trim().length > 20)).toBe(true);
      }
    }
  });

  it('provides valid JSON when a snippet is labeled JSON', () => {
    const snippets = chapters.flatMap(chapter => chapter.sections)
      .filter(section => section.language === 'json');
    expect(snippets.length).toBeGreaterThan(0);
    for (const snippet of snippets) {
      expect(() => JSON.parse(snippet.code!)).not.toThrow();
    }
  });

  it('links chapters to implemented missions and distinguishes roadmap coverage', () => {
    for (const chapter of chapters) expect(Object.keys(assumptions)).toContain(chapter.relatedMission);
    expect(chapters.length).toBeGreaterThanOrEqual(20);
    expect(chapters.every(chapter => chapter.sections.length >= 5)).toBe(true);
    expect(roadmap.some(row => row.status.startsWith('Roadmap:'))).toBe(true);
  });
});
