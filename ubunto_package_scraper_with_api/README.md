# Ubuntu Scraper Project (FastAPI) — Run on Ubuntu via .deb

## Overview
This package installs a web-scraping + data-cleaning project as a **systemd service** on Ubuntu. After installation, it scrapes laptop data, cleans it, then runs a FastAPI server to access the cleaned dataset.

A detailed system analysis + data-flow diagram are included in the project PDF:
- [odais notes and system analytics.pdf](odais%20notes%20and%20system%20analytics.pdf)

Quick data-flow summary:
`main.py` runs the scraper to save raw JSON → runs the cleaner to generate cleaned JSON → starts FastAPI (Uvicorn) which reads the cleaned JSON and serves it via REST endpoints.

## Prerequisites (Ubuntu)
- Python 3 installed
- Internet access (scraping needs it)

If you want to install requirements manually (rare), these packages are commonly needed:

```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv
```

## Install the .deb
Copy the `.deb` file to your Ubuntu machine, then run one of these options:

### Option A (recommended)
```bash
sudo apt install ./ubunto-project_1.0_all.deb
```

### Option B
```bash
sudo dpkg -i ubunto-project_1.0_all.deb
sudo apt -f install
```

## What happens after install
The `postinst` script will:
- set up a virtual environment in `/usr/local/ubunto_project/venv`
- install Python dependencies from `requirements.txt`
- copy the service file to `/etc/systemd/system/`
- enable and start the service `ubunto_project`


## Manage the service
Check status:

```bash
sudo systemctl status ubunto_project
```

Restart:

```bash
sudo systemctl restart ubunto_project
```

Stop / start:

```bash
sudo systemctl stop ubunto_project
sudo systemctl start ubunto_project
```

View logs:

```bash
sudo journalctl -u ubunto_project -e
```

## API usage
- Base URL: `http://127.0.0.1:9623`
- Swagger docs: `http://127.0.0.1:9623/docs`

Endpoints:
- `GET /`
- `GET /laptops/`
- `GET /laptops/{id}`
- `GET /laptops/search/{name}`

## Where the data is stored
- Raw scraped data: `/usr/local/ubunto_project/data/raw/laptops_raw_data.json`
- Cleaned data: `/usr/local/ubunto_project/data/clean/laptops_cleand_data.json`

## Troubleshooting
- If the service is "failed": check logs with `journalctl` and confirm internet access.
- If the API is not reachable: make sure port `9623` is open and the service is running.
- If `python3 -m venv` fails during install: install `python3-venv` then reinstall the package.
