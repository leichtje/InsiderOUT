from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from scripts.gen import generate_content

app = FastAPI()

# ---------------------------------------------------------
# Health Check Endpoint
# ---------------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok"}


# ---------------------------------------------------------
# Request / Response Models
# ---------------------------------------------------------
class GenerateContentRequest(BaseModel):
    shortDescription: str
    targetAudience: str
    severityLevel: str
    departments: list[str]  # must contain exactly ONE department


class GenerateContentResponse(BaseModel):
    content: str
    header: str
    fileName: str
    department: str


# ---------------------------------------------------------
# Generate Content Endpoint
# ---------------------------------------------------------
@app.post("/generate-content", response_model=GenerateContentResponse)
def api_generate_content(req: GenerateContentRequest):

    # Validate department count
    if len(req.departments) != 1:
        raise HTTPException(
            status_code=400,
            detail="Exactly one department must be provided."
        )

    # Call the updated Python script logic
    content, header, filename, department = generate_content(
        req.shortDescription,
        req.targetAudience,
        req.severityLevel,
        req.departments
    )

    # Return the structured response
    return GenerateContentResponse(
        content=content,
        header=header,
        fileName=filename,
        department=department
    )