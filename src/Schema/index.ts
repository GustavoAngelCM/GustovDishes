import { gql } from 'apollo-server';

export const typeDefs = gql`

  # type definitions
  type Price {
    now_price: Float!
    offer_price: Float
    before_price: Float
  }

  type Dish {
    id: ID
    name: String!
    detail: String
    price: Price!
    created_at: Float
    updated_at: Float
  }

  type DishesForMenu {
    id: ID
    dish: Dish
    prepared_quantity: Int
    created_at: Float
    updated_at: Float
  }

  type Menu {
    id: ID
    date_menu: Float!
    dishes: [DishesForMenu!]!
    state: Boolean
    created_at: Float
    updated_at: Float
  }

  type Order {
    id: ID
    dish: Dish!
    amount: Int!
    description: String
    sub_total: Float!
    created_at: Float
    updated_at: Float
  }

  type Sale {
    id: ID
    orders: [Order!]!
    total: Float!
    cancelled: Boolean
    created_at: Float
    updated_at: Float
  }

  type SalesHistory {
    id: ID
    sale_ref: String
    menu_ref: String
    status_in_transaction: Boolean
    amount: Int
    price_involved: Float
    created_at: Float
    updated_at: Float
  }

  # input rules
  input PriceI {
    now_price: Float!
    offer_price: Float
    before_price: Float
  }

  input DishI {
    name: String!
    detail: String
    price: PriceI!
  }

  input DishesForMenuI {
    dish: ID!
    prepared_quantity: Int!
  }

  input DishesForMenuSaleI {
    dish: ID!
    quantity: Int!
    subTotal: Float!
  }

  input UpdateMenuI {
    menu: ID!
    dishes: [DishesForMenuSaleI!]!
  }

  input MenuI {
    date_menu: Float!
    dishes: [DishesForMenuI!]!
  }

  input OrderI {
    dish: DishI!
    amount: Int!
    description: String
    sub_total: Float!
  }

  input SaleI {
    orders: [OrderI!]!
    total: Float!
  }

  input SalesHistoryI {
    sale_ref: String
    menu_ref: String
    status_in_transaction: Boolean
    amount: Int
    price_involved: Float
  }
  
  # query
  type Query {
    getDishes: [Dish]
    getMenus: [Menu]
  }

  # mutations
  type Mutation {
    newDish(dish: DishI): Dish
    registerMenu(menu: MenuI): Menu
    updateMenu(dishes: UpdateMenuI): [Menu]
  }
`;