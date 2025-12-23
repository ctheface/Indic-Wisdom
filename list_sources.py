import csv
import re

def extract_sources(input_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    sources = {}
    for row in rows:
        src = row['source'].strip()
        if src not in sources:
            sources[src] = row['sanskrit']
    
    for s in sorted(sources.keys()):
        print(f"'{s}': '{sources[s][:30]}...'")

if __name__ == "__main__":
    extract_sources('wisdom_posts_rows.csv')
