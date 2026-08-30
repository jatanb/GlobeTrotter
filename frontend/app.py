import streamlit as st
import requests
import os

st.set_page_config(layout="wide", page_title="AI Humanoid Educator Platform")

BACKEND_URL = "http://localhost:8000"

st.title("👨‍🏫 AI Virtual Educator - Adaptive Real-time Lecture Stream")

# Session state initialization matrices
if "state_matrix" not in st.session_state:
    st.session_state.state_matrix = None
if "whiteboard_content" not in st.session_state:
    st.session_state.whiteboard_content = "### Whiteboard Idle\nConfigure settings on the left sidebar to initialize the platform engine loop."
if "script_content" not in st.session_state:
    st.session_state.script_content = ""
if "quiz_active" not in st.session_state:
    st.session_state.quiz_active = False
if "quiz_data" not in st.session_state:
    st.session_state.quiz_data = {}

# Sidebar setup configuration
with st.sidebar:
    st.header("🎯 Target Lesson Configuration")
    topic = st.text_input("Core Topic/Chapter Target", value="Ohm's Law and Circuit Resistance")
    proficiency = st.selectbox("Your Background Level", ["Beginner", "Intermediate", "Advanced"])
    time_limit = st.slider("Target Session Duration Limit (Minutes)", 5, 60, 20)
    language = st.selectbox("Preferred Dialect / Style Profile", ["English", "Hindi", "Hinglish"])
    
    uploaded_file = st.file_uploader("Upload Blueprint Reference Textbooks (Optional PDF)", type=["pdf"])
    
    if st.button("🚀 Initialize Virtual Classroom Engine", use_container_width=True):
        # Save file locally if uploaded
        file_path = None
        if uploaded_file:
            file_path = os.path.join("temp_uploaded.pdf")
            with open(file_path, "wb") as f:
                f.write(uploaded_file.getbuffer())
        
        payload = {
            "topic": topic,
            "proficiency": proficiency,
            "time_limit": time_limit,
            "language": language,
            "file_path": file_path
        }
        
        with st.spinner("Orchestrator constructing custom adaptive modular syllabus..."):
            res = requests.post(f"{BACKEND_URL}/api/lesson/init", json=payload)
            if res.status_code == 200:
                data = res.json()
                st.session_state.state_matrix = data["updated_state"]
                st.session_state.whiteboard_content = data["whiteboard_markdown"]
                st.session_state.script_content = data["avatar_script"]
                st.session_state.quiz_active = data["is_interactive_quiz"]
                if data["is_interactive_quiz"]:
                    st.session_state.quiz_data = {"q": data["quiz_question"], "opts": data["quiz_options"]}
                st.success("Virtual Environment Synchronized!")
            else:
                st.error("Engine failure connecting to cloud intelligence server pipeline.")

# Main Interactive Split Dashboard Screen Execution Layout
col1, col2 = st.columns([1, 1.2])

with col1:
    st.subheader("🤖 Humanoid AI Professor Frame")
    
    # The Hackathon Illusion: Animated, talking-sync SVG engine base
    avatar_html = """
    <div style="background-color:#1E1E24; border-radius:15px; padding:40px; text-align:center; border: 2px solid #3A3A43;">
        <svg width="150" height="150" viewBox="0 0 100 100" xmlns="http://w3.org">
            <circle cx="50" cy="35" r="20" fill="#4A90E2"/>
            <path d="M20 80C20 60 35 55 50 55C65 55 80 60 80 80" fill="#4A90E2"/>
            <!-- Pulsing voice mouth simulation vector active -->
            <ellipse cx="50" cy="42" rx="8" ry="4" fill="#FFFFFF">
                <animate attributeName="ry" values="1;5;1" dur="0.6s" repeatCount="indefinite" />
            </ellipse>
        </svg>
        <h4 style="color:#FFFFFF; margin-top:15px;">Professor Gemini (Active Speaking Mode)</h4>
    </div>
    """
    st.components.v1.html(avatar_html, height=240)
    
    # Audio Stream Interface component binding
    if st.session_state.state_matrix:
        st.audio(f"{BACKEND_URL}/api/media/audio", format="audio/mp3", autoplay=True)
    
    st.info(f"🗣️ **Transcript Subtitles:** {st.session_state.script_content}")

with col2:
    st.subheader("📝 Dynamic Live Interactive Whiteboard")
    st.markdown(st.session_state.whiteboard_content)
    
    if st.session_state.quiz_active:
        st.write("---")
        st.warning(f"🤔 **Question:** {st.session_state.quiz_data['q']}")
        
        # Checking option structures
        if st.session_state.quiz_data['opts']:
            chosen_opt = st.radio("Select your verification answer:", st.session_state.quiz_data['opts'])
            user_msg = chosen_opt
        else:
            user_msg = st.text_input("Type your analytical reasoning answer:")
            
        if st.button("Submit Answer to Teacher Evaluation Loop"):
            interaction_payload = {
                "user_input": user_msg,
                "current_state": st.session_state.state_matrix
            }
            with st.spinner("Professor evaluating response details..."):
                res = requests.post(f"{BACKEND_URL}/api/lesson/interact", json=interaction_payload)
                if res.status_code == 200:
                    data = res.json()
                    st.session_state.state_matrix = data["updated_state"]
                    st.session_state.whiteboard_content = data["whiteboard_markdown"]
                    st.session_state.script_content = data["avatar_script"]
                    st.session_state.quiz_active = data["is_interactive_quiz"]
                    if data["is_interactive_quiz"]:
                        st.session_state.quiz_data = {"q": data["quiz_question"], "opts": data["quiz_options"]}
                    st.rerun()
    
    elif st.session_state.state_matrix:
        # Standard continuation mechanism text interface input loop
        st.write("---")
        student_query = st.text_input("Ask a follow-up question or type 'Next' to continue:")
        if st.button("Send Interaction Command") and student_query:
            interaction_payload = {
                "user_input": student_query,
                "current_state": st.session_state.state_matrix
            }
            with st.spinner("Processing next tutorial step..."):
                res = requests.post(f"{BACKEND_URL}/api/lesson/interact", json=interaction_payload)
                if res.status_code == 200:
                    data = res.json()
                    st.session_state.state_matrix = data["updated_state"]
                    st.session_state.whiteboard_content = data["whiteboard_markdown"]
                    st.session_state.script_content = data["avatar_script"]
                    st.session_state.quiz_active = data["is_interactive_quiz"]
                    if data["is_interactive_quiz"]:
                        st.session_state.quiz_data = {"q": data["quiz_question"], "opts": data["quiz_options"]}
                    st.rerun()
