import pypdf
import os

class SimpleKnowledgeBase:
    def __init__(self):
        self.context_text = ""

    def process_pdf(self, file_path: str) -> str:
        """Extracts text contents cleanly from user uploaded PDF blueprints."""
        if not os.path.exists(file_path):
            return "No custom document provided. Relying on baseline topic knowledge base."
        
        try:
            reader = pypdf.PdfReader(file_path)
            extracted_text = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text.append(text)
            self.context_text = "\n".join(extracted_text)
            return f"Successfully ingested {len(reader.pages)} pages of educational context."
        except Exception as e:
            return f"Error ingestion pipeline failed: {str(e)}"

    def get_context(self) -> str:
        return self.context_text
