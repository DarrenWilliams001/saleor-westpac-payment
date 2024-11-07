import type { NextApiRequest, NextApiResponse } from "next";
import { ProductBulkCreateInput } from "../../../generated/graphql";

const consumerKey = process.env.WORDPRESS_CONSUMER_KEY;
const secretKey = process.env.WORDPRESS_SECRET_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!consumerKey || !secretKey) {
    return res.status(500).json({ error: "WordPress consumer key or secret key is not set" });
  }

  try {
    const response = await fetch(
      "https://motorsportpartsaustralia.com.au/wc-api/v3/products?filter[limit]=2",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${consumerKey}:${secretKey}`).toString("base64")}`,
        },
      }
    );
    const data = await response.json();
    console.log("products", data.products[0]);

    const formattedData: ProductBulkCreateInput[] = data.products.map((product) => {
      return {
        name: product.title,
        description: product.description,
        media: product.images.map((image) => {
          return {
            alt: image.alt,
            mediaUrl: image.src,
          };
        }),
        productType: "UHJvZHVjdFR5cGU6MQ==",
        channelListings: [
          {
            channelId: "Q2hhbm5lbDoy",
            isPublished: true,
            publishedAt: new Date().toISOString(),
            visibleInListings: true,
            isAvailableForPurchase: true,
            availableForPurchaseAt: new Date().toISOString(),
          },
        ],
        variants: [
          {
            attributes: [],
            sku: product.id.toString(),
            name: product.title,
            trackInventory: true,
            stocks: [
              {
                warehouse: "V2FyZWhvdXNlOjcwYTc3MzJmLWJlZDgtNGNkOC1iZmQ2LWYwYzNlNzY1MjZlOQ==",
                quantity: 100,
              },
            ],
            channelListings: [
              {
                channelId: "Q2hhbm5lbDoy",
                price: parseFloat(product.sale_price ? product.sale_price : product.price),
                costPrice: parseFloat(product.price),
              },
            ],
          },
        ],
        category: product.categories[0],
      };
    });

    console.log("formattedData", formattedData);

    res.status(200).json(formattedData);
  } catch (error) {
    res
      .status(500)
      .json({ error: (error as Error).message || "Failed to fetch products from WordPress" });
  }
}
