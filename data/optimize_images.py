import os
from PIL import Image
import sys

# 配置
IMAGES_DIR = "public/images/projects"
MAX_WIDTH = 1200
QUALITY = 80

def optimize_images():
    if not os.path.exists(IMAGES_DIR):
        print(f"Error: Directory {IMAGES_DIR} not found.")
        return

    count = 0
    saved_space = 0
    
    print(f"Starting image optimization in {IMAGES_DIR}...")
    print(f"Settings: Max Width={MAX_WIDTH}px, Quality={QUALITY}")

    for filename in os.listdir(IMAGES_DIR):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            filepath = os.path.join(IMAGES_DIR, filename)
            
            try:
                with Image.open(filepath) as img:
                    original_size = os.path.getsize(filepath)
                    
                    # 1. 检查是否需要 Resize
                    width, height = img.size
                    if width > MAX_WIDTH:
                        ratio = MAX_WIDTH / width
                        new_height = int(height * ratio)
                        img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
                        print(f"Resized {filename}: {width}x{height} -> {MAX_WIDTH}x{new_height}")
                    
                    # 2. 转换颜色模式 (PNG若是RGBA且不透明，可转RGB存JPG，但为了简单起见保持原格式，除了将 RGBA PNG 转 RGB JPG 的情况)
                    # 这里我们简单点，保持原扩展名，只做压缩。
                    # 如果是 PNG，尝试用 optimized 保存
                    
                    if filename.lower().endswith('.png'):
                         # PNG 压缩通常效果有限，且 Pillow 保存 PNG 可能会变大如果原图已经优化过。
                         # 只有当宽度很大被 resize 时才值得保存。
                         # 或者我们可以选择将 PNG 转为 JPG (如果不需要透明度)
                         # 简单起见，仅对 resized 的 PNG 或 JPG 进行保存
                         
                         # 为了确保压缩效果，我们统一保存一遍
                         img.save(filepath, optimize=True)
                    else:
                        # JPG/JPEG
                        # 转换模式以防万一 (例如 CMYK)
                        if img.mode != 'RGB':
                            img = img.convert('RGB')
                        
                        img.save(filepath, 'JPEG', quality=QUALITY, optimize=True)

                    new_size = os.path.getsize(filepath)
                    saved = original_size - new_size
                    
                    if saved > 0:
                        saved_space += saved
                        print(f"Optimized {filename}: {original_size/1024:.1f}KB -> {new_size/1024:.1f}KB (Saved {saved/1024:.1f}KB)")
                        count += 1
                    else:
                        # 如果变大了（极少情况，或者原图已经很小），其实应该回滚，但覆盖了就没法回滚了。
                        # Pillow 的默认保存通常比未优化的原图要小。
                        pass

            except Exception as e:
                print(f"Error processing {filename}: {e}")

    print(f"\nFinished! Optimized {count} images.")
    print(f"Total space saved: {saved_space/1024/1024:.2f} MB")

if __name__ == "__main__":
    optimize_images()

