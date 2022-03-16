import { Dish } from "./Dish";
import Model from "./Model";

class DishesForMenu extends Model {
  private dish: Dish;
  private prepared_quantity: number;

  setDish(dish: Dish): void { this.dish = dish }
  setPreparedQuantity(prepared_quantity: number): void { this.prepared_quantity = prepared_quantity }

  getDish(): Dish { return this.dish }
  getPreparedQuantity(): number { return this.prepared_quantity }
}

class Menu extends Model {
  private date_menu: number;
  private state: boolean;
  private dishes: DishesForMenu[];

  setDateMenu(date_menu: number): void { this.date_menu = date_menu }
  setState(state: boolean): void { this.state = state }
  setDishes(dishes: DishesForMenu[]): void { this.dishes = dishes }

  getDateMenu(): number { return this.date_menu }
  getState(): boolean { return this.state }
  getDishes(): DishesForMenu[] { return this.dishes }

  addDishForMenu(dishForMenu: DishesForMenu): void { this.dishes.push(dishForMenu) }
}

export {
  DishesForMenu,
  Menu
}