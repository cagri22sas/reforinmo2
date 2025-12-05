import { internalMutation } from "./_generated/server";

export const removeYachtbeachFromNames = internalMutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    let updateCount = 0;
    
    for (const product of products) {
      if (product.name.toUpperCase().includes("YACHTBEACH")) {
        // Remove YACHTBEACH from name (case insensitive)
        const newName = product.name.replace(/YACHTBEACH\s*/gi, "").trim();
        
        // Generate new slug from new name
        const newSlug = newName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        
        // Check if slug exists
        const existingWithSlug = await ctx.db
          .query("products")
          .withIndex("by_slug", (q) => q.eq("slug", newSlug))
          .first();
        
        // If slug exists and it's not the same product, append a suffix
        let finalSlug = newSlug;
        if (existingWithSlug && existingWithSlug._id !== product._id) {
          finalSlug = `${newSlug}-${product._id.slice(-4)}`;
        }
        
        await ctx.db.patch(product._id, {
          name: newName,
          slug: finalSlug,
        });
        
        updateCount++;
        console.log(`Updated: "${product.name}" -> "${newName}" (slug: ${finalSlug})`);
      }
    }
    
    return { updateCount, message: `Updated ${updateCount} products` };
  },
});
