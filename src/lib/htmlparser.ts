// Define types for the Editor.js block structure
interface BlockData {
  text: string;
}

interface HeaderData extends BlockData {
  level: number;
}

interface Block {
  type: "paragraph" | "header";
  data: BlockData | HeaderData;
}

interface EditorJsFormat {
  time: number;
  blocks: Block[];
  version: string;
}

// Function to convert HTML to Editor.js format
export function htmlToEditorJs(html: string): EditorJsFormat {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const blocks: Block[] = [];

  doc.body.childNodes.forEach((node) => {
    if (node.nodeName === "P") {
      blocks.push({
        type: "paragraph",
        data: {
          text: (node as HTMLElement).innerHTML,
        },
      });
    } else if (node.nodeName === "H1" || node.nodeName === "H2" || node.nodeName === "H3") {
      blocks.push({
        type: "header",
        data: {
          text: (node as HTMLElement).innerHTML,
          level: parseInt(node.nodeName[1], 10), // Parse the number from 'H1', 'H2', etc.
        },
      });
    }
  });

  return {
    time: Date.now(),
    blocks,
    version: "2.8.1",
  };
}
