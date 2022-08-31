import {Injectable} from "@angular/core";
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  query,
  where,
  Timestamp,
  updateDoc, orderBy
} from "@angular/fire/firestore";
import {UserService} from "./user.service";
import {User} from "../model/User";
import {Observable} from "rxjs";
import {concatMap, map, take} from "rxjs/operators";
import {Room} from "../model/Room";
import {Message} from "../model/Message";


@Injectable({
  providedIn: 'root'
})

export class RoomService {

  constructor(private firestore: Firestore,
              private userService: UserService) {
  }

  addRoom(chatter: User): Observable<string> {
    const ref = collection(this.firestore, 'rooms');
    return this.userService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) => addDoc(ref, {
        userIds: [user?.uid, chatter?.uid],
        users: [
          {
            displayName: user?.displayName ?? '',
            profileImage: user?.profileImage ?? ''
          },
          {
            displayName: chatter?.displayName ?? '',
            profileImage: chatter?.profileImage ?? ''
          },
        ]
      })),
      map((ref) => ref.id)
    )
  }

  get usersRooms$(): Observable<Room[]> {
    const ref = collection(this.firestore, 'rooms');
    return this.userService.currentUserProfile$.pipe(
      concatMap((user) => {
        const userQuery = query(ref, where('userIds', 'array-contains', user?.uid))
        return collectionData(userQuery, {idField: 'id'}).pipe(
          map((rooms: any) => this.addNameAndImage(user?.uid, rooms))
        ) as Observable<Room[]>
      })
    )
  }

  addNameAndImage(userId: string | undefined, rooms: Room[]): Room[] {
    rooms.forEach((room: Room) => {
      const userIndex = room.userIds.indexOf(userId ?? '') === 0 ? 1 : 0;
      const {displayName, profileImage} = room.users[userIndex];
      room.roomName = displayName;
      room.roomImage = profileImage;
    });
    return rooms;
  }

  addMessage(roomId: string, message: string): Observable<any> {
    const ref = collection(this.firestore, 'rooms', roomId, 'messages');
    const roomRef = doc(this.firestore, 'rooms', roomId);
    const today = Timestamp.fromDate(new Date());
    return this.userService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) => addDoc(ref, {
        text: message,
        senderId: user?.uid,
        sentDate: today,
      })),
      concatMap(() => updateDoc(roomRef, {lastMessage: message, lastMessageDate: today}))
    )
  }

  getChatMessages$(roomId: string): Observable<Message[]> {
    const ref = collection(this.firestore, 'rooms', roomId, 'messages');
    const queryAll = query(ref, orderBy('sentDate', 'asc'))
    return collectionData(queryAll) as Observable<Message[]>;
  }

  existRoom(chatterId: string): Observable<string | null> {
    return this.usersRooms$.pipe(
      take(1),
      map((rooms) => {
        for (let i = 0; i < rooms.length; i++) {
          if (rooms[i].userIds.includes(chatterId)) {
            return rooms[i].id;
          }
        }

        return null;
      })
    )
  }
}
