# -*- coding: utf-8 -*-
"""Comprehensive verification test for Ventidy AI Lightweight Engine."""
import sys
from rag_engine import chat, get_knowledge_count

test_queries = [
    # Greetings & Typos
    ("Greeting: hi", "hi", lambda r: "hello" in r.lower() or "help" in r.lower()),
    ("Greeting: hello", "hello", lambda r: "hello" in r.lower() or "help" in r.lower()),
    ("Greeting: good morning", "good morning", lambda r: "morning" in r.lower()),
    ("Greeting typo: morming", "morming", lambda r: "morning" in r.lower()),
    ("Greeting typo: helo", "helo", lambda r: "hello" in r.lower()),

    # Company overview
    ("What is Ventidy", "What is Ventidy?", lambda r: "commercial duct cleaning" in r.lower() and "chennai" in r.lower()),

    # Services
    ("Services list", "What services do you provide?", lambda r: "hood cleaning" in r.lower() and "kitchen exhaust" in r.lower()),
    ("Cleaning services", "What cleaning services do you offer?", lambda r: "hood cleaning" in r.lower() or "specialized services" in r.lower()),
    ("AHU coil", "Tell me about AHU coil cleaning.", lambda r: "air handling" in r.lower() or "coil" in r.lower()),
    ("Kitchen exhaust", "What is kitchen exhaust cleaning?", lambda r: "grease" in r.lower() and "exhaust" in r.lower()),

    # Contact & Phone variations
    ("Contact general", "How can I contact you?", lambda r: "9940110079" in r or "contact@ventidy.com" in r.lower()),
    ("Phone question 1", "What is your phone number?", lambda r: "9940110079" in r),
    ("Phone question 2", "contact number", lambda r: "9940110079" in r),
    ("Phone question 3", "how can I call you", lambda r: "9940110079" in r),
    ("Phone question 4", "give me your mobile number", lambda r: "9940110079" in r),

    # Email
    ("Email question 1", "What is your email?", lambda r: "contact@ventidy.com" in r.lower()),
    ("Email question 2", "What is your email address?", lambda r: "contact@ventidy.com" in r.lower()),

    # Location variations
    ("Location 1", "Where are you located?", lambda r: "madipakkam" in r.lower() and "chennai" in r.lower()),
    ("Location 2", "Where is your office?", lambda r: "madipakkam" in r.lower() and "chennai" in r.lower()),
    ("Location 3", "office location", lambda r: "madipakkam" in r.lower() and "chennai" in r.lower()),
    ("Location 4", "where is Ventidy located", lambda r: "madipakkam" in r.lower() and "chennai" in r.lower()),
    ("Location 5", "what is your location", lambda r: "madipakkam" in r.lower() and "chennai" in r.lower()),

    # Hours
    ("Working hours 1", "What are your working hours?", lambda r: "monday to friday" in r.lower() and "09:00" in r.lower()),
    ("Working hours 2", "Are you open on Sunday?", lambda r: "closed on saturday and sunday" in r.lower()),

    # Technicians & Coverage
    ("Technicians", "How many technicians do you have?", lambda r: "40" in r),
    ("International", "Do you provide services internationally?", lambda r: "only within india" in r.lower()),

    # Guardrails: Unknown company info
    ("Unknown: CEO", "Who is the CEO of Ventidy?", lambda r: r == "I don't have that information."),
    ("Unknown: Revenue", "What is your annual revenue?", lambda r: r == "I don't have that information."),

    # Guardrails: General unrelated questions
    ("Unrelated: Capital of France", "What is the capital of France?", lambda r: r == "I don't have that information."),
    ("Unrelated: Recipe", "How to make pasta?", lambda r: r == "I don't have that information."),
    ("Unrelated: Coding", "Write a python script to sort numbers", lambda r: r == "I don't have that information.")
]

def run_tests():
    print(f"Total knowledge items: {get_knowledge_count()}")
    assert get_knowledge_count() >= 15, "Knowledge base count is less than 15!"

    passed = 0
    failed = 0
    print("\n--- Running Retrieval Engine Verification ---")
    for name, query, validator in test_queries:
        res = chat(query, return_dict=True)
        reply = res["reply"]
        cat = res["category"]
        is_ok = validator(reply)
        status_str = "PASS" if is_ok else "FAIL"
        if is_ok:
            passed += 1
            print(f"[OK] {name}")
            print(f"     Q: '{query}' -> [{cat}] {reply[:80]}...")
        else:
            failed += 1
            print(f"[FAILED] {name}")
            print(f"     Q: '{query}'")
            print(f"     Reply: '{reply}'")

    print(f"\nResults: {passed} passed, {failed} failed out of {len(test_queries)} tests.")
    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
