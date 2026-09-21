# -*- coding: utf-8 -*-
"""Ventidy AI - RAG Engine

Adapted from UNNIS_CHATBOT.ipynb (Google Colab)
Supports SentenceTransformers, ChromaDB metadata filtering,
and Qwen CausalLM generation (Qwen/Qwen3-4B-Instruct-2507).
"""

import os
import sys

# Configure UTF-8 for console output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Suppress symlinks warning
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"

import chromadb
from sentence_transformers import SentenceTransformer

# ============================================================
# 1. LLM CONFIGURATION (Qwen/Qwen3-4B-Instruct-2507)
# ============================================================
model_name = "Qwen/Qwen3-4B-Instruct-2507"
tokenizer = None
model = None

def init_llm(name: str = model_name):
    """
    Initialize Qwen CausalLM and tokenizer if requested or available.
    """
    global tokenizer, model

    # Check if explicitly enabled via environment variable
    # (By default on CPU/low-RAM systems, LLM loading is opt-in to avoid OOM crash)
    load_env = os.environ.get("VENTIDY_LOAD_LLM", "0")
    if load_env != "1":
        print("[Ventidy AI] Running in fast RAG retrieval mode. (Set VENTIDY_LOAD_LLM=1 to load Qwen HuggingFace model).")
        return

    try:
        from transformers import AutoTokenizer, AutoModelForCausalLM
        import torch

        print(f"[Ventidy AI] Loading causal LLM ({name})...")
        tokenizer = AutoTokenizer.from_pretrained(name)
        device_map = "auto" if torch.cuda.is_available() else "cpu"
        dtype = torch.float16 if torch.cuda.is_available() else torch.float32

        model = AutoModelForCausalLM.from_pretrained(
            name,
            torch_dtype=dtype,
            device_map=device_map
        )
        print("[Ventidy AI] Qwen model loaded successfully!")
    except Exception as e:
        print(f"[Ventidy AI] Notice: Could not load full Qwen LLM ({e}). Falling back to contextual response generator.")
        tokenizer = None
        model = None

# ============================================================
# 2. SENTENCE EMBEDDINGS & CHROMADB
# ============================================================
print("[Ventidy AI] Loading SentenceTransformer embedding model...")
try:
    embedding_model = SentenceTransformer(
        "sentence-transformers/all-MiniLM-L6-v2",
        local_files_only=True
    )
except Exception:
    embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

print("[OK] Embedding model loaded!")

class MyEmbeddingFunction:
    def name(self):
        return "ventidy_minilm"

    def __call__(self, input):
        return embedding_model.encode(input).tolist()

    def embed_query(self, input):
        return embedding_model.encode(input).tolist()

embedding_function = MyEmbeddingFunction()

# Initialize Chroma client
chroma_client = chromadb.Client()

# ============================================================
# 3. KNOWLEDGE BASE DOCUMENTS & METADATA
# ============================================================
better_documents = [
    """Ventidy Solutions is a commercial duct cleaning and maintenance company
based in Chennai, Tamil Nadu. The company serves commercial industries across
India, including hospitality and manufacturing.""",

    """Ventidy Solutions provides several specialized services including
Hood Cleaning, Kitchen Exhaust Duct Cleaning and Degreasing, Laundry Duct
Cleaning, AHU Coil Cleaning, and FCU Coil Cleaning.""",

    """Commercial Kitchen Exhaust Cleaning removes grease, grime, and debris
from exhaust systems. It helps create a safer and healthier environment,
reduces fire risks, and improves airflow.""",

    """AHU Coil Cleaning improves the efficiency and performance of air
handling units. It can improve indoor air quality, reduce energy consumption,
and help extend equipment lifespan.""",

    """Duct Installation involves designing and installing duct systems
according to specific requirements. It aims to provide efficient airflow,
reduce energy losses, and comply with industry standards.""",

    """Repair and Maintenance services help prevent costly breakdowns,
optimize system performance, and extend the lifespan of duct systems, motors,
and other electrical parts.""",

    """Ventidy Solutions has more than 40 trained and experienced technicians
and provides service coverage across India.""",

    """Ventidy Solutions currently operates only within India and does not
provide services internationally or outside India.""",

    """Ventidy Solutions provides high-quality services at affordable costs
while focusing on care, commitment, expertise, and a customer-centric
approach.""",

    """Ventidy Solutions has 5+ specialized services and maintains a
100% commitment to quality.""",

    """Ventidy Solutions is located at No:4B Erikkarai Street, Ramamurthi
Nagar Main Road, Madipakkam, Chennai 600091.""",

    """Ventidy Solutions can be contacted by phone at +91 9940110079.""",

    """The Ventidy Solutions contact email is Contact@ventidy.com.""",

    """Ventidy Solutions business hours are Monday to Friday, 09:00 AM to
05:00 PM. The company is closed on Saturday and Sunday.""",

    """Customers can contact Ventidy Solutions with questions or requests for
customized cleaning solutions. Specialists can help customers find a suitable
solution."""
]

