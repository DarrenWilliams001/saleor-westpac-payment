import { Box, Button, Text } from "@saleor/macaw-ui";
import { useQuery } from "urql";
import { GetCategoryBySlugDocument, useBulkCreateProductsMutation } from "../../generated/graphql";
import { htmlToEditorJs } from "../lib/htmlparser";

export default function Importer() {
  const [result, createProduct] = useBulkCreateProductsMutation();
  const [categoryResult, getCategory] = useQuery({ query: GetCategoryBySlugDocument });
  const getProducts = async () => {
    const response = await fetch("/api/getProducts");
    const data = await response.json();
    console.log(data);

    const category = (category: string) => {
      getCategory({
        variables: {
          input: category.replace("&amp;", "&").split(" ").join("-"),
        },
      });
    };

    data.forEach((product) => {
      category(product.category);
    });

    console.log("category", categoryResult);

    createProduct({
      input: data.map((product) => ({
        ...product,
        description: JSON.stringify(htmlToEditorJs(product.description)),
      })),
    });

    console.log(result);
  };

  return (
    <Box display={"flex"} flexDirection={"column"} gap={4} width={32}>
      <Button type="button" onClick={getProducts}>
        Import Products
      </Button>
      {result.data?.productBulkCreate?.count && (
        <Text>Products created: {result.data?.productBulkCreate?.count}</Text>
      )}
    </Box>
  );
}
