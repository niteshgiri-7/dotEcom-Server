//stats of inventory
//calculating no.of products in each category and finding percentage occupied by each category

import { ProductType } from "../../types/modelType.js";
import { inventStatType, RequestWithStats } from "../../types/requestType.js";
import { TryCatch } from "../../utils/tryCatch.js";

export const getInventoryStats = TryCatch(async (req, res, next) => {
  const typedReq = req as RequestWithStats;
  const products: ProductType[] = typedReq.allProducts;

  const categories: string[] = products.reduce(
    (category: string[], product: ProductType) => {
      if (!category.includes(product.category)) category.push(product.category);
      return category;
    },
    []
  );

  //categories ma unique category cha e.g:-"mobile","tablet"
  // aba feri allProducts ma check garnu paryo  kati ota  products "mobile" maa cha

  const inventStat: inventStatType[] = categories.map((category) => {
    const stats = products.reduce(
      (acc: inventStatType, product) => {
        if (category === product.category) {
          acc.name = product.category;
          acc.count++;
        }
        return acc;
      },
      { name: "", count: 0 }
    );
    return stats;
  });
  //adding occupied percentage by each categories
  inventStat.forEach((inventory) => {
    console.log(inventory.count, products.length, "hello from inventory stats");
    inventory.percentage = Number(
      ((inventory.count / products.length) * 100).toFixed(0)
    );
    console.log(inventory.percentage);
  });

  typedReq.stats.inventoryStats = inventStat;
  next();
});
