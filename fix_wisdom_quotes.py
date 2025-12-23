import csv
import uuid
from datetime import datetime
import re
from collections import defaultdict

# DB for overrides (ensures high quality for very common verses)
SLOKA_DB = {
    # Gita Chapter 2
    "BG 2.47": {
        "sanskrit": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ २-४७ ॥",
        "translation": "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
        "explanation": "Nishkama Karma: The ethics of selfless action.",
        "source": "Bhagavad Gita 2.47"
    },
    "BG 2.48": {
        "sanskrit": "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥ २-४८ ॥",
        "translation": "Perform your duty poised in Yoga, O Arjuna, abandoning all attachment, and remaining balanced in success and failure. Such equanimity is called Yoga.",
        "explanation": "Definition of Yoga as Samatvam (equanimity).",
        "source": "Bhagavad Gita 2.48"
    },
    # Gita Chapter 3
    "BG 3.6": {
        "sanskrit": "कर्मेन्द्रियाणि संयम्य य आस्ते मनसा स्मरन् ।\nइन्द्रियार्थान्विमूढात्मा मिथ्याचारः स उच्यते ॥ ३-६ ॥",
        "translation": "One who restrains the senses of action but whose mind dwells on sense objects is a deluded soul and is called a hypocrite.",
        "explanation": "Physical restraint without mental control is hypocrisy.",
        "source": "Bhagavad Gita 3.6"
    },
    "BG 3.7": {
        "sanskrit": "यस्त्विन्द्रियाणि मनसा नियम्यारभतेऽर्जुन ।\nकर्मेन्द्रियैः कर्मयोगमसक्तः स विशिष्यते ॥ ३-७ ॥",
        "translation": "But he who controls the senses by the mind and engages his active organs in working without attachment is by far superior.",
        "explanation": "The superiority of active duty without attachment.",
        "source": "Bhagavad Gita 3.7"
    },
    "BG 3.31": {
        "sanskrit": "ये मे मतमिदं नित्यमनुतिष्ठन्ति मानवाः ।\nश्रद्धावन्तोऽनसूयन्तो मुच्यन्ते तेऽपि कर्मभिः ॥ ३-३१ ॥",
        "translation": "Those persons who execute their duties according to My injunctions and who follow this teaching faithfully, without envy, become free from the bondage of fruitive actions.",
        "explanation": "Faith and compliance with divine law leads to freedom.",
        "source": "Bhagavad Gita 3.31"
    },
    # Gita Chapter 6
    "BG 6.26": {
        "sanskrit": "यतो यतो निश्चरति मनश्चञ्चलमस्थिरम् ।\nततस्ततो नियम्यैतदात्मन्येव वशं नयेत् ॥ ६-२६ ॥",
        "translation": "From wherever the mind wanders due to its flickering and unsteady nature, one must certainly withdraw it and bring it back under the control of the Self.",
        "explanation": "The practice of withdrawing the flickering mind into the Self.",
        "source": "Bhagavad Gita 6.26"
    },
    # Gita Chapter 12
    "BG 12.9": {
        "sanskrit": "अथ चित्तं समाधातुं न शक्नोषि मयि स्थिरम् ।\nअभ्यासयोगेन ततो मामिच्छाप्तुं धनञ्जय ॥ १२-९ ॥",
        "translation": "If you cannot fix your mind upon Me without deviation, then follow the regulative principles of bhakti-yoga. In this way develop a desire to attain Me.",
        "explanation": "Abhyasa Yoga: practice for those who cannot focus easily.",
        "source": "Bhagavad Gita 12.9"
    },
    "BG 12.10": {
        "sanskrit": "अभ्यासेऽप्यसमर्थोऽसि मत्कर्मपरमो भव ।\nमदर्थमपि कर्माणि कुर्वन्सिद्धिमवाप्स्यसि ॥ १२-१० ॥",
        "translation": "If you cannot practice the regulations of bhakti-yoga, then just try to work for Me, because by working for Me you will come to the perfect stage.",
        "explanation": "Karma for the Divine as a path to perfection.",
        "source": "Bhagavad Gita 12.10"
    },
    "BG 12.11": {
        "sanskrit": "अथैतदप्यशक्तोऽसि कर्तुं मद्योगमाश्रितः ।\nसर्वकर्मफलत्यागं ततः कुरु यतात्मवान् ॥ १२-११ ॥",
        "translation": "If, however, you are unable to work in this consciousness of Me, then try to act giving up all results of your work and try to be self-situated.",
        "explanation": "Renunciation of fruits (Karma-phala-tyaga).",
        "source": "Bhagavad Gita 12.11"
    },
    "BG 12.12": {
        "sanskrit": "श्रेयो हि ज्ञानमभ्यासाज्ज्ञानाद्ध्यानं विशिष्यते ।\nध्यानात्कर्मफलत्यागस्त्यागाच्छान्तिरनन्तरम् ॥ १२-१२ ॥",
        "translation": "If you cannot take to this practice, then engage yourself in the cultivation of knowledge. Better than knowledge, however, is meditation, and better than meditation is renunciation of the fruits of action, for by such renunciation one can attain peace of mind.",
        "explanation": "The hierarchy of spiritual practices.",
        "source": "Bhagavad Gita 12.12"
    },
    "BG 12.13": {
        "sanskrit": "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च ।\nनिर्ममो निरहङ्कारः समदुःखसुखः क्षमी ॥ १२-१३ ॥",
        "translation": "One who is not envious but is a kind friend to all living entities, who does not think himself a proprietor and is free from false ego, who is equal in both happiness and distress, who is tolerant...",
        "explanation": "Qualities of a true devotee: compassion and egolessness.",
        "source": "Bhagavad Gita 12.13"
    },
    "BG 12.14": {
        "sanskrit": "सन्तुष्टः सततं योगी यतात्मा दृढनिश्चयः ।\nमय्यार्पितमनोबुद्धिर्यो मद्भक्तः स मे प्रियः ॥ १२-१४ ॥",
        "translation": "One who is always satisfied, self-controlled, and engaged in devotional service with determination, his mind and intelligence fixed on Me—such a devotee of Mine is very dear to Me.",
        "explanation": "Satisfaction and fixed determination in devotion.",
        "source": "Bhagavad Gita 12.14"
    },
    "BG 12.15": {
        "sanskrit": "यस्मान्नोद्विजते लोको लोकान्नोद्विजते च यः ।\nहर्षामर्षभयोद्वेगैर्मुक्तो यः स च मे प्रियः ॥ १२-१५ ॥",
        "translation": "He by whom no one is put into difficulty and who is not disturbed by anyone, who is equipoised in happiness and distress, fear and anxiety, is very dear to Me.",
        "explanation": "Freedom from emotional turbulence and causing no grief to others.",
        "source": "Bhagavad Gita 12.15"
    },
    "BG 12.16": {
        "sanskrit": "अनपेक्षः शुचिर्दक्ष उदासीनो गतव्यथः ।\nसर्वारम्भपरित्यागी यो मद्भक्तः स मे प्रियः ॥ १२-१६ ॥",
        "translation": "My devotee who is not dependent on the ordinary course of activities, who is pure, expert, without cares, free from all pains, and not striving for some result, is very dear to Me.",
        "explanation": "Purity, expertise, and detachment in action.",
        "source": "Bhagavad Gita 12.16"
    },
    "BG 12.17": {
        "sanskrit": "यो न हृष्यति न द्वेष्टि न शोचति न काङ्क्षति ।\nशुभाशुभपरित्यागी भक्तिमान्यः स मे प्रियः ॥ १२-१७ ॥",
        "translation": "One who neither rejoices nor grieves, who neither laments nor desires, and who renounces both auspicious and inauspicious things—such a devotee is very dear to Me.",
        "explanation": "Equanimity towards dualities of like and dislike.",
        "source": "Bhagavad Gita 12.17"
    },
    "BG 12.18": {
        "sanskrit": "समः शत्रौ च मित्रे च तथा मानापमानयोः ।\nशीतोष्णसुखदुःखेषु समः सङ्गविवर्जितः ॥ १२-१८ ॥",
        "translation": "One who is equal to friends and enemies, who is equipoised in honor and dishonor, heat and cold, happiness and distress, fame and infamy, who is always free from contaminating association...",
        "explanation": "Balance in social and physical conditions.",
        "source": "Bhagavad Gita 12.18"
    },
    "BG 12.19": {
        "sanskrit": "तुल्यनिन्दास्तुतिर्मौनी सन्तुष्टो येन केनचित् ।\nअनिकेतः स्थिरमतिर्भक्तिमान्मे प्रियो नरः ॥ १२-१९ ॥",
        "translation": "One who is equal in praise and reproach, who speaks little, who is satisfied with whatever comes, who is not attached to his home, who is fixed in knowledge, and who is engaged in devotional service—such a person is very dear to Me.",
        "explanation": "Satisfaction in all circumstances and steadiness of mind.",
        "source": "Bhagavad Gita 12.19"
    },
}

