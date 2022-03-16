import { _DISH_FOR_MENU_ } from './../config/WordsAndPrefixes';
import { MenuI, ModelI } from "../BuilderI";
import { _MENU_ } from "../config/WordsAndPrefixes";
import { DishesForMenu, Menu } from "../Model/Menu";
import { Dish } from '../Model/Dish';

class MenuConcrete implements MenuI, ModelI {
  private dishesForMenu: DishesForMenu[];
  private menu: Menu;

  constructor(date_menu: number, state: boolean = true) {
    this.reset();
    this.menu.setDateMenu(date_menu);
    this.menu.setState(state);
    this.dishesForMenu = [];
  }
  reset(): void {
    this.menu = new Menu();
  }
  generateUuid(): void {
    this.menu.genereteUuid(_MENU_);
  }
  dateNow(): void {
    this.menu.dateNow();
  }
  updatedModel(): void {
    this.menu.setCreatedAt(Date.now())
  }
  addDishForMenu(dish: Dish, preparedQuantity: number, id=''): DishesForMenu {
    const dishForMenu = new DishesForMenu()
    dishForMenu.setDish(dish);
    dishForMenu.setPreparedQuantity(preparedQuantity);
    dishForMenu.dateNow();
    if(id === '') {
      dishForMenu.genereteUuid(_DISH_FOR_MENU_);
    } else {
      dishForMenu.setId(id);
    }
    this.dishesForMenu.push(dishForMenu);
    return dishForMenu;
  }
  addDishesForMenu(): void {
    this.menu.setDishes(this.dishesForMenu);
  }
  getMenu(): Menu{
    return this.menu;
  }
}

export {
  MenuConcrete
}