import { ApolloError } from 'apollo-server';
import { MenuConcrete } from '../ConcreteB/MenuConcrete';
import { PlateConcrete } from "../ConcreteB/PlateConcrete"
import { DishDirector } from "../Director/DishDirector"
import { MenuDirector } from '../Director/MenuDirector';

export const resolvers = {
  Query: {
    getDishes: () => {
      try {
        const dishDirector = new DishDirector()
        return dishDirector.getDishesAsynchronous()
      } catch (error) {
        throw new ApolloError(`Get Dish - ${error}`)
      }
    },
    getMenus: () => {
      try {
        const menuDirector = new MenuDirector()
        return menuDirector.getMenusAsynchronous()
      } catch (error) {
        throw new ApolloError(`Get Menus - ${error}`)
      }
    }
  },
  Mutation: {
    // mutation create
    newDish: async (_: any, { dish }: any, ctx: any) => {
      try {
        const dishDirector = new DishDirector()
        const dishI = new PlateConcrete(dish.name, dish.detail)
        dishI.generateUuid();
        dishI.dateNow();
        dishI.resetPrice();
        await dishDirector.setDish(dishI, dishI.getDish());
        if (!dish.price.offer_price && !dish.price.before_price) {
          await dishDirector.basicDish(dish.price.now_price);
        }
        if (dish.price.offer_price && !dish.price.before_price) {
          await dishDirector.offerDish(dish.price.now_price, dish.price.offer_price);
        }
        if (!dish.price.offer_price && dish.price.before_price) {
          await dishDirector.beforeDish(dish.price.now_price, dish.price.before_price);
        }
        if (dish.price.offer_price && dish.price.before_price) {
          await dishDirector.beforeAndOfferDish(dish.price.now_price, dish.price.offer_price, dish.price.befor_price)
        }
        return dishI.getDish();
      } catch (error) {
        throw new ApolloError(`Dish - ${error}`)
      }
    },
    registerMenu: async (_: any, { menu }: any, ctx: any) => {
      try {
        const menuDirector = new MenuDirector();
        const menuI = new MenuConcrete(menu.date_menu);
        menuI.generateUuid();
        menuI.dateNow();
        menuDirector.setMenu(menuI, menuI.getMenu());
        const menus = menu.dishes.map(async (dishForMenu: any) => {
          const dish = await DishDirector.getDish(dishForMenu.dish);
          return menuDirector.addDishForMenu(dish, dishForMenu.prepared_quantity)
        });
        await Promise.all(menus);
        menuDirector.addDishesForMenu();
        return menuI.getMenu()
      } catch (error) {
        throw new ApolloError(`Menu - ${error}`)
      }
    },
    updateMenu: async (_: any, { dishes }: any, ctx: any) => {
      try {
        const menuDirector = new MenuDirector();
        return menuDirector.updatePrepared(dishes)
      } catch (error) {
        throw new ApolloError(`Menu - ${error}`)
      }
    }
  }
}