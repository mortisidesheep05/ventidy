# -*- coding: utf-8 -*-
"""Verification script for token-level fuzzy typo matching in Ventidy AI."""
import sys
from rag_engine import chat

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

test_cases = [
    # --- NORMAL (Must continue working) ---
    ("NORMAL: Services", "What services do you provide?",
     lambda r: "hood cleaning" in r.lower() or "kitchen exhaust" in r.lower()),
    ("NORMAL: Phone", "What is your phone number?",
     lambda r: "9940110079" in r),
    ("NORMAL: Location", "Where are you located?",
     lambda r: "madipakkam" in r.lower() and "chennai" in r.lower()),
    ("NORMAL: Hours", "What are your working hours?",
     lambda r: "monday to friday" in r.lower()),

    # --- WITH TYPOS (Requested by user) ---
    ("TYPO: servies", "What servies do you provide?",
     lambda r: "hood cleaning" in r.lower() or "kitchen exhaust" in r.lower()),
    ("TYPO: servces", "What servces do you provide?",
     lambda r: "hood cleaning" in r.lower() or "kitchen exhaust" in r.lower()),
    ("TYPO: phne", "What is your phne number?",
     lambda r: "9940110079" in r),
    ("TYPO: locaton", "Where is your locaton?",
     lambda r: "madipakkam" in r.lower() and "chennai" in r.lower()),
    ("TYPO: workng hors", "What are your workng hors?",
     lambda r: "monday to friday" in r.lower()),
    ("TYPO: clening", "Tell me about AHU clening",
     lambda r: "air handling" in r.lower() or "coil" in r.lower()),
    ("TYPO: intenatioanl", "intenatioanl",
     lambda r: "only within india" in r.lower()),

    # --- UNRELATED / RANDOM (Must NOT match Ventidy) ---
    ("UNRELATED: Capital of France", "What is the capital of France?",
     lambda r: r == "I don't have that information."),
    ("UNRELATED: Recipe", "How to make pasta?",
     lambda r: r == "I don't have that information."),
    ("UNRELATED: Script", "Write a python script to sort numbers",
     lambda r: r == "I don't have that information."),
    ("UNRELATED: Random letters 1", "asdfghjkl qwerty",
     lambda r: r == "I don't have that information."),
    ("UNRELATED: Random letters 2", "flkjdsf dskjhf",
     lambda r: r == "I don't have that information."),
    ("UNRELATED: English word house", "Where is my house?",
     lambda r: r == "I don't have that information."),
    ("UNRELATED: English word horse", "Tell me about a horse",
     lambda r: r == "I don't have that information.")
]

def run():
    print("--- Running Token-Level Fuzzy Typo Tests ---\n")
    passed = 0
    failed = 0

    for name, query, validator in test_cases:
        res = chat(query, return_dict=True)
        reply = res["reply"]
        cat = res["category"]
        is_ok = validator(reply)

        if is_ok:
            passed += 1
            print(f"[PASS] {name}")
            print(f"       Q: '{query}' -> [{cat}] {reply[:70]}...\n")
        else:
            failed += 1
            print(f"[FAIL] {name}")
            print(f"       Q: '{query}'")
            print(f"       Reply: '{reply}'\n")

    print(f"Results: {passed} passed, {failed} failed out of {len(test_cases)} tests.")
    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    run()
