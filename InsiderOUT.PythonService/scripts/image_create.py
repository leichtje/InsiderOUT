# Created with the help of Gemini AI 2.5 Flash
from PIL import Image
'''
Inputs:
- token_id (which will be the filename of the image)

Outputs:
- A 1x1 pixel transparent PNG image with the filename of the token_id is saved to a temp directory.
Note: As this script is ran on IIS it will have to be saved temporarily and then moved to the Kali Box appropriately. How this is handled is TBD.
'''


def create_transparent_pixel_image(filename):
    """
    Creates a 1x1 pixel transparent PNG image using the Pillow library.
    Args:
        filename (str): The name of the file to save the image to.
    """
    # 1. Define image dimensions and mode (RGBA for transparency)
    width, height = 1, 1
    img = Image.new('RGBA', (width, height))

    # 2. Define the pixel data: (R, G, B, A)
    # R=0, G=0, B=0 (Black), A=0 (Fully Transparent)
    transparent_pixel = (0, 0, 0, 0)

    # 3. Set the single pixel's color
    img.putpixel((0, 0), transparent_pixel)

    # 4. Save the image with the filename of the canary token ID
    img.save(filename, "PNG")

if __name__ == "__main__":
    # This needs to define the filepath of image on the Kali Box
    create_transparent_pixel_image("canary_token.png")