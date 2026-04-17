import subprocess
import sys


def run_step(args: list[str], ok_message: str) -> None:
    subprocess.run(args, check=True)
    print(ok_message)


def main() -> None:
    print("loading data from web ....")
    run_step([sys.executable, "scraper.py"], "data scraped sucssfuly !!")

    print("transform data ....")
    run_step([sys.executable, "cleaner.py"], "data transformed sucssfuly !!")

    print("you can access data using API ")
    run_step(
        [
            sys.executable,
            "-m",
            "uvicorn",
            "api.main:app",
            "--reload",
            "--port",
            "9623",
        ],
        "API server stopped",
    )


if __name__ == "__main__":
    main()
