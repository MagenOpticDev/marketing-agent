import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateContent } from "@/lib/ai/client";
import type { AIGenerateRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: AIGenerateRequest = await request.json();

    if (!body.content_type || !body.tone || !body.language) {
      return NextResponse.json(
        { error: "Missing required fields: content_type, tone, language" },
        { status: 400 }
      );
    }

    // Fetch product context if product_id provided
    if (body.product_id && !body.product_name) {
      const { data: product } = await supabase
        .from("products")
        .select("name, description, features, marketing_angles, target_customers, missing_fields")
        .eq("id", body.product_id)
        .single();

      if (product) {
        body.product_name = product.name;
        const extra = [
          product.description && `תיאור: ${product.description}`,
          product.features?.length && `יתרונות: ${product.features.join(", ")}`,
          product.marketing_angles?.length && `זוויות שיווק: ${product.marketing_angles.join(", ")}`,
          product.missing_fields?.length && `⚠️ שדות חסרים: ${product.missing_fields.join(", ")} - אל תמציא מידע זה`,
        ]
          .filter(Boolean)
          .join("\n");
        body.additional_context = [body.additional_context, extra]
          .filter(Boolean)
          .join("\n");
      }
    }

    const result = await generateContent(body);

    // Save to database
    const { data: saved, error: saveError } = await supabase
      .from("generated_contents")
      .insert({
        content_type: body.content_type,
        content: result.content,
        language: body.language,
        tone: body.tone,
        product_id: body.product_id || null,
        campaign_id: body.campaign_id || null,
        target_audience: body.target_audience || null,
        prompt_used: result.prompt_used,
        ai_model: result.model_used,
        created_by: user.id,
        status: "draft",
      })
      .select()
      .single();

    if (saveError) {
      console.error("Failed to save content:", saveError);
    }

    return NextResponse.json({ ...result, id: saved?.id });
  } catch (error) {
    console.error("AI generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate content. Check AI API key configuration." },
      { status: 500 }
    );
  }
}
