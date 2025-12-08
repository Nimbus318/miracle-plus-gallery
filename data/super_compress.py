import os
from PIL import Image

IMAGES_DIR = "public/images/projects"
MAX_WIDTH = 800  # Reduce from 1200 -> 800 (Sufficient for cards & detailed view on most screens)
QUALITY = 70     # Reduce from 80 -> 70 (Good balance for web)

def super_compress():
    if not os.path.exists(IMAGES_DIR):
        print(f"Error: Directory {IMAGES_DIR} not found.")
        return

    count = 0
    saved_space = 0
    
    print(f"Starting super compression in {IMAGES_DIR}...")
    print(f"New Settings: Max Width={MAX_WIDTH}px, Quality={QUALITY}")

    for filename in os.listdir(IMAGES_DIR):
        if filename.lower().endswith(('.jpg', '.jpeg')):
            filepath = os.path.join(IMAGES_DIR, filename)
            
            try:
                with Image.open(filepath) as img:
                    original_size = os.path.getsize(filepath)
                    
                    # Force convert to RGB
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    
                    # 1. Resize Logic
                    width, height = img.size
                    should_resize = False
                    
                    if width > MAX_WIDTH:
                        ratio = MAX_WIDTH / width
                        new_height = int(height * ratio)
                        img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
                        should_resize = True
                    
                    # 2. Save with lower quality
                    # Only save if we resized OR if we want to re-compress an existing large file
                    # To be safe and uniform, we re-save everything at Q70
                    
                    img.save(filepath, 'JPEG', quality=QUALITY, optimize=True)

                    new_size = os.path.getsize(filepath)
                    saved = original_size - new_size
                    
                    if saved > 0:
                        saved_space += saved
                        print(f"Compressed {filename}: {original_size/1024:.1f}KB -> {new_size/1024:.1f}KB (Saved {saved/1024:.1f}KB)")
                        count += 1

            except Exception as e:
                print(f"Error processing {filename}: {e}")

    print(f"\nFinished! Compressed {count} images.")
    print(f"Total space saved: {saved_space/1024/1024:.2f} MB")

if __name__ == "__main__":
    super_compress()

