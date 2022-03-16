import { _DISH_FOR_MENU_, _DISH_MENU_ } from './../config/WordsAndPrefixes';
import { ApolloError } from 'apollo-server';
import { _S_MENU_ as _smenu_, _S_DISH_FOR_MENU_ as _sdishformenu_, _S_DISH_MENU_ as _sdishmenu_, _S_PRICE_ as _sprice_ } from './../config/GatewaysAndCollectionsServices';
import { MenuI } from "../BuilderI";
import { Dish, Price } from '../Model/Dish';
import { DishesForMenu, Menu } from '../Model/Menu';
import { PlateConcrete } from '../ConcreteB/PlateConcrete';
import { DishDirector } from './DishDirector';
import { MenuConcrete } from '../ConcreteB/MenuConcrete';

class MenuDirector {
  private menuI: MenuI;
  private menu: Menu;
  private _S_MENU_: FirebaseFirestore.CollectionReference;
  private _S_DISH_FOR_MENU_: FirebaseFirestore.CollectionReference;
  private _S_DISH_MENU_: FirebaseFirestore.CollectionReference;
  private _S_PRICE_: FirebaseFirestore.CollectionReference;

  constructor() {
    this._S_MENU_ = _smenu_;
  }

  async setMenu(menuI: MenuI, menu: Menu): Promise<void> {
    this.menuI = menuI;
    this.menu = menu;
    try {
      this._S_DISH_FOR_MENU_ = _sdishformenu_(this._S_MENU_.doc(menu.getId()));
      await this._S_MENU_.doc(menu.getId()).set({
        "date_menu": menu.getDateMenu(),
        "state": true,
        "created_at": this.menu.getCreatedAt(),
        "updated_at": this.menu.getUpdatedAt()
      });
    } catch (error) {
      throw new ApolloError("No se pudo registrar el menu.");
    }
  }

  async addDishForMenu(dish: Dish, prepared_quantity: number): Promise<void> {
    
    const dishForMenu = this.menuI.addDishForMenu(dish, prepared_quantity);
    try {
      await Promise.all([
        this.dishForMenu(dishForMenu),
        this.dishMenu(dish),
        this.price(dish.getPrice())
      ])
    } catch (error) {
      throw new ApolloError(`No se pudo registrar el plato para el menu. ${error}`);
    }
  }

  async price(price: Price) {
    try {
      let priceObj = {};
      if (!price.getOfferPrice() && !price.getBeforePrice()) {
        priceObj = {
          "now_price": price.getNowPrice()
        }
      }
      if (price.getOfferPrice() && !price.getBeforePrice()) {
        priceObj = {
          "now_price": price.getNowPrice(),
          "offer_price": price.getOfferPrice()
        }
      }
      if (!price.getOfferPrice() && price.getBeforePrice()) {
        priceObj = {
          "now_price": price.getNowPrice(),
          "befor_price": price.getBeforePrice()
        }
      }
      if (price.getOfferPrice() && price.getBeforePrice()) {
        priceObj = {
          "now_price": price.getNowPrice(),
          "offer_price": price.getOfferPrice(),
          "befor_price": price.getBeforePrice()
        }
      }
      return await this._S_PRICE_.doc().set(priceObj)
    } catch (error) {
      throw new ApolloError(`No se pudo registrar el precio del plato para el menu. ${error}`);
    }
  }

  async dishMenu(dish: Dish) {
    dish.genereteUuid(_DISH_MENU_)
    try {
      this._S_PRICE_ = _sprice_(this._S_DISH_MENU_.doc(dish.getId()))
      return await this._S_DISH_MENU_.doc(dish.getId()).set({
        "name": dish.getName(),
        "detail": dish.getDetail(),
        "created_at": dish.getCreatedAt(),
        "updated_at": dish.getUpdatedAt()
      })
    } catch (error) {
      throw new ApolloError(`No se pudo registrar el plato para el menu. ${error}`);
    }
  }

  async dishForMenu(dishForMenu: DishesForMenu) {
    dishForMenu.genereteUuid(_DISH_FOR_MENU_)
    try {
      this._S_DISH_MENU_ = _sdishmenu_(this._S_DISH_FOR_MENU_.doc(dishForMenu.getId()))
      return await this._S_DISH_FOR_MENU_.doc(dishForMenu.getId()).set({
        "prepared_quantity": dishForMenu.getPreparedQuantity(),
        "created_at": dishForMenu.getCreatedAt(),
        "updated_at": dishForMenu.getUpdatedAt()
      })
    } catch (error) {
      throw new ApolloError(`No se pudo registrar el plato y cantidad para el menu. ${error}`);
    }
  }

  addDishesForMenu(): void {
    this.menuI.addDishesForMenu();
  }

  async updatePrepared(dishes: any): Promise<Menu[]> {
    try {
      this._S_DISH_FOR_MENU_ = _sdishformenu_(this._S_MENU_.doc(dishes.menu))
      const dishForMenuAsynchronous = await this._S_DISH_FOR_MENU_.get()
      for await (const dishForMenuData of dishForMenuAsynchronous.docs) {
        for await (const _dish of dishes.dishes) {
          if (dishForMenuData.id === _dish.dish) {
            await this._S_DISH_FOR_MENU_.doc(dishForMenuData.id).set({
              ...dishForMenuData.data(),
              "prepared_quantity": dishForMenuData.data().prepared_quantity - _dish.quantity
            })
          }
        }
      }
      return await this.getMenusAsynchronous()
    } catch (error) {
      console.log(error)
      throw new ApolloError(`No se pudo acualizar el menu. ${error}`)
    }
  }

  async getMenusAsynchronous(): Promise<Menu[]> {
    const menus: Menu[] = [];
    const menuAsynchronous = await this._S_MENU_.get()
    for await (const menuData of menuAsynchronous.docs) {
      const _menu = menuData.data()
      this._S_DISH_FOR_MENU_ = _sdishformenu_(this._S_MENU_.doc(menuData.id))
      const dishForMenuAsynchronous = await this._S_DISH_FOR_MENU_.get()

      const dishForMenuI = new MenuConcrete(_menu.date_menu)
      dishForMenuI.getMenu().setId(menuData.id)
      dishForMenuI.getMenu().setCreatedAt(_menu.created_at)
      dishForMenuI.getMenu().setUpdatedAt(_menu.updated_at)

      for await (const dishForMenuData of dishForMenuAsynchronous.docs) {
        const _dish_for_menu = dishForMenuData.data()
        this._S_DISH_MENU_ = _sdishmenu_(this._S_DISH_FOR_MENU_.doc(dishForMenuData.id))
        const dishMenuAsynchronous = await this._S_DISH_MENU_.get()

        for await (const dishData of dishMenuAsynchronous.docs) {
          const _dish_menu = dishData.data()
          this._S_PRICE_ = _sprice_(this._S_DISH_MENU_.doc(dishData.id))
          const priceAsynchronous = await this._S_PRICE_.get()

          const dishI = new PlateConcrete(_dish_menu.name, _dish_menu.detail)
          dishI.getDish().setId(dishData.id)
          dishI.getDish().setCreatedAt(_dish_menu.created_at)
          dishI.getDish().setUpdatedAt(_dish_menu.updated_at)
          dishI.resetPrice()

          DishDirector.getDishAddPrice(dishI, priceAsynchronous)
          
          dishForMenuI.addDishForMenu(dishI.getDish(), _dish_for_menu.prepared_quantity, dishForMenuData.id)

        }
        dishForMenuI.addDishesForMenu()
      }
      menus.push(dishForMenuI.getMenu())
    }
    return menus
  }
}

export {
  MenuDirector
}