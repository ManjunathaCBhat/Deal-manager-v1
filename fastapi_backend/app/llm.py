import os
from openai import OpenAI
from app.config import get_settings


def get_llm_client():
    settings = get_settings()
    if not settings.openrouter_api_key:
        print("WARNING: OPENROUTER_API_KEY is not set. LLM replies will fail.")
        return None
    
    return OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=settings.openrouter_api_key,
    )


def generate_reply(user_prompt: str, context_note: str = "") -> str:
    """
    Call OpenRouter (openai/gpt-4o-mini) and return a short conversational reply.
    """
    settings = get_settings()
    client = get_llm_client()
    
    if client is None:
        return "I am having trouble answering right now. Try again in a moment."
    
    system_content = (
        "You are a helpful CRM assistant inside a web app.\n"
        "You help a sales user create and manage deals.\n"
        "You are inside a step-based flow but the user should not see that.\n"
        "Keep replies short, clear, and conversational.\n"
        "Do not mention prompts, tools, APIs, or OpenRouter.\n"
    )

    if context_note:
        combined = context_note + "\n\n" + user_prompt
    else:
        combined = user_prompt

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_content},
                {"role": "user", "content": combined},
            ],
            temperature=0.6,
            extra_headers={
                "HTTP-Referer": settings.openrouter_site_url,
                "X-Title": settings.openrouter_site_name,
            },
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        print("OpenRouter error:", e)
        return "I am having trouble answering right now. Try again in a moment."
