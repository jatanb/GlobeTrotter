import os
import asyncio
from cartesia import Cartesia
from dotenv import load_dotenv
import edge_tts

load_dotenv()

CARTESIA_API_KEY = os.getenv("CARTESIA_API_KEY")
client = Cartesia(api_key=CARTESIA_API_KEY) if CARTESIA_API_KEY else None

def split_text_into_chunks(text: str, max_chars: int = 200) -> list:
    """Helper function to split long scripts by sentence to prevent Cartesia 41-sec truncation limits."""
    sentences = text.split(". ")
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) < max_chars:
            current_chunk += sentence + ". "
        else:
            if current_chunk: chunks.append(current_chunk.strip())
            current_chunk = sentence + ". "
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks

async def generate_speech_file(text: str, output_path: str, language_style: str = "English"):
    """
    Generates full-length audio via Cartesia chunks. 
    Maintains clean fallbacks if credits fail.
    """
    clean_text = text.replace("**", "").replace("#", "").strip()
    language_lower = language_style.lower()

    if client:
        try:
            # Select premium voices optimized for multilingual pronunciation
            if language_lower in ["hindi", "hinglish"]:
                voice_id = "e0176882-9988-4df7-873b-e10b144fb078" # Multi-lingual Indian Accent Profile
                model_id = "sonic-multilingual"
            else:
                voice_id = "a0e9987f-9111-4775-8167-27945cf45a12" # Crisp English Teacher Profile
                model_id = "sonic"

            # Split text to safely bypass API buffer constraints
            text_chunks = split_text_into_chunks(clean_text, max_chars=250)
            combined_audio_bytes = b""

            for chunk in text_chunks:
                if not chunk: continue
                response = client.tts.bytes(
                    model_id=model_id,
                    transcript=chunk,
                    voice_id=voice_id,
                    output_format={"container": "mp3", "sample_rate": 24000}
                )
                combined_audio_bytes += response

            # Write full, uncapped audio byte data to file
            with open(output_path, "wb") as f:
                f.write(combined_audio_bytes)
            return

        except Exception as e:
            print(f"[Warning] Cartesia chunk streaming failed, reverting to backup engine: {e}")

    # Fallback to Edge-TTS if Cartesia key is empty or hits rate-limits
    if language_lower in ["hindi", "hinglish"]:
        voice_profile = "hi-IN-MadhuramNeural" 
    else:
        voice_profile = "en-IN-NeerjaNeural"

    communicate = edge_tts.Communicate(clean_text, voice_profile)
    await communicate.save(output_path)
