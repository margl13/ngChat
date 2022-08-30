import {User} from "./User";
import {Timestamp} from "@angular/fire/firestore";

export interface Room {
  id: string;
  lastMessage?: string;
  lastMessageDate?: Date & Timestamp
  userIds: string[];
  users: User[];
  roomImage?: string | null;
  roomName?: string | null;
}
