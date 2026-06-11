import type { AIGenerateRequest, AIGenerateResponse } from "@/types";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";

type AIMode =
  | "marketing_strategist"
  | "sales_copywriter"
  | "product_expert"
  | "hebrew_editor"
  | "english_supplier_writer"
  | "campaign_planner"
  | "sales_followup";

function getModeForContentType(contentType: string): AIMode {
  const modeMap: Record<string, AIMode> = {
    whatsapp_message: "sales_copywriter",
    email: "sales_copywriter",
    facebook_post: "sales_copywriter",
    linkedin_post: "sales_copywriter",
    product_description: "product_expert",
    sales_pitch: "sales_followup",
    customer_proposal: "sales_copywriter",
    tender_email: "sales_copywriter",
    supplier_email: "english_supplier_writer",
    follow_up: "sales_followup",
    product_launch: "marketing_strategist",
    newsletter: "marketing_strategist",
    landing_page: "sales_copywriter",
    sales_script: "sales_followup",
    objection_response: "sales_followup",
    campaign_idea: "campaign_planner",
    seo_blog_outline: "marketing_strategist",
  };
  return modeMap[contentType] || "sales_copywriter";
}

export async function generateContent(
  req: AIGenerateRequest
): Promise<AIGenerateResponse> {
  const provider = process.env.AI_PROVIDER || "anthropic";
  const model = process.env.AI_MODEL || "claude-sonnet-4-6";
  const mode = getModeForContentType(req.content_type);
  const systemPrompt = buildSystemPrompt(mode);
  const userPrompt = buildUserPrompt(req);

  if (provider === "anthropic") {
    return generateWithAnthropic(systemPrompt, userPrompt, model);
  } else if (provider === "openai") {
    return generateWithOpenAI(systemPrompt, userPrompt, model);
  }

  throw new Error(`Unknown AI provider: ${provider}`);
}

async function generateWithAnthropic(
  systemPrompt: string,
  userPrompt: string,
  model: string
): Promise<AIGenerateResponse> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: model || "claude-sonnet-4-6",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  return {
    content: content.text,
    model_used: message.model,
    prompt_used: userPrompt,
  };
}

async function generateWithOpenAI(
  systemPrompt: string,
  userPrompt: string,
  model: string
): Promise<AIGenerateResponse> {
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.chat.completions.create({
    model: model || "gpt-4o",
    max_tokens: 2048,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const content = response.choices[0]?.message?.content || "";

  return {
    content,
    model_used: response.model,
    prompt_used: userPrompt,
  };
}
