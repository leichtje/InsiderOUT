from google import genai

'''
Inputs:
- short_desc (string describing the document)
- target_audience (string describing who the document is for)
- severity_level (string describing sensitivity)
- departments (list containing exactly ONE department)

Outputs:
- content (AI?generated document content)
- header (AI?generated header)
- filename (AI?generated filename)
- department (the single department passed in)

Notes:
- This version removes all input() calls.
- All values are now passed in as parameters.
- Departments are no longer hardcoded; caller must pass exactly ONE department.
- All original logic and intent preserved.
'''

def generate_content(short_desc: str, target_audience: str, severity_level: str, departments: list[str]):
    # --- Validate department input ---
    if not isinstance(departments, list) or len(departments) != 1:
        raise ValueError("Exactly one department must be provided.")

    # Extract the single department
    selected_department = departments[0]

    client = genai.Client()

    # --- Generate the main content ---
    content_response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=(
            f"You are an AI generating content for a {short_desc} for {target_audience}. "
            f"Make sure the file doesn't contain any logos, emojis, tables or headers and make it strictly text based. "
            f"Ensure the data is random but does not follow obvious patterns like sequential numbers or repeated values. "
            f"The content should be realistic and relevant to the specified description and audience. "
            f"The content should be tailored to the specified severity level for the given audience. "
            f"The severity level is {severity_level}. "
            f"If the severity level is low, the content should be less sensitive and more generic. "
            f"If the severity level is medium, the content should be moderately sensitive and somewhat specific. "
            f"If the severity level is high, the content should be highly sensitive and very specific."
        ),
    )

    # --- Generate the header ---
    header_response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=(
            f"You are an AI generating a suitable header for the following content: {content_response.text}. "
            f"The header should be concise and relevant with no logos or emojis."
        ),
    )

    # --- Generate the filename ---
    filename_response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=(
            f"You are an AI generating a suitable file name for a document with the following header: {header_response.text} "
            f"and the following content: {content_response.text}. "
            f"The file name should be concise and relevant with no logos or emojis. "
            f"Make sure to add the .docx extension at the end of the file name."
        ),
    )

    # --- Department classification (now fixed to the single provided department) ---
    # The AI no longer chooses a department. It simply returns the one provided.
    department_response_text = selected_department

    # --- Return all generated values ---
    return (
        content_response.text,
        header_response.text,
        filename_response.text,
        department_response_text,
    )


