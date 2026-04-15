import { Link } from "@/tw";
import type { ChatListItemMenuProps } from "./ChatListItemMenu";

export function ChatListItemMenu({
  href,
  onDelete,
  children,
}: ChatListItemMenuProps) {
  return (
    <Link href={href}>
      <Link.Trigger>{children}</Link.Trigger>
      <Link.Menu>
        <Link.MenuAction icon="trash" destructive onPress={onDelete}>
          Delete
        </Link.MenuAction>
      </Link.Menu>
    </Link>
  );
}
