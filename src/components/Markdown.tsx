import * as WebBrowser from "expo-web-browser";
import { EnrichedMarkdownText } from "react-native-enriched-markdown";

const markdownStyle = {
  text: { color: "#111827", fontSize: 16 },
  link: { color: "#2563eb" },
  code: { color: "#111827", backgroundColor: "#e5e7eb", fontFamily: "Menlo" },
  codeBlock: {
    color: "#111827",
    backgroundColor: "#e5e7eb",
    fontFamily: "Menlo",
  },
  blockquote: { borderColor: "#d1d5db" },
};

export function Markdown({ content }: { content: string }) {
  return (
    <EnrichedMarkdownText
      markdown={content}
      flavor="github"
      markdownStyle={markdownStyle}
      onLinkPress={({ url }) => WebBrowser.openBrowserAsync(url)}
    />
  );
}
