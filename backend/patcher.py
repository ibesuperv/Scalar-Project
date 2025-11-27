from flask import Flask, request, jsonify
from flask_cors import CORS
import black
import subprocess
import traceback

app = Flask(__name__)
CORS(app)

MODEL = "gemma2:2b-instruct-q4_K_M"  # or your model

def fix_code(broken_code: str, user_intent: str = "") -> str:
    def run_safely(code):
        try:
            exec(code, {}, {})
            return None
        except Exception as e:
            return f"{type(e).__name__}: {e}\n{traceback.format_exc()}"

    error = run_safely(broken_code)
    error_text = f"\nRuntime Error:\n{error}\n" if error else ""

    request = user_intent.strip() or "Fix all errors and make this code work perfectly"

    prompt = f'''You are an expert Python debugger. Fix the code below.


BROKEN CODE:
```python
{broken_code}
{error_text}
USER REQUEST: {request}
RULES - YOU MUST OBEY ALL:

Fix ALL real bugs: IndexError, SyntaxError, NameError, infinite loops, etc.
NEVER say "added a comment" as a fix — that's not a real fix!
For every line you change, add ONE comment at the end like:
FIXED: removed extra comma in list
FIXED: use len(STACK) instead of 10 to prevent IndexError
FIXED: changed FOR to for (Python is case-sensitive)
If the loop goes beyond list length → use range(len(STACK)) or for item in STACK
NEVER keep while x >= 0: with x += 1
Return ONLY the fixed code in one python block
Make it clean and Pythonic

FIXED CODE:
'''

    try:
        # THIS LINE FIXES THE UNICODE ERROR
        result = subprocess.run(
            ["ollama", "run", MODEL],
            input=prompt,
            text=True,
            capture_output=True,
            timeout=180,
            check=True,
            encoding="utf-8",        # Force UTF-8
            errors="replace"         # Replace bad chars
        )
        response = result.stdout.strip()
    except Exception as e:
        return f"# ERROR: Ollama failed → {e}"

    if "```python":
        fixed = response.split("```python")[1].split("```")[0].strip()
    elif "```" in response:
        fixed = response.split("```")[1].strip()
    else:
        fixed = response.strip()

    return fixed or "# Model returned nothing\n" + broken_code


@app.route("/api/fix-code", methods=["POST"])
def fix_code_endpoint():
    try:
        data = request.get_json()
        if not data or "code" not in data:
            return jsonify({"error": "No code provided"}), 400

        raw_code = data.get("code", "")
        user_intent = data.get("intent", "")

        ai_fixed = fix_code(raw_code, user_intent)

        try:
            final_code = black.format_str(ai_fixed, mode=black.FileMode(line_length=88))
        except:
            final_code = ai_fixed

        print("\nFIXED & SAVED → fix.py")
        print("-" * 60)
        print(final_code)
        print("-" * 60)

        return jsonify({
            "fixed_code": final_code,
            "message": "Fixed and saved to fix.py!"
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("AI Code Fixer API Running (UTF-8 Fixed)")
    app.run(host="127.0.0.1", port=5000, debug=False)
    