def canonical_source(src):
    src = src.strip()
    if not src: return ""
    
    # Standardize names
    src = re.sub(r"Bhagavad Gita", "BG", src, flags=re.I)
    src = re.sub(r",? Chapter ", " ", src, flags=re.I)
    src = re.sub(r",? Verse ", ".", src, flags=re.I)
    src = src.replace(":", ".")
    
    match = re.search(r"(BG|Mundaka|Isha|Katha|Brihadaranyaka|Chandogya)\s*(\d+)?[\.:]?(\d+)?[\.:]?(\d+)?", src, re.I)
    if match:
        name = match.group(1).upper()
        parts = []
        if match.group(2): parts.append(match.group(2))
        if match.group(3): parts.append(match.group(3))
        if match.group(4): parts.append(match.group(4))
        if parts:
            return f"{name} {'.'.join(parts)}"
        return name
    return src

def clean_and_fix_csv(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    grouped_by_source = defaultdict(list)
    fieldnames = ['id', 'sanskrit', 'translation', 'explanation', 'source', 'created_at']
    
    for row in rows:
        clean_row = {k: row.get(k, '').strip() for k in fieldnames}
        
        # Swapped field / messy source fix
        if len(clean_row['source']) > 50 and "Gita" not in clean_row['source'] and "Upanishad" not in clean_row['source']:
            if not clean_row['explanation']: clean_row['explanation'] = clean_row['source']
            clean_row['source'] = ""

        c_src = canonical_source(clean_row['source'])
        
        # Override look-up by text if source is missing
        if not c_src or c_src == "UNKNOWN":
            v_short = clean_row['sanskrit'].replace("।", "").strip()[:15]
            for db_key, db_val in SLOKA_DB.items():
                if v_short in db_val['sanskrit']:
                    c_src = db_key
                    clean_row.update(db_val)
                    break
        
        # Even if c_src is known, apply override for quality
        if c_src in SLOKA_DB:
            clean_row.update(SLOKA_DB[c_src])

        grouped_by_source[c_src].append(clean_row)

    final_rows = []
    for src, group in grouped_by_source.items():
        if not src or src == "UNKNOWN":
            # Just add unique rows for unknowns
            seen_sansk = set()
            for r in group:
                s_key = re.sub(r'[।॥\n\s\t]', '', r['sanskrit'])
                if s_key not in seen_sansk:
                    final_rows.append(r)
                    seen_sansk.add(s_key)
            continue
            
        # Merging logic for valid sources
        merged = {
            'id': group[0]['id'] or str(uuid.uuid4()),
            'sanskrit': "",
            'translation': "",
            'explanation': "",
            'source': src.replace('BG', 'Bhagavad Gita'),
            'created_at': datetime.utcnow().isoformat()
        }
        
        # Special logic for wide ranging sources like BRIHADARANYAKA
        if src in ["BRIHADARANYAKA"]:
            # Don't merge if they are very different
            for r in group:
                final_rows.append(r)
            continue

        # Combine unique sanskrit lines
        s_parts = []
        for r in group:
            s = r['sanskrit'].strip()
            if s and s not in s_parts:
                s_parts.append(s)
        merged['sanskrit'] = "\n".join(s_parts) if s_parts else group[0]['sanskrit']
        
        # Qualities
        merged['translation'] = max(group, key=lambda x: len(x['translation']))['translation']
        merged['explanation'] = max(group, key=lambda x: len(x['explanation']))['explanation']
        
        final_rows.append(merged)

    # De-duplicate final rows based on pure sanskrit content
    unique_final = {}
    for r in final_rows:
        norm_key = re.sub(r'[।॥\n\s\t]', '', r['sanskrit'])
        if not norm_key: continue
        
        if norm_key not in unique_final:
            unique_final[norm_key] = r
        else:
            # Upgrade existing
            if len(r['translation']) > len(unique_final[norm_key]['translation']):
                unique_final[norm_key]['translation'] = r['translation']
            if len(r['explanation']) > len(unique_final[norm_key]['explanation']):
                unique_final[norm_key]['explanation'] = r['explanation']

    output_list = list(unique_final.values())
    output_list.sort(key=lambda x: x['source'])

    with open(output_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in output_list:
            if not row['id']: row['id'] = str(uuid.uuid4())
            if not row['created_at'] or len(row['created_at']) < 10: 
                row['created_at'] = datetime.utcnow().isoformat()
            writer.writerow(row)
            
    print(f"Final count: {len(output_list)} records.")

if __name__ == "__main__":
    clean_and_fix_csv('wisdom_posts_rows.csv', 'wisdom_posts_rows_fixed.csv')
