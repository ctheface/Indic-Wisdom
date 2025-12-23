import csv
import json

def export_unique_verses(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    unique_verses = {}
    for row in rows:
        s = row['sanskrit'].strip()
        if s not in unique_verses:
            unique_verses[s] = {
                'translation': row['translation'],
                'explanation': row['explanation'],
                'source': row['source']
            }
    
    with open('unique_verses.json', 'w', encoding='utf-8') as f:
        json.dump(unique_verses, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    export_unique_verses('wisdom_posts_rows.csv')
