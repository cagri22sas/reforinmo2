import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const batchUpdateProductImages = mutation({
  args: {},
  handler: async (ctx) => {
    const productUpdates = [
      {
        id: "js76yx0zk8xxf5tvaz31gz5tad7wgpbs",
        images: ["https://images.unsplash.com/photo-1711166875865-f9bf48804bb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwyfHx5YWNodCUyMGluZmxhdGFibGUlMjB3YXRlciUyMHNsaWRlJTIwcGxhdGZvcm18ZW58MHx8fHwxNzY0Nzk1ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js71vdw4kx8zsv3eaq97a482sd7wg4wc",
        images: ["https://images.unsplash.com/photo-1544044756-ed09a79af261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwxfHx5YWNodCUyMGluZmxhdGFibGUlMjBiZW5jaCUyMHNlYXRpbmd8ZW58MHx8fHwxNzY0Nzk1ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js70re9e2mms650pzssq416y4x7wgnas",
        images: ["https://images.unsplash.com/photo-1628595292831-079360e99962?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwzfHx5YWNodCUyMGluZmxhdGFibGUlMjBzdG9vbCUyMG90dG9tYW58ZW58MHx8fHwxNzY0Nzk1ODc3fDA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js7533s49wfdx8wek3p73x51497wg9v2",
        images: ["https://images.unsplash.com/photo-1616207133639-cd5e4db9859f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB5YWNodCUyMGluZmxhdGFibGUlMjBzdW5iZWQlMjBsb3VuZ2VyfGVufDB8fHx8MTc2NDc5NTg3Nnww&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js709bk94yxteqkvaaccejcpes7wgzp4",
        images: ["https://images.unsplash.com/photo-1686845928517-8ffc9009a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjB5YWNodCUyMGluZmxhdGFibGUlMjBzdW5iZWQlMjBsb3VuZ2VyfGVufDB8fHx8MTc2NDc5NTg3Nnww&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js73h2jewnrdmm0t8jzwhxz4p57whyy2",
        images: ["https://images.unsplash.com/photo-1761773851121-b5c9025d3781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHw4fHx5YWNodCUyMGpldCUyMHNraSUyMGRvY2slMjBwbGF0Zm9ybXxlbnwwfHx8fDE3NjQ3OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js7abb56j7yn5ge4e1prvsvn9n7wgtpc",
        images: ["https://images.unsplash.com/photo-1674487887038-d2fd1386def2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwyfHx5YWNodCUyMGxhZGRlciUyMHN0YWlubGVzcyUyMHN0ZWVsJTIwYm9hcmRpbmd8ZW58MHx8fHwxNzY0Nzk1ODc3fDA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js77614yhwpt7y9sdsaxwj6ngs7whscg",
        images: ["https://images.unsplash.com/photo-1668603389818-0ce4b5298a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwzfHx5YWNodCUyMGxhZGRlciUyMHN0YWlubGVzcyUyMHN0ZWVsJTIwYm9hcmRpbmd8ZW58MHx8fHwxNzY0Nzk1ODc3fDA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js77wzz93b3q0m47sqshdapxb97whg79",
        images: ["https://images.unsplash.com/photo-1632930623433-ef48ddca336f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwxfHx5YWNodCUyMGpldCUyMHNraSUyMGRvY2slMjBwbGF0Zm9ybXxlbnwwfHx8fDE3NjQ3OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js7cej30c2t5856zwmn956m7p57wge3y",
        images: ["https://images.unsplash.com/photo-1632930623433-ef48ddca336f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwxfHx5YWNodCUyMGpldCUyMHNraSUyMGRvY2slMjBwbGF0Zm9ybXxlbnwwfHx8fDE3NjQ3OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js7dgamn6ts6mwgnh9rgp2gkbd7whta9",
        images: ["https://images.unsplash.com/photo-1632930623433-ef48ddca336f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwxfHx5YWNodCUyMGpldCUyMHNraSUyMGRvY2slMjBwbGF0Zm9ybXxlbnwwfHx8fDE3NjQ3OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js7908vqde7vgewp8s6r5nrs1d7whe2x",
        images: ["https://images.unsplash.com/photo-1542571686655-3bb91ed49080?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHw0fHx5YWNodCUyMHRlYWslMjBwbGF0Zm9ybSUyMGZsb2F0aW5nJTIwZGVja3xlbnwwfHx8fDE3NjQ3OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js73fbg05k1rvnym80q3m5e4vs7wgsnw",
        images: ["https://images.unsplash.com/photo-1711166875865-f9bf48804bb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwxfHx5YWNodCUyMHRlYWslMjBwbGF0Zm9ybSUyMGZsb2F0aW5nJTIwZGVja3xlbnwwfHx8fDE3NjQ3OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js7b64mbqp718jk4fs2hmxq6f17wg29t",
        images: ["https://images.unsplash.com/photo-1693332295219-c454a3b379c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHw4fHx5YWNodCUyMGZsb2F0aW5nJTIwcGF2aWxpb24lMjB0ZW50fGVufDB8fHx8MTc2NDc5NTg3N3ww&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js74pxwgnj1exf29cvpyzj6a5s7wgw3z",
        images: ["https://images.unsplash.com/photo-1711166875865-f9bf48804bb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwxfHx5YWNodCUyMHRlYWslMjBwbGF0Zm9ybSUyMGZsb2F0aW5nJTIwZGVja3xlbnwwfHx8fDE3NjQ3OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js7f80w2apb6k1wwr8kntrhyjs7wgsst",
        images: ["https://images.unsplash.com/photo-1761773851121-b5c9025d3781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHw4fHx5YWNodCUyMGpldCUyMHNraSUyMGRvY2slMjBwbGF0Zm9ybXxlbnwwfHx8fDE3NjQ3OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js73gmfgq7n3egbczcr4gevxas7wgz44",
        images: ["https://images.unsplash.com/photo-1761773851121-b5c9025d3781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHw4fHx5YWNodCUyMGpldCUyMHNraSUyMGRvY2slMjBwbGF0Zm9ybXxlbnwwfHx8fDE3NjQ3OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js7fn12c78402agd34av5d9mwx7whvxf",
        images: ["https://images.unsplash.com/photo-1674487887038-d2fd1386def2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwyfHx5YWNodCUyMGxhZGRlciUyMHN0YWlubGVzcyUyMHN0ZWVsJTIwYm9hcmRpbmd8ZW58MHx8fHwxNzY0Nzk1ODc3fDA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js728e4sw62rn8yakc4wyc82dh7wgqt7",
        images: ["https://images.unsplash.com/photo-1668603389818-0ce4b5298a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwzfHx5YWNodCUyMGxhZGRlciUyMHN0YWlubGVzcyUyMHN0ZWVsJTIwYm9hcmRpbmd8ZW58MHx8fHwxNzY0Nzk1ODc3fDA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
      {
        id: "js74hqaste8bam4dzzjve745qh7wgsgx",
        images: ["https://images.unsplash.com/photo-1632930623433-ef48ddca336f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwxfHx5YWNodCUyMGpldCUyMHNraSUyMGRvY2slMjBwbGF0Zm9ybXxlbnwwfHx8fDE3NjQ3OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"]
      },
    ];

    let updated = 0;
    for (const update of productUpdates) {
      try {
        const productId = update.id as unknown as import("./_generated/dataModel").Id<"products">;
        await ctx.db.patch(productId, {
          images: update.images,
        });
        updated++;
      } catch (error) {
        console.log(`Failed to update product ${update.id}`);
      }
    }

    return { updated, total: productUpdates.length };
  },
});
