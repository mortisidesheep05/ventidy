import urllib.request
import json
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

BASE_URL = "http://127.0.0.1:8000"

def get(path):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=3) as resp:
        return resp.status, json.loads(resp.read().decode("utf-8"))

def post(path, body):
    url = f"{BASE_URL}{path}"
    payload = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=3) as resp:
        return resp.status, json.loads(resp.read().decode("utf-8"))

def main():
    print("Testing live endpoints at", BASE_URL)
    
    # 1. Health check
    status, health = get("/api/health")
    print(f"GET /api/health -> HTTP {status}: {health}")
    assert status == 200
    assert health["online"] is True
    assert health["documents_count"] >= 15
    assert health["status"] == "ok"

    # 2. Chat queries
    test_cases = [
        ("Greeting", "hello", lambda r: "hello" in r.lower() or "help" in r.lower()),
        ("Services", "What services do you provide?", lambda r: "hood cleaning" in r.lower()),
        ("Contact", "How can I contact you?", lambda r: "9940110079" in r),
        ("Phone", "What is your phone number?", lambda r: "9940110079" in r),
        ("Email", "What is your email?", lambda r: "contact@ventidy.com" in r.lower()),
        ("Location", "Where are you located?", lambda r: "madipakkam" in r.lower()),
        ("Working hours", "What are your working hours?", lambda r: "monday to friday" in r.lower()),
        ("Technicians", "How many technicians do you have?", lambda r: "40" in r),
        ("Unknown info", "Who is the CEO of Ventidy?", lambda r: r == "I don't have that information."),
        ("Unrelated question", "What is the capital of France?", lambda r: r == "I don't have that information."),
        # Typo tests over HTTP
        ("Typo: servies", "What servies do you provide?", lambda r: "hood cleaning" in r.lower()),
        ("Typo: phne", "What is your phne number?", lambda r: "9940110079" in r),
        ("Typo: locaton", "Where is your locaton?", lambda r: "madipakkam" in r.lower()),
        ("Typo: workng hors", "What are your workng hors?", lambda r: "monday to friday" in r.lower()),
        ("Typo: clening", "Tell me about AHU clening", lambda r: "air handling" in r.lower() or "coil" in r.lower()),
        ("Typo: intenatioanl", "intenatioanl", lambda r: "only within india" in r.lower())
    ]

    all_passed = True
    for label, query, validator in test_cases:
        status, data = post("/api/chat", {"message": query})
        reply = data.get("reply", "")
        cat = data.get("category", "")
        doc = data.get("document", "")
        is_valid = (status == 200) and validator(reply)
        status_text = "PASS" if is_valid else "FAIL"
        print(f"[{status_text}] {label}: '{query}' -> [{cat}] '{reply[:60]}...'")
        if not is_valid:
            all_passed = False

    if all_passed:
        print("\nAll HTTP endpoint tests passed successfully!")
    else:
        print("\nSome tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
