from fastapi import APIRouter, HTTPException

from . import services as s
from ..models.laptop import Laptop

router = APIRouter(prefix="/laptops", tags=["laptops"])


@router.get("/", response_model=list[Laptop])
def list_laptops():
    return s.get_all_laptops()


@router.get("/{id}", response_model=Laptop)
def laptop_detail(id: int):
    laptop = s.get_laptop_by_id(id)
    if laptop is None:
        raise HTTPException(status_code=404, detail="Laptop not found")
    return laptop


@router.get("/search/{name}", response_model=list[Laptop])
def search_laptops(name: str):
    return s.get_laptops_by_name(name)
