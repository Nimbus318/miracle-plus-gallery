import json
import os
import requests
import time
import random

DATA_DIR = "data"
BATCHES_DIR = os.path.join(DATA_DIR, "batches")
IMAGES_DIR = "public/images/projects"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://mp.weixin.qq.com/",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
}

def download_image(url, save_path):
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return True
        else:
            print(f"Failed to download {url}: Status {response.status_code}")
            return False
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def main():
    if not os.path.exists(BATCHES_DIR):
        print("Batches directory not found!")
        return

    if not os.path.exists(IMAGES_DIR):
        os.makedirs(IMAGES_DIR)

    total_updated = 0
    
    # Iterate over all JSON files in batches directory
    for filename in os.listdir(BATCHES_DIR):
        if not filename.endswith(".json"):
            continue
            
        filepath = os.path.join(BATCHES_DIR, filename)
        print(f"Processing {filename}...")
        
        with open(filepath, 'r', encoding='utf-8') as f:
            projects = json.load(f)

        file_updated = 0
        for project in projects:
            original_url = project.get("image_url", "")
            
            # Skip if already local or empty
            if not original_url or original_url.startswith("/images/"):
                continue
                
            # Infer extension
            file_ext = ".jpg"
            if "wx_fmt=png" in original_url:
                file_ext = ".png"
                
            img_filename = f"{project['id']}{file_ext}"
            local_path = os.path.join(IMAGES_DIR, img_filename)
            public_path = f"/images/projects/{img_filename}"
            
            print(f"  Downloading for {project['name']} ({project['id']})...")
            success = download_image(original_url, local_path)
            
            if success:
                project["image_url"] = public_path
                file_updated += 1
                time.sleep(random.uniform(0.1, 0.3))
        
        # Write back if updated
        if file_updated > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(projects, f, ensure_ascii=False, indent=2)
            print(f"  Updated {file_updated} images in {filename}")
            total_updated += file_updated

    print(f"Done. Total images updated: {total_updated}")

if __name__ == "__main__":
    main()