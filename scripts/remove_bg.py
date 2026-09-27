import os
from PIL import Image, ImageFilter

def perfect_background_removal(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()

    mask = Image.new("L", (width, height), 255)
    mask_pixels = mask.load()

    for x in range(width):
        for y in range(height):
            r, g, b, a = pixels[x, y]
            brightness = (r + g + b) / 3.0
            color_diff = max(abs(r - g), abs(g - b), abs(r - b))

            # If pixel is white / light neutral background (including inside handle loops)
            if brightness > 238 and color_diff < 15:
                mask_pixels[x, y] = 0
            elif brightness > 215 and color_diff < 12:
                # Smooth edge falloff / anti-aliasing
                alpha = max(0, min(255, int((238 - brightness) * (255.0 / 23.0))))
                mask_pixels[x, y] = alpha
            elif brightness > 195 and color_diff < 8 and (y > height * 0.85 or y < height * 0.15 or x < width * 0.1 or x > width * 0.9):
                # Gradient shadows at perimeter / floor contact
                alpha = max(0, min(255, int((215 - brightness) * (255.0 / 20.0))))
                mask_pixels[x, y] = alpha
            else:
                mask_pixels[x, y] = 255

    # 1. Subtle smooth on alpha mask for anti-aliased edge
    mask = mask.filter(ImageFilter.SMOOTH_MORE)
    img.putalpha(mask)

    # 2. Defringe: for pixels near transparent edge, adjust RGB so there's no white fringe halo
    img_data = list(img.getdata())
    cleaned_data = []
    for r, g, b, a in img_data:
        if a == 0:
            cleaned_data.append((0, 0, 0, 0))
        elif a < 250:
            # Defringe - slightly darken semi-transparent edges so they blend seamlessly on dark backgrounds
            factor = a / 255.0
            nr = int(r * factor)
            ng = int(g * factor)
            nb = int(b * factor)
            cleaned_data.append((nr, ng, nb, a))
        else:
            cleaned_data.append((r, g, b, a))

    img.putdata(cleaned_data)

    # 3. Trim transparent borders with padding
    bbox = img.getbbox()
    if bbox:
        pad = 20
        crop_box = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(width, bbox[2] + pad),
            min(height, bbox[3] + pad)
        )
        img = img.crop(crop_box)

    img.save(output_path, "PNG", optimize=True)
    print(f"Perfect Cutout saved: {output_path} (Dimensions: {img.size})")

if __name__ == "__main__":
    base_dir = r"c:\Users\jaygu\Desktop\stageandsteel\public\bags pic"
    img1 = os.path.join(base_dir, "stage amd steel bag 1.jpeg")
    img2 = os.path.join(base_dir, "stage and steel bag 2.jpeg")

    out1_root = r"c:\Users\jaygu\Desktop\stageandsteel\public\bag-front-cutout.png"
    out2_root = r"c:\Users\jaygu\Desktop\stageandsteel\public\bag-back-cutout.png"

    out1_dir = os.path.join(base_dir, "stage-and-steel-bag-front-cutout.png")
    out2_dir = os.path.join(base_dir, "stage-and-steel-bag-back-cutout.png")

    perfect_background_removal(img1, out1_root)
    perfect_background_removal(img2, out2_root)
    perfect_background_removal(img1, out1_dir)
    perfect_background_removal(img2, out2_dir)
