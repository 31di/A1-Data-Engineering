from pydantic import BaseModel


class Laptop(BaseModel):
    id: int
    name: str
    price: float
    description: str
    review_count: int
    rating: int
    screen_size: float
    processor: str
    hard: str
    ram: int
