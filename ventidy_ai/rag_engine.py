# -*- coding: utf-8 -*-
"""Ventidy AI - Lightweight Production RAG Engine

A fast, dependency-free retrieval engine for Ventidy Solutions.
Replaces heavy ML models (PyTorch, Transformers, SentenceTransformers, ChromaDB)
with a deterministic, structured JSON knowledge base, phrase/keyword matching,
fuzzy sequence matching, and strict fallback guardrails.

Supports optional external LLM integration via VENTIDY_LLM_API_KEY.
"""

import os
import sys
import re
import json
import difflib
from typing import Dict, Any, Optional, Tuple, List

try:
    from rapidfuzz import fuzz, process
    RAPIDFUZZ_AVAILABLE = True
except ImportError:
    RAPIDFUZZ_AVAILABLE = False

# Configure UTF-8 for console output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Determine path to knowledge.json
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
KNOWLEDGE_FILE = os.path.join(CURRENT_DIR, "knowledge.json")

# ============================================================
# 1. KNOWLEDGE BASE LOADER
# ============================================================
def load_knowledge_base() -> Dict[str, Any]:
    """Load knowledge base from JSON file with safe fallback."""
    if os.path.exists(KNOWLEDGE_FILE):
        try:
            with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[Ventidy AI] Warning: Failed to read {KNOWLEDGE_FILE}: {e}")

    # Built-in minimal fallback if knowledge.json is missing
    return {
        "company_name": "Ventidy Solutions",
        "documents": [],
        "greetings": {},
        "typos": {},
        "blocked_company_topics": [
            "ceo", "founder", "owner", "revenue", "net worth", "director"
        ]
    }

KB = load_knowledge_base()
DOCUMENTS: List[Dict[str, Any]] = KB.get("documents", [])
GREETINGS: Dict[str, List[str]] = KB.get("greetings", {})
TYPOS: Dict[str, str] = KB.get("typos", {})
BLOCKED_TOPICS: List[str] = KB.get("blocked_company_topics", [])

def get_knowledge_count() -> int:
    """Return count of knowledge documents for health checks."""
    return len(DOCUMENTS)

# ============================================================
# 2. OPTIONAL EXTERNAL LLM INTEGRATION
# ============================================================
LLM_API_KEY = os.environ.get("VENTIDY_LLM_API_KEY", "").strip()
LLM_BASE_URL = os.environ.get("VENTIDY_LLM_BASE_URL", "https://api.openai.com/v1").rstrip("/")
LLM_MODEL = os.environ.get("VENTIDY_LLM_MODEL", "gpt-4o-mini")

def init_llm():
    """Verify engine and optional external LLM status."""
    print(f"[Ventidy AI] Lightweight RAG engine loaded with {len(DOCUMENTS)} knowledge documents.")
    if LLM_API_KEY:
        print(f"[Ventidy AI] External LLM enabled ({LLM_MODEL} via {LLM_BASE_URL}).")
    else:
        print("[Ventidy AI] Running in zero-cost, local deterministic mode (fastest & 0% hallucination).")

def call_external_llm(query: str, context: str) -> Optional[str]:
    """Call external LLM if configured, strictly bound to context."""
    if not LLM_API_KEY:
        return None

    try:
        import urllib.request

        system_prompt = (
            "You are a helpful customer-support assistant for Ventidy Solutions. "
            "Your job is to answer questions using ONLY the information provided in the context below.\n"
            "RULES:\n"
            "1. Use ONLY the provided context.\n"
            "2. Do NOT use outside knowledge or assume facts.\n"
            "3. If the context does not answer the question, reply exactly: 'I don't have that information.'\n"
            "4. Keep the answer clear, professional, and friendly."
        )

        user_content = f"Context:\n{context}\n\nQuestion:\n{query}"
        payload = json.dumps({
            "model": LLM_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            "temperature": 0.2,
            "max_tokens": 250
        }).encode("utf-8")

        req = urllib.request.Request(
            f"{LLM_BASE_URL}/chat/completions",
            data=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {LLM_API_KEY}"
            },
            method="POST"
        )

        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            answer = res_data["choices"][0]["message"]["content"].strip()
            return answer
    except Exception as e:
        print(f"[Ventidy AI] Notice: External LLM request failed ({e}). Falling back to local response.")
        return None

