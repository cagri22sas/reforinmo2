"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const migrateAllImages = action({
  args: {},
  handler: async (ctx) => {
    console.log("Starting image migration...");
    
    const results = {
      productsProcessed: 0,
      productImagesMigrated: 0,
      categoriesProcessed: 0,
      categoryImagesMigrated: 0,
      errors: [] as string[],
    };

    try {
      // Get all products with external images
      const products = await ctx.runQuery(internal.migrateImagesToStorageHelpers.getProductsWithExternalImages);
      results.productsProcessed = products.length;
      console.log(`Found ${products.length} products with external images`);

      // Migrate product images
      for (const product of products) {
        try {
          if (product.images && product.images.length > 0) {
            const newStorageIds = [];
            
            for (const imageUrl of product.images) {
              if (imageUrl.startsWith("http")) {
                try {
                  // Download image
                  console.log(`Downloading: ${imageUrl}`);
                  const response = await fetch(imageUrl);
                  
                  if (!response.ok) {
                    throw new Error(`Failed to download: ${response.statusText}`);
                  }
                  
                  const blob = await response.blob();
                  
                  // Generate upload URL
                  const uploadUrl = await ctx.runMutation(internal.migrateImagesToStorageHelpers.generateUploadUrl, {});
                  
                  // Upload to storage
                  const uploadResponse = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": blob.type || "image/jpeg" },
                    body: blob,
                  });
                  
                  const { storageId } = await uploadResponse.json();
                  
                  newStorageIds.push(storageId);
                  results.productImagesMigrated++;
                  console.log(`Migrated image for product ${product._id}`);
                } catch (error) {
                  console.error(`Error migrating image ${imageUrl}:`, error);
                  results.errors.push(`Product ${product._id}: ${imageUrl} - ${error}`);
                }
              }
            }
            
            // Update product with new storage IDs
            if (newStorageIds.length > 0) {
              await ctx.runMutation(internal.migrateImagesToStorageHelpers.updateProductImages, {
                productId: product._id,
                storageIds: newStorageIds,
              });
            }
          }
        } catch (error) {
          console.error(`Error processing product ${product._id}:`, error);
          results.errors.push(`Product ${product._id}: ${error}`);
        }
      }

      // Get all categories with external images
      const categories = await ctx.runQuery(internal.migrateImagesToStorageHelpers.getCategoriesWithExternalImages);
      results.categoriesProcessed = categories.length;
      console.log(`Found ${categories.length} categories with external images`);

      // Migrate category images
      for (const category of categories) {
        try {
          if (category.imageUrl && category.imageUrl.startsWith("http")) {
            try {
              // Download image
              console.log(`Downloading category image: ${category.imageUrl}`);
              const response = await fetch(category.imageUrl);
              
              if (!response.ok) {
                throw new Error(`Failed to download: ${response.statusText}`);
              }
              
              const blob = await response.blob();
              
              // Generate upload URL
              const uploadUrl = await ctx.runMutation(internal.migrateImagesToStorageHelpers.generateUploadUrl, {});
              
              // Upload to storage
              const uploadResponse = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": blob.type || "image/jpeg" },
                body: blob,
              });
              
              const { storageId } = await uploadResponse.json();
              
              // Get storage URL
              const storageUrl = await ctx.runQuery(internal.migrateImagesToStorageHelpers.getStorageUrl, {
                storageId,
              });
              
              // Update category with new storage URL
              await ctx.runMutation(internal.migrateImagesToStorageHelpers.updateCategoryImage, {
                categoryId: category._id,
                imageUrl: storageUrl,
              });
              
              results.categoryImagesMigrated++;
              console.log(`Migrated image for category ${category._id}`);
            } catch (error) {
              console.error(`Error migrating category image ${category.imageUrl}:`, error);
              results.errors.push(`Category ${category._id}: ${category.imageUrl} - ${error}`);
            }
          }
        } catch (error) {
          console.error(`Error processing category ${category._id}:`, error);
          results.errors.push(`Category ${category._id}: ${error}`);
        }
      }

      console.log("Migration completed:", results);
      return results;
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  },
});
