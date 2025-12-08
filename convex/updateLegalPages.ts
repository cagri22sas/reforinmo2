import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const updateAllLegalPages = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get all pages
    const pages = await ctx.db.query("pages").collect();
    
    let updatedCount = 0;
    
    for (const page of pages) {
      let updatedContent = page.content;
      
      // Replace YachtBeach with Reforinmo Marine
      updatedContent = updatedContent.replace(/YachtBeach/g, "Reforinmo Marine");
      updatedContent = updatedContent.replace(/yachtbeach/g, "reforinmomarine");
      
      // Replace company information
      updatedContent = updatedContent.replace(
        /YachtBeach International Ltd\./g,
        "Reforinmo Marine S.L."
      );
      
      // Replace address
      updatedContent = updatedContent.replace(
        /123 Harbor Street<br>Miami, FL 33101<br>United States/g,
        "CALLE URB LOS PINOS, NUM 16 PUERTA C<br>03710 CALP - (ALICANTE)<br>Spain"
      );
      
      updatedContent = updatedContent.replace(
        /123 Harbor Street<br>Miami, FL 33101<br>Estados Unidos/g,
        "CALLE URB LOS PINOS, NUM 16 PUERTA C<br>03710 CALP - (ALICANTE)<br>España"
      );
      
      // Replace phone
      updatedContent = updatedContent.replace(
        /\+1 \(555\) 123-4567/g,
        "+34 661 171 490"
      );
      
      // Replace emails
      updatedContent = updatedContent.replace(
        /@yachtbeach\.com/g,
        "@reforinmomarine.com"
      );
      
      // Replace website references
      updatedContent = updatedContent.replace(
        /yachtbeach\.com/g,
        "reforinmomarine.com"
      );
      
      // Update if content changed
      if (updatedContent !== page.content) {
        await ctx.db.patch(page._id, {
          content: updatedContent,
        });
        updatedCount++;
      }
    }
    
    return {
      success: true,
      message: `Updated ${updatedCount} pages`,
      updatedCount,
    };
  },
});