metadata = [
    {"category": "company"},       # 1
    {"category": "service"},       # 2
    {"category": "service"},       # 3
    {"category": "service"},       # 4
    {"category": "service"},       # 5
    {"category": "service"},       # 6
    {"category": "statistics"},    # 7
    {"category": "statistics"},    # 8 ← India only / not international
    {"category": "company"},       # 9
    {"category": "statistics"},    # 10
    {"category": "location"},      # 11
    {"category": "contact"},       # 12
    {"category": "contact"},       # 13
    {"category": "hours"},         # 14
    {"category": "contact"},       # 15
]

# Create collection
metadata_collection = chroma_client.get_or_create_collection(
    name="ventidy_knowledge_v5",
    embedding_function=embedding_function
)

if metadata_collection.count() == 0:
    metadata_ids = [f"ventidy_v5_{i}" for i in range(len(better_documents))]
    metadata_collection.add(
        documents=better_documents,
        ids=metadata_ids,
        metadatas=metadata
    )
    print(f"[OK] Documents and metadata added! Documents stored: {metadata_collection.count()}")

# ============================================================
# 4. CASUAL CONVERSATION & SEMANTIC EMBEDDINGS
# ============================================================
typo_greetings = {
    "morming": "Good morning! ☀️ How can I help you with Ventidy Solutions?",
    "morningg": "Good morning! ☀️ How can I help you with Ventidy Solutions?",
    "afternon": "Good afternoon! ☀️ How can I help you with Ventidy Solutions?",
    "evenng": "Good evening! 🌙 How can I help you with Ventidy Solutions?",
    "helo": "Hello! 👋 How can I help you with Ventidy Solutions?"
}

casual_examples = {
    "hello": [
        "hi",
        "hello",
        "hey",
        "hii",
        "hey there",
        "hello there"
    ],
    "good_morning": [
        "good morning",
        "a very good morning",
        "very good morning",
        "have a good morning",
        "wishing you a good morning",
        "hope you have a good morning"
    ],
    "good_afternoon": [
        "good afternoon",
        "a very good afternoon",
        "very good afternoon",
        "have a good afternoon",
        "wishing you a good afternoon",
        "hope you have a good afternoon"
    ],
    "good_evening": [
        "good evening",
        "a very good evening",
        "very good evening",
        "have a good evening",
        "wishing you a good evening",
        "hope you have a good evening"
    ],
    "how_are_you": [
        "how are you",
        "how are you doing",
        "how are things",
        "how are you today",
        "how are you doing today",
        "hope you are doing well"
    ],
    "thanks": [
        "thanks",
        "thank you",
        "thanks a lot",
        "thank you very much",
        "I appreciate it"
    ]
}

# Pre-compute casual embeddings for fast semantic matching
casual_embeddings = {
    intent: embedding_model.encode(examples)
    for intent, examples in casual_examples.items()
}

international_keywords = [
    "international",
    "internationally",
    "outside india",
    "outside of india",
    "other countries",
    "abroad",
    "global",
    "outside the country"
]

category_keywords = {
    "service": [
        "service",
        "services",
        "cleaning",
        "installation",
        "maintenance",
        "repair",
        "duct",
        "ahu",
        "fcu",
        "hood"
    ],
    "location": [
        "where",
        "location",
        "address",
        "located"
    ],
    "contact": [
        "contact",
        "phone",
        "number",
        "email",
        "mail",
        "reach"
    ],
    "hours": [
        "hours",
        "timing",
        "open",
        "closed",
        "sunday",
        "monday",
        "saturday",
        "working"
    ],
    "statistics": [
        "technicians",
        "technician",
        "india",
        "pan india",
        "coverage",
        "how many",
        "international",
        "internationally",
        "outside india",
        "outside",
        "other countries",
        "abroad",
        "global"
    ],
    "company": [
        "company",
        "about",
        "who"
    ]
}

category_thresholds = {
    "service": 0.75,
    "location": 0.85,
    "contact": 0.60,
    "hours": 0.65,
    "statistics": 0.70,
    "company": 0.75
}

