import pypdf
import io

class SimpleKnowledgeBase:
    def __init__(self):
        self.context_text = ""

    def process_pdf_bytes(self, file_bytes: bytes) -> str:
        """Production standard: Parses raw bytes from RAM instantly."""
        try:
            # Wrap raw bytes in a stream buffer so the PDF reader treats it like a file in memory
            stream = io.BytesIO(file_bytes)
            reader = pypdf.PdfReader(stream)
            extracted_text = []
            
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text.append(text)
                    
            self.context_text = "\n".join(extracted_text)
            return "Success"
        except Exception as e:
            self.context_text = ""
            return f"Error: {str(e)}"

    def get_context(self) -> str:
        return self.context_text
