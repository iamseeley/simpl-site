import { marked } from 'https://deno.land/x/marked/mod.ts';
import { Metadata } from "../types.ts";

const parseMetadata = (content: string): { metadata: Metadata; body: string } => {
  if (!content.startsWith('---')) {
    return { metadata: {}, body: content };
  }
  const parts = content.split('---\n');
  if (parts.length < 3) {
    return { metadata: {}, body: content };
  }
  const metadataLines = parts[1].split('\n').filter(Boolean);
  const metadata = metadataLines.reduce((acc: Record<string, string>, line) => {
    const [key, value] = line.split(':').map(str => str.trim());
    acc[key] = value;
    return acc;
  }, {});
  return { metadata: metadata as Metadata, body: parts.slice(2).join('---\n').trim() };
};

export default class MarkdownProcessor {
  async execute(content: string): Promise<{ metadata: Metadata; content: string }> {
    const { metadata, body } = parseMetadata(content);
    const parsedContent = await marked.parse(body);
    return { metadata, content: parsedContent };
  }
}