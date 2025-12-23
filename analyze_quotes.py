import csv
import json
from collections import OrderedDict

def analyze_csv(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    unique_sanskrit = OrderedDict()
    for row in rows:
        s = row['sanskrit'].strip()
        if s not in unique_sanskrit:
            unique_sanskrit[s] = row
    
    print(f"Total rows: {len(rows)}")
    print(f"Unique sanskrit verses: {len(unique_sanskrit)}")
    
    # Let's count sources
    sources = {}
    for s, row in unique_sanskrit.items():
        src = row['source']
        sources[src] = sources.get(src, 0) + 1
    
    print("\nSource distribution:")
    for src, count in sorted(sources.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"{src}: {count}")

if __name__ == "__main__":
    analyze_csv('wisdom_posts_rows.csv')
