from google import genai
'''
Inputs:
- Short Description
- Target Audience
- Severity Level (Low, Medium, High)

Outputs:
- Content for the document
- A suitable header for the document
- A suitable file name for the document
- A targeted department for the document (This is important for comparing the user's dept with the documents)
'''
#--------Content Creation----------------
def generate_content():
        # TEMPORARY USER INPUT. FOR DEMO
        short_desc = input("Enter a short description of the document to be created (e.g., 'hr document containing payroll for finance team members'): ")
        target_audience = input("Enter the target audience for the document (e.g., 'finance team members'): ")
        severity_level = input("Enter the severity level for the document (Low, Medium, High): ")
        # The client gets the API key from the environment variable `GEMINI_API_KEY`.
        client = genai.Client()

        # Generate the content for the document based on the short description and target audience
        content_response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"You are an AI generating content for a {short_desc} for {target_audience}, make sure the file doesn't contain any logos, emojis, tables or header and make it strictly text based. Ensure the data is random but does not follow obvious patterns like sequential numbers or repeated values. The content should be realistic and relevant to the specified description and audience. The content should be tailored to the specifed severity level for the given audience. The severity level is {severity_level}. If the severity level is low, the content should be less sensitive and more generic. If the severity level is medium, the content should be moderately sensitive and somewhat specific. If the severity level is high, the content should be highly sensitive and very specific.",
        )

        # Generate a suitable header for the document based on the content
        header_response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"You are an AI generating a suitable header for the following content: {content_response.text}. The header should be concise and relevant with no logos, or emojis, strictly have it word based.",
        )

        # Generate a suitable file name for the document based on the header and content
        filename_response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"You are an AI generating a suitable file name for a document with the following header: {header_response.text} and the following content: {content_response.text}. The file name should be concise and relevant with no logos, or emojis, strictly have it word based. Make sure to add the .docx extension at the end of the file name.",
        )

        # Generates a targeted Department based on the content
        department_response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"You are an enterprise document classification assistant. Your task is to analyze the content of the document and determine its primary target department from the provided list. Rules: Choose ONLY one department from the list. Base your decision on the document's intent, terminology, and audience. If the document applies to multiple departments, choose the most relevant primary audience. Target Departments: HR, IT, Compliance, Finance, Engineering, Accounting, Audit, Executive, Sales, Marketing. The content of the document is as follows: {content_response.text}",
        )

        return content_response.text, header_response.text, filename_response.text, department_response.text
#--------End Content Creation--------------



