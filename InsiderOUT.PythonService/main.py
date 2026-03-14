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

class PDFGenerationRequest(BaseModel):
    content: str
    header: str
    fileName: str

class PDFGenerationResponse(BaseModel):
    success: bool

class ImageGenerationRequest(BaseModel):
    pass  # No inputs needed for image generation in current design

class ImageGenerationResponse(BaseModel):
    tokenId: str
    success: bool

class DocumentCreationRequest(BaseModel):
    content: str
    header: str
    fileName: str
    trackingUrl: str #we technically won't need this as this is based on tokenId.
    tokenId: str

class DocumentCreationResponse(BaseModel):
    success: bool

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

# ---------------------------------------------------------
# PDF Generation Endpoint
# ---------------------------------------------------------
@app.post("/generate-pdf", response_model=PDFGenerationResponse)
def api_generate_pdf(req: PDFGenerationRequest):
    # Call the PDF generation logic
    success = preview_pdf(
        req.content,
        req.header,
        req.fileName
    )
    return PDFGenerationResponse(
        success=success
    )
    '''
    Once this happens we have to wait to get approval from the client to move to the image generation step.
    '''

# ---------------------------------------------------------
# Image Generation Endpoint
# ---------------------------------------------------------
@app.post("/generate-image", response_model=ImageGenerationResponse)
def api_generate_image(req: ImageGenerationRequest):
    token_id = create_transparent_pixel_image()
    return ImageGenerationResponse(
        tokenId=token_id,
        success=True
    )

# ---------------------------------------------------------
# Document Creation and Canary Injection Logic
# ---------------------------------------------------------
@app.post("/create-document", response_model=DocumentCreationResponse)
def api_create_document(req: DocumentCreationRequest):
    # Step 1: Create the base Word document
    docx_filename = create_base_docx(
        req.content,
        req.header,
        req.fileName
    )

    # Step 2: Inject the canary XML into the document
    inject_canary_xml(
        docx_filename,
        req.trackingUrl,
        req.tokenId
    )

    return DocumentCreationResponse(
        success=True
    )