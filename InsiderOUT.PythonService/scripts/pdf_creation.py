from fpdf import FPDF
import os

'''
Inputs:
- content (the content to be added to the document)
- header (the header for the document)
- filename (the name of the file to be created)

Outputs:
- A PDF with the content ready for preview. Again need to define folder structure for this still.
'''

# Creating PDF file
def preview_pdf(content, header, filename, output_dir=None):
    try:
        # Default output directory
        if output_dir is None:
            output_dir = "C:\\temp_tokens\\pdf_preview\\"

        os.makedirs(output_dir, exist_ok=True)

        # Full path to save the PDF
        pdf_path = os.path.join(output_dir, filename)

        pdf = FPDF()
        pdf.set_margins(left=15, top=20, right=15)
        pdf.add_page()
        pdf.set_font("Arial", size=20)

        pdf.cell(0, 10, txt=header, ln=True)
        pdf.set_font("Arial", size=12)
        pdf.multi_cell(0, 10, txt=content)

        # Will be saved under the /src/assets/temp in the client (mapped later)
        pdf.output(pdf_path)

        # Return the filename so the API can return it
        return pdf_path

    except Exception as e:
        return None