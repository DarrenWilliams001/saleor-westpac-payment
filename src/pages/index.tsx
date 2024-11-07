import { Box, Text } from "@saleor/macaw-ui";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import Importer from "../components/importer";

const IndexPage: NextPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Box padding={8} display={"flex"} flexDirection={"column"} gap={4}>
      <Text as="h1" style={{ fontSize: "2rem", fontWeight: "bold" }}>
        Product Importer
      </Text>
      <Text as="p">
        This app allows you to import products from a wordpress site into your Saleor instance.
      </Text>

      <Importer />
    </Box>
  );
};

export default IndexPage;
