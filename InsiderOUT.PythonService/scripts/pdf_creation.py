import os
import shutil
from fpdf import FPDF

temp_dir = r"C:\Users\Administrator\source\repos\leichtje\InsiderOUT\insider_out.client\src\assets\temp"

def preview_pdf(content, header, filename_base):

    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)

    os.makedirs(temp_dir, exist_ok=True)

    pdf_path = os.path.join(temp_dir, f"temp.pdf")

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=14)
    pdf.multi_cell(0, 10, header)
    pdf.ln(10)
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 8, content)

    pdf.output(pdf_path)

    return pdf_path