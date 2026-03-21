from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from scripts.gen import generate_content
from scripts.image_create import create_transparent_pixel_image
from scripts.pdf_creation import preview_pdf
from scripts.final_doc import create_final_doc

app = FastAPI()


@app.get("/health")
def health():
    return {"status": "ok"}


# -----------------------------
# MODELS
# -----------------------------

class GeneratePreviewRequest(BaseModel):
    shortDescription: str
    targetAudience: str
    severityLevel: str
    departments: list[str]


class GeneratePreviewResponse(BaseModel):
    content: str
    header: str
    fileName: str
    tokenId: str


class FinalizeRequest(BaseModel):
    content: str
    header: str
    fileName: str
    tokenId: str


class FinalizeResponse(BaseModel):
    fileName: str


# -----------------------------
# STEP 1 PREVIEW GENERATION
# -----------------------------

@app.post("/generate-preview", response_model=GeneratePreviewResponse)
def api_generate_preview(req: GeneratePreviewRequest):

    if len(req.departments) != 1:
        raise HTTPException(status_code=400, detail="Exactly one department must be provided.")

    # 1. Generate content
    content, header, filename, department = generate_content(
        req.shortDescription,
        req.targetAudience,
        req.severityLevel,
        req.departments
    )

    # 2. Create tracking image
    token_id = create_transparent_pixel_image()

    # 3. Generate PDF preview
    pdf_path = preview_pdf(content, header, filename)

    return GeneratePreviewResponse(
        content=content,
        header=header,
        fileName=filename,
        tokenId=token_id
    )


# -----------------------------
# STEP 2 FINAL DOCUMENT
# -----------------------------

@app.post("/finalize-doc", response_model=FinalizeResponse)
def api_finalize_doc(req: FinalizeRequest):
    try:
        final_file = create_final_doc(
            req.content,
            req.header,
            req.fileName,
            req.tokenId
        )
        return FinalizeResponse(fileName=final_file)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to finalize document: {e}")


