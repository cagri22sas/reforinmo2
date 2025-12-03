import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    return categories.sort((a, b) => a.order - b.order);
  },
});

export const listWithProducts = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    const products = await ctx.db.query("products").filter((q) => q.eq(q.field("active"), true)).collect();
    
    // Filter categories that have at least one product
    const categoriesWithProducts = categories.filter((category) => 
      products.some((product) => product.categoryId === category._id)
    );
    
    return categoriesWithProducts.sort((a, b) => a.order - b.order);
  },
});
