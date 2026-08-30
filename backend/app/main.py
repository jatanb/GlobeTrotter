import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
from app.rag_engine import SimpleKnowledgeBase
from app.orchestrator import AIProfessorOrchestrator, TeacherState
from app.utils import generate_speech_file
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Teacher Core Engine API")
kb = SimpleKnowledgeBase()
orchestrator = AIProfessorOrchestrator(api_key=os.getenv("GEMINI_API_KEY", ""))

class InitLessonRequest(BaseModel):
    topic: str
    proficiency: str
    time_limit: int
    language: str
    file_path: Optional[str] = None

class InteractionRequest(BaseModel):
    user_input: str
    current_state: TeacherState

@app.post("/api/lesson/init")
async def init_lesson(payload: InitLessonRequest):
    if payload.file_path:
        kb.process_pdf(payload.file_path)
    
    initial_state = TeacherState(
        current_module=1,
        total_modules=4,
        user_proficiency=payload.proficiency,
        time_limit_minutes=payload.time_limit,
        language=payload.language,
        misconception_counter=0,
        current_topic=payload.topic
    )
    
    # Prompt the system to generate the introductory module
    response_data = orchestrator.run_cycle(
        user_input=f"Let's start learning about {payload.topic}.",
        document_context=kb.get_context(),
        current_state=initial_state.model_dump()
    )
    
    # Pre-render voice track synchronously
    audio_filename = "lesson_speech.mp3"
    await generate_speech_file(response_data.avatar_script, audio_filename, payload.language)
    
    return response_data.model_dump()

@app.post("/api/lesson/interact")
async def interact_lesson(payload: InteractionRequest):
    response_data = orchestrator.run_cycle(
        user_input=payload.user_input,
        document_context=kb.get_context(),
        current_state=payload.current_state.model_dump()
    )
    
    audio_filename = "lesson_speech.mp3"
    await generate_speech_file(response_data.avatar_script, audio_filename, payload.current_state.language)
    
    return response_data.model_dump()

@app.get("/api/media/audio")
async def get_audio_stream():
    audio_path = "lesson_speech.mp3"
    if os.path.exists(audio_path):
        return FileResponse(audio_path, media_type="audio/mp3")
    raise HTTPException(status_code=404, detail="Speech frame buffer empty.")
