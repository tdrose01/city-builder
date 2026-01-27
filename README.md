# city-builder

Windows-only dev/CI scaffold: React (Vite), Node (Express), .NET, Python, Postgres (local Windows service).

## 1) Configure Postgres connection
Edit .env (repo root). Defaults:
- PGHOST=localhost
- PGPORT=5432
- PGDATABASE=city-builder_dev
- PGUSER=postgres
- PGPASSWORD=...

Create the database once (example):
- In psql or pgAdmin: CREATE DATABASE city-builder_dev;

## 2) Apply DB migrations
From repo root:
`powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Invoke-DbMigrations.ps1 -DryRun
powershell -ExecutionPolicy Bypass -File .\scripts\Invoke-DbMigrations.ps1
`

## 3) Node API
`powershell
cd .\apps\api-node
npm install
npm run dev
`
Health:
- http://localhost:5001/health

## 4) React Web (recommended: Vite)
Option A (generator):
`powershell
cd .\apps
npm create vite@latest web-react -- --template react
cd .\web-react
npm install
npm run dev
`

## 5) .NET API
Option A (generator):
`powershell
cd .\apps
dotnet new webapi -n api-dotnet
cd .\api-dotnet
dotnet run
`

## 6) Python Worker
`powershell
cd .\apps\worker-python
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python .\main.py
`