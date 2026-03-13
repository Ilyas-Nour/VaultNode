import json
import os

def check_keys(base_file, other_file):
    with open(base_file, 'r', encoding='utf-8') as f:
        base_data = json.load(f)
    with open(other_file, 'r', encoding='utf-8') as f:
        other_data = json.load(f)

    def get_keys(data, current_key=''):
        keys = set()
        if not isinstance(data, dict):
            return keys
        for k, v in data.items():
            new_key = f"{current_key}.{k}" if current_key else k
            if isinstance(v, dict):
                keys.update(get_keys(v, new_key))
            else:
                keys.add(new_key)
        return keys

    base_keys = get_keys(base_data)
    other_keys = get_keys(other_data)

    missing = base_keys - other_keys
    extra = other_keys - base_keys
    return missing, extra

base_dir = r'c:\Users\pc\VaultNode\messages'
locales = ['ar', 'es', 'fr']
base = os.path.join(base_dir, 'en.json')

if not os.path.exists(base):
    print(f"Base file not found: {base}")
    exit(1)

for lang in locales:
    other = os.path.join(base_dir, f'{lang}.json')
    if os.path.exists(other):
        missing, extra = check_keys(base, other)
        print(f"--- {lang.upper()} ---")
        if missing:
            print(f"Missing keys ({len(missing)}):")
            for m in sorted(list(missing)):
                print(f"  - {m}")
        else:
            print("No missing keys.")
        if extra:
            print(f"Extra keys ({len(extra)}):")
            for e in sorted(list(extra)):
                print(f"  - {e}")
        print("\n")
    else:
        print(f"Language file not found: {other}")
