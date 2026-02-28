from fpdf import FPDF
import pikepdf
'''
Inputs:
- content (the content to be added to the document)
- header (the header for the document)
- filename (the name of the file to be created)
Outputs:
- A PDF with the content ready for preview. Again need to define folder structure for this still.
'''

# Creating PDF file
def preview_pdf(content, header, filename):
    pdf = FPDF()
    pdf.set_margins(left=15, top=20, right=15)
    pdf.add_page()
    pdf.set_font("Arial", size = 20)

    pdf.cell(0, 10, txt=header, ln=True)
    pdf.set_font("Arial", size = 12)
    pdf.multi_cell(0, 10, txt=content)

    pdf.save(filename)