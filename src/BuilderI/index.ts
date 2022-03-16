import { Dish } from "../Model/Dish";
import { DishesForMenu } from "../Model/Menu";

interface ModelI {
  generateUuid(): void;
  dateNow(): void;
  updatedModel(): void;
}

interface DishI {
  addPrice(): void;
  addNowPrice(now: number): void;
  addOfferPrice(offer: number): void;
  addBeforePrice(before: number): void;
}

interface MenuI {
  addDishForMenu(dish: Dish, preparedQuantity: number): DishesForMenu;
  addDishesForMenu(): void;
}

export {
  ModelI,
  DishI,
  MenuI
}