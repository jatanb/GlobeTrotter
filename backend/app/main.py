import os
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
import json
import io
from app.rag_engine import SimpleKnowledgeBase
from app.orchestrator import AIProfessorOrchestrator, TeacherState
from app.utils import generate_speech_file
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Production AI Teacher Core Engine")
kb = SimpleKnowledgeBase()
orchestrator = AIProfessorOrchestrator(api_key=os.getenv("GEMINI_API_KEY", ""))

@app.post("/api/lesson/init")
async def init_lesson(
    # Real-world apps receive form parameters + binary files together via HTTP multipart
    topic: str = Form(...),
    proficiency: str = Form(...),
    time_limit: int = Form(...),
    language: str = Form(...),
    file: UploadFile = File(None) 
):
    # If a file exists, stream it straight out of memory buffer RAM
    if file:
        try:
            file_bytes = await file.read()
            # Feed the raw byte array directly into memory parser without saving onto disk
            kb.process_pdf_bytes(file_bytes)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to process in-memory stream: {str(e)}")
    
    initial_state = TeacherState(
        current_module=1,
        total_modules=4,
        user_proficiency=proficiency,
        time_limit_minutes=time_limit,
        language=language,
        misconception_counter=0,
        current_topic=topic
    )
    
    response_data = orchestrator.run_cycle(
        user_input=f"Let's start learning about {topic}.",
        document_context=kb.get_context(),
        current_state=initial_state.model_dump()
    )
    
    audio_filename = "lesson_speech.mp3"
    await generate_speech_file(response_data.avatar_script, audio_filename, language)
    
    return response_data.model_dump()

@app.post("/api/lesson/interact")
async def interact_lesson(payload: InteractionRequest):
    # (Kept identical to previous interactive loop state steps)
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
    raise HTTPException(status_code=404, detail="Audio buffer empty.")
