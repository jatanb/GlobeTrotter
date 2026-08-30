import json
import google.generativeai as genai
from pydantic import BaseModel
from typing import Optional, List

class TeacherState(BaseModel):
    current_module: int
    total_modules: int
    user_proficiency: str
    time_limit_minutes: int
    language: str
    misconception_counter: int
    current_topic: str

class OrchestrationResponse(BaseModel):
    avatar_script: str
    whiteboard_markdown: str
    visual_type: str
    is_interactive_quiz: bool
    quiz_question: Optional[str] = None
    quiz_options: Optional[List[str]] = None
    updated_state: TeacherState

class AIProfessorOrchestrator:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-3.5-flash')

    def run_cycle(self, user_input: str, document_context: str, current_state: dict) -> OrchestrationResponse:
        # Calculate strict session timing constraint
        total_time = current_state.get("time_limit_minutes", 20)
        current_mod = current_state.get("current_module", 1)
        total_mods = current_state.get("total_modules", 4)
        target_lang = current_state.get("language", "English").lower()
        
        # Enforce short structural content if time budget is tight
        time_per_module = total_time / total_mods
        word_limit = 100 if time_per_module <= 5 else 250

        # Hardcoded Language Enforcement Instruction Block
        language_rule = ""
        if target_lang == "hindi":
            language_rule = "CRITICAL: You MUST write the 'avatar_script' completely in the Hindi language using Devanagari script (हिंदी)."
        elif target_lang == "hinglish":
            language_rule = "CRITICAL: You MUST write the 'avatar_script' in Hinglish. Use English for technical nouns (e.g., 'Resistance', 'Voltage') but write all structural framing sentences in conversational Hindi using the Roman script (e.g., 'Aaj hum padhenge...', 'Agar aap isko increase karenge...')."
        else:
            language_rule = "You MUST write the 'avatar_script' entirely in clean English."

        system_prompt = f"""
        You are an advanced, empathetic Human-Like AI Professor executing a live interactive lesson.
        
        CURRENT LESSON STATE:
        {json.dumps(current_state, indent=2)}

        KNOWLEDGE BASE ENHANCEMENT (RAG Context):
        {document_context[:6000]}

        STUDENT RESPONDED WITH: "{user_input}"

        CRITICAL EXECUTION RULES:
        1. {language_rule} Do not ignore this language rule under any circumstance.
        2. TIME BUDGET CONSTRAINT: The student chose a total lesson time of {total_time} minutes. This module (Module {current_mod} of {total_mods}) must be compact. The 'avatar_script' text MUST NOT exceed {word_limit} words.
        3. Do not deliver a continuous monologue. If 'is_interactive_quiz' is true, immediately populate 'quiz_question' and 'quiz_options'.
        4. Advance the current_module count in updated_state logically as concepts are covered.

        You must respond exclusively in valid JSON matching this schema structure:
        {{
            "avatar_script": "The spoken speech script text strictly complying with the language and word limit rules",
            "whiteboard_markdown": "The markdown code or content to render on the dynamic display board",
            "visual_type": "TEXT" | "EQUATION" | "CODE" | "TIMELINE",
            "is_interactive_quiz": true/false,
            "quiz_question": "Question text or null",
            "quiz_options": ["Option A", "Option B"] or null,
            "updated_state": {{
                "current_module": {current_mod},
                "total_modules": {total_mods},
                "user_proficiency": "{current_state.get('user_proficiency')}",
                "time_limit_minutes": {total_time},
                "language": "{current_state.get('language')}",
                "misconception_counter": {current_state.get('misconception_counter')},
                "current_topic": "{current_state.get('current_topic')}"
            }}
        }}
        """
        
        response = self.model.generate_content(
            system_prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        raw_json = json.loads(response.text)
        return OrchestrationResponse(**raw_json)
