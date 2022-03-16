import { _S_DISH_, _S_PRICE_ } from './../config/GatewaysAndCollectionsServices';
import { DishI } from "../BuilderI";
import { Dish } from '../Model/Dish';
import { ApolloError } from 'apollo-server';
import { PlateConcrete } from '../ConcreteB/PlateConcrete';

class DishDirector {
  private dishI: DishI;
  private dish: Dish;
  private _S_DISH__: FirebaseFirestore.CollectionReference;
  private _S_DISH_PRICE__: FirebaseFirestore.CollectionReference;

  constructor() {
    this._S_DISH__ = _S_DISH_;
  }

  async setDish(dishI: DishI, dish: Dish): Promise<void> { 
    this.dishI = dishI;
    this.dish = dish;    
    try {
      const exist = await this.existDish(dish.getName());
      if (exist) {
        this._S_DISH_PRICE__ = _S_PRICE_(this._S_DISH__.doc(this.dish.getId()));
        await this._S_DISH__.doc(this.dish.getId()).set({
          "name": this.dish.getName().toUpperCase(),
          "detail": this.dish.getDetail(),
          "created_at": this.dish.getCreatedAt(),
          "updated_at": this.dish.getUpdatedAt()
        })
      }
    } catch (error) {
      throw new ApolloError(`No se pudo registrar el plato, ${error}`);
    }
  }

  async existDish(nameDish: string): Promise<boolean> {
    try {
      const exist = await this._S_DISH__.where('name', '==', nameDish.toUpperCase()).get();
      if (exist.empty) {
        return exist.empty
      } else {
        throw new ApolloError("El plato ya existe");
      }
    } catch (error) {
      throw new ApolloError("Error verificando la existencia del plato");
    }
  }

  async basicDish(now: number): Promise<void> {
    this.dishI.addNowPrice(now)
    this.dishI.addPrice()
    try {
      await this._S_DISH_PRICE__.doc().set({
        "now_price": this.dish.getPrice().getNowPrice()
      })
    } catch (error) {
      throw new ApolloError("No se pudo registrar el precio actual.");
    }
  }

  async offerDish(now: number, offer: number): Promise<void> {
    this.dishI.addNowPrice(now)
    this.dishI.addOfferPrice(offer)
    this.dishI.addPrice()
    try {
      await this._S_DISH_PRICE__.doc().set({
        "now_price": this.dish.getPrice().getNowPrice(),
        "offer_price": this.dish.getPrice().getOfferPrice()
      })
    } catch (error) {
      throw new ApolloError("No se pudo registrar el precio en oferta.");
    }
  }

  async beforeDish(now: number, before: number): Promise<void> {
    this.dishI.addNowPrice(now)
    this.dishI.addBeforePrice(before)
    this.dishI.addPrice()
    try {
      await this._S_DISH_PRICE__.doc().set({
        "now_price": this.dish.getPrice().getNowPrice(),
        "before_price": this.dish.getPrice().getBeforePrice()
      })
    } catch (error) {
      console.log(error)
      throw new ApolloError("No se pudo registrar el precio anterior.");
    }
  }

  async beforeAndOfferDish(now: number, offer: number, before: number): Promise<void> {
    this.dishI.addNowPrice(now)
    this.dishI.addOfferPrice(offer)
    this.dishI.addBeforePrice(before)
    this.dishI.addPrice()
    try {
      await this._S_DISH_PRICE__.doc().set({
        "now_price": this.dish.getPrice().getNowPrice(),
        "offer_price": this.dish.getPrice().getOfferPrice(),
        "befor_price": this.dish.getPrice().getBeforePrice()
      })
    } catch (error) {
      throw new ApolloError("No se pudo registrar el precio en su conjunto.");
    }
  }

  static async getDish(uuidDish: string): Promise<Dish> {
    try {
      const dish = await _S_DISH_.doc(uuidDish).get();
      const dishData = dish.data();
      const priceData = await _S_PRICE_(_S_DISH_.doc(uuidDish)).get();
      if (dish.exists && dishData && priceData) {
        const dishI = new PlateConcrete(dishData.name, dishData.detail);
        dishI.getDish().setId(uuidDish);
        dishI.getDish().setCreatedAt(dishData.created_at);
        dishI.getDish().setUpdatedAt(dishData.updated_at);
        dishI.resetPrice();
        this.getDishAddPrice(dishI, priceData);
        return dishI.getDish()
      } else {
        throw new ApolloError(`No existe el plato`);
      }
    } catch (error) {
      throw new ApolloError(`Al obtener el plato ${error}`);
    }
  }

  static getDishAddPrice(dishI: DishI, priceData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>) {
    priceData.forEach(price => {
      const _price = price.data();
      if (!_price.offer_price && !_price.before_price) {
        dishI.addNowPrice(_price.now_price);
      }
      if (_price.offer_price && !_price.before_price) {
        dishI.addNowPrice(_price.now_price);
        dishI.addOfferPrice(_price.offer_price);
      }
      if (!_price.offer_price && _price.before_price) {
        dishI.addNowPrice(_price.now_price);
        dishI.addBeforePrice(_price.before_price);
      }
      if (_price.offer_price && _price.before_price) {
        dishI.addNowPrice(_price.now_price);
        dishI.addOfferPrice(_price.offer_price);
        dishI.addBeforePrice(_price.before_price);
      }
      dishI.addPrice();
    });
    return dishI;
  }

  async getDishesAsynchronous(): Promise<Dish[]> {
    const dishes: Dish[] = [];
    const dishesAsynchronous = await this._S_DISH__.get()
    for await (const dishData of dishesAsynchronous.docs) {
      const _dish = dishData.data()
      const priceData = await _S_PRICE_(_S_DISH_.doc(dishData.id)).get()
      const dishI = new PlateConcrete(_dish.name, _dish.detail)
      dishI.getDish().setId(dishData.id) 
      dishI.getDish().setCreatedAt(_dish.created_at) 
      dishI.getDish().setUpdatedAt(_dish.updated_at) 
      dishI.resetPrice()
      DishDirector.getDishAddPrice(dishI, priceData);
      dishes.push(dishI.getDish())
    }
    return dishes;
  }
}

export {
  DishDirector
}