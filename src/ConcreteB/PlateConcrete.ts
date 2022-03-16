import { _DISH_ } from './../config/WordsAndPrefixes';
import { DishI, ModelI } from "../BuilderI";
import { Dish, Price } from "../Model/Dish";

class PlateConcrete implements DishI, ModelI {
  private dish: Dish;
  private price: Price;

  constructor(name: string, detail: string) {
    this.reset();
    this.dish.setName(name.toUpperCase());
    this.dish.setDetail(detail.charAt(0).toUpperCase() + detail.slice(1));
  }

  reset(): void {
    this.dish = new Dish();
  }
  generateUuid(): void {
    this.dish.genereteUuid(_DISH_);
  }
  dateNow(): void {
    this.dish.dateNow()
  }
  updatedModel(): void {
    this.dish.setCreatedAt(Date.now())
  }
  addPrice(): void {
    this.dish.setPrice(this.price);
  }
  resetPrice(): void {
    this.price = new Price();
  }
  addNowPrice(now: number): void {
    this.price.setNowPrice(now);
  }
  addOfferPrice(offer: number): void {
    this.price.setOfferPrice(offer);
  }
  addBeforePrice(before: number): void {
    this.price.setBeforePrice(before);
  }
  public getDish(): Dish{
    return this.dish;
  }
}

export {
  PlateConcrete
}