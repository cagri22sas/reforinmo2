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
import type * as admin_chat from "../admin/chat.js";
import type * as admin_coupons from "../admin/coupons.js";
import type * as admin_media from "../admin/media.js";
import type * as admin_newsletter from "../admin/newsletter.js";
import type * as admin_orders from "../admin/orders.js";
import type * as admin_pages from "../admin/pages.js";
import type * as admin_products from "../admin/products.js";
import type * as admin_reviews from "../admin/reviews.js";
import type * as admin_seoSettings from "../admin/seoSettings.js";
import type * as admin_settings from "../admin/settings.js";
import type * as admin_shipping from "../admin/shipping.js";
import type * as admin_siteConfig from "../admin/siteConfig.js";
import type * as admin_stripeConfig from "../admin/stripeConfig.js";
import type * as admin_stripeDashboard from "../admin/stripeDashboard.js";
import type * as admin_testimonials from "../admin/testimonials.js";
import type * as admin_users from "../admin/users.js";
import type * as cart from "../cart.js";
import type * as categories from "../categories.js";
import type * as chat from "../chat.js";
import type * as coupons from "../coupons.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as newsletter from "../newsletter.js";
import type * as orders from "../orders.js";
import type * as pages from "../pages.js";
import type * as products from "../products.js";
import type * as reviews from "../reviews.js";
import type * as shipping from "../shipping.js";
import type * as stripe from "../stripe.js";
import type * as testimonials from "../testimonials.js";
import type * as users from "../users.js";
import type * as wishlist from "../wishlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "admin/categories": typeof admin_categories;
  "admin/chat": typeof admin_chat;
  "admin/coupons": typeof admin_coupons;
  "admin/media": typeof admin_media;
  "admin/newsletter": typeof admin_newsletter;
  "admin/orders": typeof admin_orders;
  "admin/pages": typeof admin_pages;
  "admin/products": typeof admin_products;
  "admin/reviews": typeof admin_reviews;
  "admin/seoSettings": typeof admin_seoSettings;
  "admin/settings": typeof admin_settings;
  "admin/shipping": typeof admin_shipping;
  "admin/siteConfig": typeof admin_siteConfig;
  "admin/stripeConfig": typeof admin_stripeConfig;
  "admin/stripeDashboard": typeof admin_stripeDashboard;
  "admin/testimonials": typeof admin_testimonials;
  "admin/users": typeof admin_users;
  cart: typeof cart;
  categories: typeof categories;
  chat: typeof chat;
  coupons: typeof coupons;
  helpers: typeof helpers;
  http: typeof http;
  newsletter: typeof newsletter;
  orders: typeof orders;
  pages: typeof pages;
  products: typeof products;
  reviews: typeof reviews;
  shipping: typeof shipping;
  stripe: typeof stripe;
  testimonials: typeof testimonials;
  users: typeof users;
  wishlist: typeof wishlist;
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
