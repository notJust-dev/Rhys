import type { Href } from "expo-router";
import type { ReactNode } from "react";

export type ChatListItemMenuProps = {
  href: Href;
  onDelete: () => void;
  children: ReactNode;
};

export function ChatListItemMenu(_props: ChatListItemMenuProps): null {
  return null;
}
