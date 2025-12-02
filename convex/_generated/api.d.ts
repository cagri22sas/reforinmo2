/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin_categories from "../admin/categories.js";
import type * as admin_orders from "../admin/orders.js";
import type * as admin_products from "../admin/products.js";
import type * as admin_settings from "../admin/settings.js";
import type * as admin_shipping from "../admin/shipping.js";
import type * as admin_siteConfig from "../admin/siteConfig.js";
import type * as admin_users from "../admin/users.js";
import type * as cart from "../cart.js";
import type * as categories from "../categories.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as orders from "../orders.js";
import type * as products from "../products.js";
import type * as shipping from "../shipping.js";
import type * as stripe from "../stripe.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "admin/categories": typeof admin_categories;
  "admin/orders": typeof admin_orders;
  "admin/products": typeof admin_products;
  "admin/settings": typeof admin_settings;
  "admin/shipping": typeof admin_shipping;
  "admin/siteConfig": typeof admin_siteConfig;
  "admin/users": typeof admin_users;
  cart: typeof cart;
  categories: typeof categories;
  helpers: typeof helpers;
  http: typeof http;
  orders: typeof orders;
  products: typeof products;
  shipping: typeof shipping;
  stripe: typeof stripe;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
