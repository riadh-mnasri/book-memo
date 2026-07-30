import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SUMMARY_TOOL = {
  name: "submit_summary",
  description: "Submit a structured book summary.",
  input_schema: {
    type: "object" as const,
    properties: {
      keyIdeas: { type: "array", items: { type: "string" } },
      takeaways: { type: "array", items: { type: "string" } },
      tips: { type: "array", items: { type: "string" } },
      howToApply: { type: "array", items: { type: "string" } },
      themes: {
        type: "array",
        items: { type: "string" },
        description:
          "1 to 3 themes for this book, chosen from: business, personalDev, psychology, finance, techDev, productivity, leadership, health, philosophy, creativity, other.",
      },
    },
    required: ["keyIdeas", "takeaways", "tips", "howToApply", "themes"],
  },
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 501 },
    );
  }

  const { title, author, locale } = await request.json();
  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Missing title" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });
  const language = locale === "en" ? "English" : "French";

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1500,
      tools: [SUMMARY_TOOL],
      tool_choice: { type: "tool", name: "submit_summary" },
      messages: [
        {
          role: "user",
          content: `Write a book summary for personal notes about "${title}"${
            author ? ` by ${author}` : ""
          }, in ${language}.
Provide, as short bullet-point style sentences (4 to 6 items per list):
- keyIdeas: the book's core concepts
- takeaways: the essential points to remember
- tips: concrete, actionable advice from the book
- howToApply: concrete actions to put the book into practice in daily life
Also suggest 1 to 3 themes from the given list.
Base this on your general knowledge of the book. If you don't know this book well, say so honestly within the content of the fields rather than inventing details.`,
        },
      ],
    });

    const toolUse = message.content.find((block) => block.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json({ error: "No summary generated" }, { status: 502 });
    }

    return NextResponse.json(toolUse.input);
  } catch {
    return NextResponse.json({ error: "Generation failed" }, { status: 502 });
  }
}
