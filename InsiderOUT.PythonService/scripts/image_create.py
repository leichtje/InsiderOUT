# Created with the help of Gemini AI 2.5 Flash
import os
from PIL import Image
import uuid

'''
Inputs:

Outputs:
- A UUID for the canary token is generated and returned. This will be used as the filename for the image and the token ID in the document XML.
- A 1x1 pixel transparent PNG image with the filename of the token_id is saved to a temp directory.
Note: As this script is ran on IIS it will have to be saved temporarily and then moved to the Kali Box appropriately. How this is handled is TBD.
'''


def create_transparent_pixel_image(output_dir=None):
    """
    Creates a 1x1 pixel transparent PNG image using the Pillow library.
    Args:
        output_dir (str): The directory to save the image to. Defaults to C:\temp_tokens\
    """

    # Generate a random ID for the canary token
    token_id = str(uuid.uuid4())

    # Output directory is C:\temp_tokens\
    if output_dir is None:
        output_dir = "C:\\temp_tokens\\"

    os.makedirs(output_dir, exist_ok=True)

    temp_filepath = os.path.join(output_dir, f"{token_id}.png")

    # 1. Define image dimensions and mode (RGBA for transparency)
    width, height = 1, 1
    img = Image.new('RGBA', (width, height))

    # 2. Define the pixel data: (R, G, B, A)
    transparent_pixel = (0, 0, 0, 0)

    # 3. Set the single pixel's color
    img.putpixel((0, 0), transparent_pixel)

    # 4. Save the image
    img.save(temp_filepath, "PNG")

    # Return the token ID (not a set)
    return token_id