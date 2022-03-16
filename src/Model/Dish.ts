import Model from "./Model";

class Price {
  protected now_price: number;
  protected offer_price: number;
  protected before_price: number;

  setNowPrice(now_price: number): void { this.now_price = now_price }
  setOfferPrice(offer_price: number): void { this.offer_price = offer_price }
  setBeforePrice(before_price: number): void { this.before_price = before_price }

  getNowPrice(): number { return this.now_price }
  getOfferPrice(): number { return this.offer_price }
  getBeforePrice(): number { return this.before_price }
}

class Dish extends Model {
  private name: string;
  private detail: string;
  private price: Price;

  setName(name: string): void { this.name = name }
  setDetail(detail: string): void { this.detail = detail }
  setPrice(price: Price): void { this.price = price }

  getName(): string { return this.name }
  getDetail(): string { return this.detail }
  getPrice(): Price { return this.price }
}

export {
  Price,
  Dish
}