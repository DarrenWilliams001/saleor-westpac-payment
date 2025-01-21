import { Box, Button, Input, Text } from "@saleor/macaw-ui";
import { useState } from "react";
import { useMutation, useQuery } from "urql";
import {
  AddCategoryDocument,
  GetCategoryBySlugDocument,
  useBulkCreateProductsMutation,
} from "../../generated/graphql";

export default function Importer() {
  const [result, createProduct] = useBulkCreateProductsMutation();
  const [loading, setLoading] = useState(false);
  const [productsFrom, setProductsFrom] = useState(0);
  const [productsTo, setProductsTo] = useState(0);

  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);

  const [categoryResult, getCategory] = useQuery({
    query: GetCategoryBySlugDocument,
    pause: true,
  });

  const [createCategoryResult, createCategory] = useMutation(AddCategoryDocument);

  const getCategories = async () => {
    setLoading(true);
    const response = await fetch("/api/postCategory", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    const categories = await Promise.all(
      data.map(async (category) => {
        if (category.name) {
          // Check if category exists
          const cat = await fetch(`/api/getCategory?input=${category.slug.replace("  ", " ")}`);

          const catData = await cat.json();

          // If category doesn't exist, create it
          if (!catData.category) {
            return category;
          }
          return;
        }
        return;
      })
    );
    setCategories(categories);
    setLoading(false);
  };

  const getProducts = async () => {
    setLoading(true);
    const response = await fetch("/api/getProducts", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ from: productsFrom, to: productsTo }),
    });

    const data = await response.json();

    // remove nulls
    const filteredData = data.filter((product) => product !== null);

    await createProduct({
      input: filteredData,
    });

    setLoading(false);

    // console.log(categoryResult);
    console.log(result);
  };

  const createCategories = async () => {
    setLoading(true);

    for (const category of categories) {
      if (category) {
        createCategory({
          input: { name: category.name.replace("  ", " "), slug: category.slug.replace("  ", " ") },
        });
      }
    }
    setLoading(false);
  };

  return (
    <Box display={"flex"} flexDirection={"column"} gap={4} width={"100%"}>
      <Button width={52} type="button" onClick={getCategories} disabled={loading}>
        {loading ? "Importing Categories..." : "Import Categories"}
      </Button>

      <Button width={52} type="button" onClick={createCategories} disabled={loading}>
        {loading ? "Creating Categories..." : "Create Categories"}
      </Button>
      {categories.length > 0 ? (
        <Text>Categories created: {categories.map((category) => category?.name).join(", ")}</Text>
      ) : null}

      <Box display={"flex"} flexDirection={"row"} gap={4}>
        <Button width={52} type="button" onClick={getProducts} disabled={loading}>
          {loading ? "Importing Products..." : "Import Products"}
        </Button>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"} gap={4}>
          <Text>From</Text>
          <Input
            type="number"
            value={productsFrom}
            onChange={(e) => setProductsFrom(parseInt(e.target.value))}
          />
        </Box>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"} gap={4}>
          <Text>To</Text>
          <Input
            type="number"
            value={productsTo}
            onChange={(e) => setProductsTo(parseInt(e.target.value))}
          />
        </Box>
      </Box>
      {result?.data?.productBulkCreate?.count ? (
        <Text>
          Products created:{" "}
          {result.data?.productBulkCreate?.count > 0
            ? result.data?.productBulkCreate?.count
            : "No products created"}
        </Text>
      ) : null}
    </Box>
  );
}