# ============================================================
# 5. CATEGORY DETECTION & RELEVANCE
# ============================================================
def detect_category(query):
    query = query.lower()

    # Contact
    if any(word in query for word in [
        "contact", "phone", "number", "email",
        "mail", "reach"
    ]):
        return "contact"

    # Hours
    if any(word in query for word in [
        "hours", "timing", "open", "closed",
        "working hours", "business hours",
        "sunday", "monday", "saturday"
    ]):
        return "hours"

    # Location
    if any(word in query for word in [
        "where", "location", "address", "located"
    ]):
        return "location"

    # Statistics / coverage
    if any(word in query for word in [
      "technician",
      "across india",
      "pan india",
      "coverage",
      "india",
      "how many",
      "international",
      "internationally",
      "outside india",
      "outside",
      "other countries",
      "abroad",
      "global"
    ]):
        return "statistics"

    # Services
    if any(word in query for word in [
        "service", "services",
        "cleaning", "installation",
        "maintenance", "repair",
        "duct", "ahu", "fcu", "hood"
    ]):
        return "service"

    return "company"

def is_relevant(query, document, distance, category):
    query = query.lower()
    document = document.lower()

    keywords = category_keywords.get(category, [])

    # Find keywords that appear in both the question and document
    matched_keywords = [
        word for word in keywords
        if word in query and word in document
    ]

    # If at least one meaningful keyword matches,
    # allow the document even when the embedding distance is high
    if len(matched_keywords) >= 1:
        return True

    # Otherwise use the normal distance threshold
    threshold = category_thresholds.get(category, 0.75)

    return distance <= threshold

def build_rag_prompt(query, context):
    prompt = f"""
You are a helpful customer-support assistant for Ventidy Solutions.

Your job is to answer questions using ONLY the information provided in the context below.

IMPORTANT RULES:
1. Use only the provided context.
2. Do not use your own general knowledge.
3. Do not invent or assume information.
4. Do not say that Ventidy provides or does not provide something unless the context supports it.
5. If the answer cannot be found in the context, respond exactly:
"I don't have that information."
6. Keep the answer clear, concise, and natural.
7. If the question asks for a list, include all relevant items available in the context.

Context:
{context}

User question:
{query}

Answer:
"""
    return prompt

def format_fallback_answer(query: str, document: str, category: str) -> str:
    """
    Format clean contextual answer adhering strictly to the 7 RAG rules
    when transformer model is not loaded in memory.
    """
    query_lower = query.lower()

    if category == "company":
        if any(w in query_lower for w in ["ceo", "founder", "owner", "revenue", "net worth", "director", "started"]):
            return "I don't have that information."
        return "Ventidy Solutions is a commercial duct cleaning and maintenance company based in Chennai, Tamil Nadu, serving commercial industries across India."

    if category == "contact":
        if any(w in query_lower for w in ["phone", "call", "mobile", "number"]):
            return "You can contact Ventidy Solutions by phone at +91 9940110079."
        elif any(w in query_lower for w in ["email", "mail"]):
            return "The Ventidy Solutions contact email is Contact@ventidy.com."
        else:
            return "You can contact Ventidy Solutions by phone at +91 9940110079 or by email at Contact@ventidy.com."

    if category == "hours":
        return "Ventidy Solutions business hours are Monday to Friday, 09:00 AM to 05:00 PM. The company is closed on Saturday and Sunday."

    if category == "location":
        return "Ventidy Solutions is located at No:4B Erikkarai Street, Ramamurthi Nagar Main Road, Madipakkam, Chennai 600091."

    if category == "statistics":
        if "technician" in query_lower or "how many" in query_lower:
            return "Ventidy Solutions has more than 40 trained and experienced technicians and provides service coverage across India."
        return "Ventidy Solutions provides service coverage across India with more than 40 trained and experienced technicians and 5+ specialized services."

    if category == "service":
        if any(w in query_lower for w in ["all", "what services", "list", "provide"]):
            return (
                "Ventidy Solutions provides several specialized services including:\n"
                "- Hood Cleaning\n"
                "- Kitchen Exhaust Duct Cleaning and Degreasing\n"
                "- Laundry Duct Cleaning\n"
                "- AHU Coil Cleaning\n"
                "- FCU Coil Cleaning\n"
                "- Duct Installation, Repair and Maintenance"
            )

    # Return primary document cleaned
    lines = [line.strip() for line in document.split("\n\n") if line.strip()]
    return " ".join(lines[0].split()) if lines else "I don't have that information."

