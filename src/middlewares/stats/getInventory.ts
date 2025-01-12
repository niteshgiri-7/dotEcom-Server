//stats of inventory
//calculating no.of products in each category and finding percentage occupied by each category

import { ProductType } from "../../types/modelType.js";
import { inventStatType } from "../../types/requestType.js";
import { calculatePercentage } from "../../utils/calculatePercentage.js";
import { TryCatch } from "../../utils/tryCatch.js";

export const getInventoryStats = TryCatch(async (req, res, next) => {
  const products: ProductType[] = req.allProducts;

  const categories: string[] = products.reduce(
    (category: string[], product: ProductType) => {
      if (!category.includes(product.category)) category.push(product.category);
      return category;
    },
    []
  );

  //categories ma unique category cha e.g:-"mobile","tablet"
  // aba feri allProducts ma check garnu paryo  kati ota  products "mobile" maa cha

  let inventStat: inventStatType[] = categories.map((category) => {
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
    inventory.percentage = calculatePercentage(inventory.count,products.length);
  });

  req.stats.inventoryStats = inventStat;
  next();
});
