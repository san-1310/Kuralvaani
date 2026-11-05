import os
import zipfile
import sys

def make_zip(source_dir, output_zip):
    exclude_dirs = {'node_modules', 'dist', '.git', '.cache', '__pycache__', '.aistudio'}
    exclude_files = {'.DS_Store'}

    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Prune excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                if file in exclude_files:
                    continue
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, source_dir)
                zipf.write(file_path, rel_path)

if __name__ == '__main__':
    src = sys.argv[1] if len(sys.argv) > 1 else '.'
    out = sys.argv[2] if len(sys.argv) > 2 else 'kuralvaani-tamil-tts.zip'
    make_zip(src, out)
    print(f"Created {out} ({os.path.getsize(out)} bytes)")