# ============================================================
# 6. MAIN CHAT FUNCTION
# ============================================================
def chat(query: str, return_dict: bool = False):
    # Clean the question
    query_clean = query.lower().strip()

    # --------------------------------------------------
    # Handle common greeting spelling mistakes
    # --------------------------------------------------
    for typo, response in typo_greetings.items():
        if typo in query_clean:
            if return_dict:
                return {"reply": response, "category": "greeting", "document": None}
            return response

    # --------------------------------------------------
    # Semantic understanding for casual conversation
    # --------------------------------------------------
    query_embedding = embedding_model.encode(query)

    best_intent = None
    best_similarity = -1

    for intent, example_embeddings in casual_embeddings.items():
        similarities = embedding_model.similarity(
            query_embedding,
            example_embeddings
        )
        similarity = similarities.max().item()

        if similarity > best_similarity:
            best_similarity = similarity
            best_intent = intent

    # Handle casual conversation
    if best_similarity >= 0.60:
        reply = None
        if best_intent == "hello":
            reply = "Hello! 👋 How can I help you with Ventidy Solutions?"
        elif best_intent == "good_morning":
            reply = "Good morning! ☀️ How can I help you with Ventidy Solutions?"
        elif best_intent == "good_afternoon":
            reply = "Good afternoon! ☀️ How can I help you with Ventidy Solutions?"
        elif best_intent == "good_evening":
            reply = "Good evening! 🌙 How can I help you with Ventidy Solutions?"
        elif best_intent == "how_are_you":
            reply = "I'm doing great! 😊 How can I help you with Ventidy Solutions?"
        elif best_intent == "thanks":
            reply = "You're welcome! 😊"

        if reply:
            if return_dict:
                return {"reply": reply, "category": "casual", "document": None}
            return reply

    # --------------------------------------------------
    # Special handling: International / India coverage
    # --------------------------------------------------
    if any(keyword in query_clean for keyword in international_keywords):
        intl_reply = (
            "No. Ventidy Solutions currently operates only within India "
            "and does not provide services internationally or outside India."
        )
        if return_dict:
            return {"reply": intl_reply, "category": "statistics", "document": better_documents[7]}
        return intl_reply

    # --------------------------------------------------
    # 1. Detect category
    # --------------------------------------------------
    category = detect_category(query)

    # --------------------------------------------------
    # 2. Retrieve relevant documents from ChromaDB
    # --------------------------------------------------
    results = metadata_collection.query(
        query_texts=[query],
        n_results=5,
        where={"category": category},
        include=[
            "documents",
            "distances",
            "metadatas"
        ]
    )

    if not results["documents"] or not results["documents"][0]:
        no_info = "I don't have that information."
        if return_dict:
            return {"reply": no_info, "category": category, "document": None}
        return no_info

    # --------------------------------------------------
    # 3. Combine retrieved documents
    # --------------------------------------------------
    document = "\n\n".join(results["documents"][0])
    distance = results["distances"][0][0]

    # --------------------------------------------------
    # 4. Check relevance
    # --------------------------------------------------
    relevant = is_relevant(
        query,
        document,
        distance,
        category
    )

    # --------------------------------------------------
    # 5. Reject unrelated questions
    # --------------------------------------------------
    if not relevant:
        no_info = "I don't have that information."
        if return_dict:
            return {"reply": no_info, "category": category, "document": None}
        return no_info

    # --------------------------------------------------
    # 6. Build RAG prompt
    # --------------------------------------------------
    prompt = build_rag_prompt(query, document)

    # --------------------------------------------------
    # 7. Generate with Qwen or Fallback
    # --------------------------------------------------
    if model is not None and tokenizer is not None:
        try:
            messages = [{"role": "user", "content": prompt}]
            text = tokenizer.apply_chat_template(
                messages,
                tokenize=False,
                add_generation_prompt=True
            )
            inputs = tokenizer(text, return_tensors="pt").to(model.device)
            outputs = model.generate(**inputs, max_new_tokens=200)
            response = tokenizer.decode(
                outputs[0][inputs["input_ids"].shape[-1]:],
                skip_special_tokens=True
            ).strip()

            if return_dict:
                return {"reply": response, "category": category, "document": document}
            return response
        except Exception as e:
            print(f"[Ventidy AI] Qwen generation error: {e}")

    # Fallback to direct contextual answer
    response = format_fallback_answer(query, document, category)
    if return_dict:
        return {"reply": response, "category": category, "document": document}
    return response

# ============================================================
# 7. INTERACTIVE LOOP (Colab compatibility)
# ============================================================
if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("Ventidy AI RAG Engine Loaded!")
    print("Type your question below (or 'exit' / 'quit' to end):")
    print("=" * 50 + "\n")

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

        resp = chat(user_input)
        print("Bot:", resp)
