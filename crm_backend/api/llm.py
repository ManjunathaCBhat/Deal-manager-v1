# llm.py
import os
from openai import OpenAI

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_SITE_URL = os.getenv("OPENROUTER_SITE_URL", "")
OPENROUTER_SITE_NAME = os.getenv("OPENROUTER_SITE_NAME", "CRM Deal Assistant")

if not OPENROUTER_API_KEY:
    print("WARNING: OPENROUTER_API_KEY is not set. LLM replies will fail.")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)


def generate_reply(user_prompt: str, context_note: str = "") -> str:
    """
    Call OpenRouter (openai/gpt-4o-mini) and return a short conversational reply.

    user_prompt: describe what you want the bot to say in plain English.
    context_note: optional extra context about the situation.
    """
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
                "HTTP-Referer": OPENROUTER_SITE_URL,
                "X-Title": OPENROUTER_SITE_NAME,
            },
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        print("OpenRouter error:", e)
        return "I am having trouble answering right now. Try again in a moment."