# ============================================================
# 3. TEXT NORMALIZATION & PREPROCESSING
# ============================================================
def normalize_text(text: str) -> str:
    """Normalize text: lowercase, remove punctuation, collapse whitespace."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s\+]", " ", text)
    return " ".join(text.split())

def tokenize(text: str) -> set:
    """Extract unique words from normalized text."""
    normalized = normalize_text(text)
    return set(normalized.split())

# ============================================================
# 4. INTENT & CASUAL CONVERSATION MATCHING
# ============================================================
def match_casual(query_clean: str) -> Optional[str]:
    """Check for greetings, thanks, and conversational queries."""
    # Check common greeting typos first
    for typo, reply in TYPOS.items():
        # Match as whole word or standalone
        pattern = r"\b" + re.escape(typo) + r"\b"
        if re.search(pattern, query_clean):
            return reply

    q_tokens = tokenize(query_clean)

    # Thanks
    if any(phrase in query_clean for phrase in ["thank you", "thanks", "appreciate it", "thank u"]):
        return "You're welcome! 😊 How can I assist you further with Ventidy Solutions?"

    # How are you
    if any(phrase in query_clean for phrase in ["how are you", "how are you doing", "how are things", "hope you are doing well"]):
        return "I'm doing great, thank you! 😊 How can I help you with Ventidy Solutions today?"

    # Morning
    if any(phrase in query_clean for phrase in ["good morning", "morning"]):
        return "Good morning! ☀️ How can I help you with Ventidy Solutions?"

    # Afternoon
    if any(phrase in query_clean for phrase in ["good afternoon", "afternoon"]):
        return "Good afternoon! ☀️ How can I help you with Ventidy Solutions?"

    # Evening
    if any(phrase in query_clean for phrase in ["good evening", "evening"]):
        return "Good evening! 🌙 How can I help you with Ventidy Solutions?"

    # Standalone hello / hi / hey
    hello_words = {"hi", "hello", "hey", "hii", "heyy", "greetings", "hola"}
    if q_tokens.intersection(hello_words) and len(q_tokens) <= 3:
        return "Hello! 👋 How can I help you with Ventidy Solutions?"

    return None

# ============================================================
# 5. RETRIEVAL & SCORING PIPELINE
# ============================================================
INTERNATIONAL_KEYWORDS = [
    "international", "internationally", "outside india", "outside of india",
    "other countries", "abroad", "global", "foreign", "usa", "dubai", "uk"
]

# Core domain target vocabulary for token-level typo correction
CORE_DOMAIN_VOCABULARY = [
    # Services & Operations
    "services", "service", "cleaning", "degreasing", "laundry",
    "installation", "maintenance", "repair", "exhaust", "hood",
    "coil", "duct", "airflow",
    # Contact Details
    "phone", "contact", "mobile", "telephone", "email",
    # Location & Office
    "location", "address", "office", "madipakkam", "chennai",
    # Operating Hours
    "hours", "working", "business", "timing", "timings",
    "monday", "friday", "saturday", "sunday", "weekend",
    # Team & Coverage
    "technicians", "technician", "coverage",
    # Geographic Scope
    "international", "internationally",
    # Company Name
    "ventidy"
]
CORE_DOMAIN_VOCAB_SET = set(CORE_DOMAIN_VOCABULARY)

def fuzzy_correct_token(token: str) -> str:
    """
    Fuzzily correct a single word token if it is a close typo of a domain keyword.
    Uses RapidFuzz with score_cutoff=82 to accept typos like 'phne', 'hors', 'workng',
    'clening', 'servies', 'locaton', 'intenatioanl', while strictly rejecting distinct words.
    """
    if len(token) < 4:
        return token
    if token in CORE_DOMAIN_VOCAB_SET:
        return token
    if not RAPIDFUZZ_AVAILABLE:
        return token

    match = process.extractOne(token, CORE_DOMAIN_VOCABULARY, scorer=fuzz.ratio, score_cutoff=82)
    if match:
        matched_word, score, _ = match
        # Ensure length difference is reasonable (at most 2 characters)
        if abs(len(token) - len(matched_word)) <= 2:
            return matched_word
    return token

def fuzzy_correct_query(query: str) -> Tuple[str, bool]:
    """
    Fuzzily correct misspelled domain words in a query while preserving punctuation.
    Returns (corrected_query, has_corrections).
    """
    words = query.split()
    corrected_words = []
    has_corrections = False
    for w in words:
        clean = re.sub(r"[^\w]", "", w.lower())
        if clean and len(clean) >= 4:
            corr = fuzzy_correct_token(clean)
            if corr != clean:
                has_corrections = True
                w_corr = re.sub(re.escape(clean), corr, w, flags=re.IGNORECASE)
                corrected_words.append(w_corr)
                continue
        corrected_words.append(w)
    return " ".join(corrected_words), has_corrections

def score_document(query_norm: str, q_tokens: set, doc: Dict[str, Any]) -> float:
    """Compute relevance score between normalized query and a knowledge document."""
    score = 0.0
    doc_id = doc.get("id", "")
    patterns = doc.get("patterns", [])
    keywords = doc.get("keywords", [])
    doc_text_norm = normalize_text(doc.get("document", ""))
    reply_norm = normalize_text(doc.get("reply", ""))

    # 1. Exact phrase / pattern matching (highest confidence)
    for p in patterns:
        p_norm = normalize_text(p)
        if p_norm == query_norm:
            score += 120.0
        elif p_norm in query_norm or query_norm in p_norm:
            score += 70.0
        else:
            # Fuzzy match on pattern (strict threshold to avoid generic prefix overlap)
            similarity = difflib.SequenceMatcher(None, query_norm, p_norm).ratio()
            if similarity >= 0.88:
                score += 60.0

    # 2. Keyword overlap (exact tokens for single words, phrase match for multi-words)
    for k in keywords:
        k_norm = normalize_text(k)
        if " " in k_norm:
            if k_norm in query_norm:
                score += 20.0
        else:
            if k_norm in q_tokens:
                score += 15.0

    # 3. Direct token overlap with document text
    matched_tokens = q_tokens.intersection(set(doc_text_norm.split()))
    # Filter out ultra-common stopwords
    stopwords = {"a", "an", "the", "and", "or", "of", "to", "in", "is", "are", "do", "you", "i", "what", "how", "can", "with", "for", "your", "my", "me", "we", "us", "about"}
    content_matches = matched_tokens - stopwords
    score += len(content_matches) * 5.0

    # 4. Domain-specific intent boosts
    # Contact phone boost
    if doc_id == "ventidy_contact_phone":
        if (
            q_tokens.intersection({"phone", "call", "mobile", "telephone", "cell"})
            or any(p in query_norm for p in ["phone number", "contact number", "mobile number", "call you"])
        ):
            score += 50.0

    # Contact email boost
    elif doc_id == "ventidy_contact_email":
        if (
            q_tokens.intersection({"email", "mail", "gmail", "inbox"})
            or "email address" in query_norm
        ):
            score += 50.0

    # General contact boost
    elif doc_id == "ventidy_contact_general":
        if (
            q_tokens.intersection({"contact", "reach"})
            or any(p in query_norm for p in ["get in touch", "contact info", "contact details"])
        ):
            score += 40.0

    # Location boost (requires location-specific keywords or company inquiry)
    elif doc_id == "ventidy_location_address":
        if (
            q_tokens.intersection({"location", "address", "located", "office", "madipakkam", "chennai"})
            or ("where" in q_tokens and q_tokens.intersection({"you", "your", "ventidy", "based", "situated"}))
            or any(p in query_norm for p in ["where are you", "where is your", "where is ventidy", "office location", "office address", "your location"])
        ):
            score += 45.0

    # Hours boost
    elif doc_id == "ventidy_business_hours":
        if (
            q_tokens.intersection({"hours", "timing", "timings", "open", "close", "closed", "sunday", "saturday", "monday", "friday", "weekend"})
            or any(p in query_norm for p in ["working hours", "business hours", "opening hours"])
        ):
            score += 50.0

    # Technicians count boost
    elif doc_id == "ventidy_team_technicians":
        if (
            q_tokens.intersection({"technician", "technicians", "staff", "workers"})
            or any(p in query_norm for p in ["how many technicians", "how many staff", "team size"])
        ):
            score += 45.0

    # Services list boost
    elif doc_id == "ventidy_services_list":
        if any(phrase in query_norm for phrase in ["what services", "services do you provide", "cleaning services", "services offer", "services", "what do you clean", "list of services"]):
            score += 60.0

    # Specific services boosts
    elif doc_id == "ventidy_service_ahu_fcu":
        if q_tokens.intersection({"ahu", "fcu", "coil"}):
            score += 60.0
    elif doc_id == "ventidy_service_kitchen_exhaust":
        if q_tokens.intersection({"kitchen", "exhaust", "hood", "degreasing"}):
            score += 60.0
    elif doc_id == "ventidy_service_laundry":
        if q_tokens.intersection({"laundry", "dryer", "lint"}):
            score += 60.0
    elif doc_id == "ventidy_service_installation":
        if q_tokens.intersection({"installation", "install", "designing"}):
            score += 60.0
    elif doc_id == "ventidy_service_repair_maintenance":
        if q_tokens.intersection({"repair", "maintenance", "breakdown", "motors"}):
            score += 60.0

    return score

def retrieve_best_document(query: str) -> Tuple[Optional[Dict[str, Any]], float]:
    """Retrieve the single most relevant knowledge base item."""
    query_norm = normalize_text(query)
    q_tokens = tokenize(query_norm)

    if not query_norm or not DOCUMENTS:
        return None, 0.0

    best_doc = None
    best_score = -1.0

    for doc in DOCUMENTS:
        score = score_document(query_norm, q_tokens, doc)
        if score > best_score:
            best_score = score
            best_doc = doc

    return best_doc, best_score

# ============================================================
# 6. MAIN CHAT FUNCTION
# ============================================================
def chat(query: str, return_dict: bool = False):
    """
    Main entry point for processing a user query.
    Returns either a string reply or a dictionary compatible with server.py.
    """
    fallback_reply = "I don't have that information."
    if not query or not query.strip():
        if return_dict:
            return {"reply": fallback_reply, "category": "general", "document": None}
        return fallback_reply

    query_strip = query.strip()
    query_clean = query_strip.lower()
    query_norm = normalize_text(query_strip)
    q_tokens = tokenize(query_strip)

    # --------------------------------------------------
    # Step 1: Casual conversation & greetings
    # --------------------------------------------------
    casual_reply = match_casual(query_clean)
    if casual_reply:
        if return_dict:
            return {"reply": casual_reply, "category": "greeting", "document": None}
        return casual_reply

    # --------------------------------------------------
    # Step 2: Strict guardrail against unknown company topics
    # --------------------------------------------------
    if any(re.search(r"\b" + re.escape(topic) + r"\b", query_clean) for topic in BLOCKED_TOPICS):
        if return_dict:
            return {"reply": fallback_reply, "category": "company", "document": None}
        return fallback_reply

    # --------------------------------------------------
    # Step 3: International / Outside India check
    # --------------------------------------------------
    if any(re.search(r"\b" + re.escape(w) + r"\b", query_clean) for w in INTERNATIONAL_KEYWORDS):
        intl_doc = next((d for d in DOCUMENTS if d.get("id") == "ventidy_coverage_international"), None)
        intl_reply = (
            "No. Ventidy Solutions currently operates only within India "
            "and does not provide services internationally or outside India."
        )
        if return_dict:
            return {
                "reply": intl_reply,
                "category": "statistics",
                "document": intl_doc.get("document") if intl_doc else None
            }
        return intl_reply

    # --------------------------------------------------
    # Step 4: Knowledge Base Retrieval
    # --------------------------------------------------
    best_doc, score = retrieve_best_document(query_strip)

    # Threshold test:
    # A score of at least 25 indicates genuine relevance to Ventidy knowledge
    RELEVANCE_THRESHOLD = 25.0

    # Step 4b: If no confident exact match, apply token-level fuzzy typo correction
    if not best_doc or score < RELEVANCE_THRESHOLD:
        corrected_query, has_corrections = fuzzy_correct_query(query_strip)
        if has_corrections:
            corrected_clean = corrected_query.lower()
            # Re-check international with corrected query (e.g. 'intenatioanl' -> 'international')
            if any(re.search(r"\b" + re.escape(w) + r"\b", corrected_clean) for w in INTERNATIONAL_KEYWORDS):
                intl_doc = next((d for d in DOCUMENTS if d.get("id") == "ventidy_coverage_international"), None)
                intl_reply = (
                    "No. Ventidy Solutions currently operates only within India "
                    "and does not provide services internationally or outside India."
                )
                if return_dict:
                    return {
                        "reply": intl_reply,
                        "category": "statistics",
                        "document": intl_doc.get("document") if intl_doc else None
                    }
                return intl_reply

            # Re-retrieve with corrected query
            fuzzy_doc, fuzzy_score = retrieve_best_document(corrected_query)
            if fuzzy_doc and fuzzy_score >= RELEVANCE_THRESHOLD:
                best_doc = fuzzy_doc
                score = fuzzy_score
                query_strip = corrected_query

    if not best_doc or score < RELEVANCE_THRESHOLD:
        if return_dict:
            return {"reply": fallback_reply, "category": "unknown", "document": None}
        return fallback_reply

    category = best_doc.get("category", "general")
    doc_text = best_doc.get("document", "")
    template_reply = best_doc.get("reply", doc_text)

    # --------------------------------------------------
    # Step 5: Optional External LLM generation or Local Reply
    # --------------------------------------------------
    final_reply = None
    if LLM_API_KEY:
        final_reply = call_external_llm(query_strip, doc_text)

    if not final_reply:
        final_reply = template_reply

    if return_dict:
        return {
            "reply": final_reply,
            "category": category,
            "document": doc_text
        }
    return final_reply

# ============================================================
# 7. INTERACTIVE CLI LOOP
# ============================================================
if __name__ == "__main__":
    init_llm()
    print("\n" + "=" * 55)
    print("Ventidy AI Lightweight RAG Engine Loaded!")
    print("Type your question below (or 'exit' / 'quit' to end):")
    print("=" * 55 + "\n")

    while True:
        try:
            user_input = input("You: ")
        except (KeyboardInterrupt, EOFError):
            print("\nChat ended.")
            break

        if user_input.lower().strip() in ["exit", "quit"]:
            print("Chat ended.")
            break

        if not user_input.strip():
            continue

        resp = chat(user_input, return_dict=True)
        print(f"Bot [{resp['category']}]: {resp['reply']}\n")
