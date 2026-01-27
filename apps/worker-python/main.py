import os
from pathlib import Path

def load_dotenv(repo_root: Path):
    p = repo_root / ".env"
    if not p.exists():
        return
    for raw in p.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        k = k.strip()
        v = v.strip()
        os.environ.setdefault(k, v)

if __name__ == "__main__":
    repo_root = Path(__file__).resolve().parents[2]
    load_dotenv(repo_root)
    print("worker-python ok")
    print("PGDATABASE=", os.getenv("PGDATABASE"))