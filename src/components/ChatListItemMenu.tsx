import type { Href } from "expo-router";
import type { ReactNode } from "react";

export type ChatListItemMenuProps = {
  href: Href;
  onEdit: () => void;
  onDelete: () => void;
  children: ReactNode;
};

export function ChatListItemMenu({ children }: ChatListItemMenuProps) {
  return children;
}
