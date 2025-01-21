import { Box, Text } from "@saleor/macaw-ui";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const IndexPage: NextPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Box padding={8} display={"flex"} flexDirection={"column"} gap={4}>
      <Text as="h1" style={{ fontSize: "2rem", fontWeight: "bold" }}>
        Westpac Payment
      </Text>
    </Box>
  );
};

export default IndexPage;
