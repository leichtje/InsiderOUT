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
# STEP 1 — PREVIEW GENERATION
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
# STEP 2 — FINAL DOCUMENT
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







# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from scripts.gen import generate_content
# from scripts.image_create import create_transparent_pixel_image
# from scripts.pdf_creation import preview_pdf
# from scripts.canary_creation import inject_canary_xml, create_base_docx

# app = FastAPI()


# @app.get("/health")
# def health():
#     return {"status": "ok"}


# class GenerateContentRequest(BaseModel):
#     shortDescription: str
#     targetAudience: str
#     severityLevel: str
#     departments: list[str]


# class GenerateContentResponse(BaseModel):
#     content: str
#     header: str
#     fileName: str
#     department: str


# class TrackingImageResponse(BaseModel):
#     tokenId: str
#     fileName: str


# class PreviewPdfRequest(BaseModel):
#     content: str
#     header: str
#     fileName: str


# class PreviewPdfResponse(BaseModel):
#     pdfPath: str


# class InjectCanaryRequest(BaseModel):
#     content: str
#     header: str
#     fileName: str
#     tokenId: str


# class InjectCanaryResponse(BaseModel):
#     fileName: str


# @app.post("/generate-content", response_model=GenerateContentResponse)
# def api_generate_content(req: GenerateContentRequest):

#     if len(req.departments) != 1:
#         raise HTTPException(status_code=400, detail="Exactly one department must be provided.")

#     content, header, filename, department = generate_content(
#         req.shortDescription,
#         req.targetAudience,
#         req.severityLevel,
#         req.departments
#     )

#     return GenerateContentResponse(
#         content=content,
#         header=header,
#         fileName=filename,
#         department=department
#     )


# @app.post("/create-tracking-image", response_model=TrackingImageResponse)
# def api_create_tracking_image():

#     token_id = create_transparent_pixel_image()
#     file_name = f"{token_id}.png"

#     return TrackingImageResponse(tokenId=token_id, fileName=file_name)


# @app.post("/preview-pdf", response_model=PreviewPdfResponse)
# def api_preview_pdf(req: PreviewPdfRequest):

#     pdf_path = preview_pdf(req.content, req.header, req.fileName)

#     if pdf_path is None:
#         raise HTTPException(status_code=500, detail="Failed to generate PDF preview.")

#     return PreviewPdfResponse(pdfPath=pdf_path)


# @app.post("/inject-canary", response_model=InjectCanaryResponse)
# def api_inject_canary(req: InjectCanaryRequest):
#     try:
#         base_docx_path = create_base_docx(req.content, req.header, req.fileName)

#         tracking_url = f"http://192.120.1.124/tokens/{req.tokenId}.png"
#         rel_id = req.tokenId

#         inject_canary_xml(base_docx_path, tracking_url, rel_id)

#         return InjectCanaryResponse(fileName=base_docx_path)

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to inject canary: {e}")