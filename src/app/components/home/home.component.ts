import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {FormControl} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {combineLatest, Observable, of} from "rxjs";
import {map, startWith, switchMap, take, tap} from "rxjs/operators";
import {User} from "../../model/User";
import {RoomService} from "../../services/room.service";
import {Room} from "../../model/Room";
import {Message} from "../../model/Message";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {rejects} from "assert";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('endOfChat')
  endOfChat!: ElementRef;

  user$ = this.authService.currentUser$;
  usersRooms$ = this.roomService.usersRooms$;
  messages$: Observable<Message[]> | undefined;


  searchControl = new FormControl('');
  roomListControl = new FormControl('');
  messageControl = new FormControl('');

  joke: any


  usersList$ = combineLatest([this.userService.users$, this.user$]).pipe(
    map(([users, user]) => users.filter((u) => u.uid !== user?.uid))
  );

  users$ = combineLatest([
    this.usersList$,
    this.searchControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([users, searchString]) => {
      return users.filter((u) =>
        u.displayName?.toLowerCase().includes(searchString.toLowerCase())
      );
    })
  );
  myStringifiedJson: any;

  selectedRoom$ = combineLatest([
    this.roomListControl.valueChanges,
    this.usersRooms$
  ]).pipe(
    map(([value, rooms]) => rooms.find(r => r.id === value[0]))
  );


  constructor(private authService: AuthenticationService,
              private userService: UserService,
              private roomService: RoomService,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.messages$ = this.roomListControl.valueChanges.pipe(
      map(value => value[0]),
      switchMap((roomId) => this.roomService.getChatMessages$(roomId)),
      tap(() => {
        this.scrollDown()
      })
    )
  }

  addRoom(chatter: User) {
    this.roomService.existRoom(chatter.uid).pipe(
      switchMap((roomId) => {
        if (!roomId) {
          return this.roomService.addRoom(chatter);
        } else {
          return of(roomId);
        }
      })
    ).subscribe((roomId) => {
      this.roomListControl.setValue([roomId]);
    });
  }


  send() {
    const message = this.messageControl.value;
    const selectedRoomId = this.roomListControl.value[0];

    if (message && selectedRoomId) {
      this.roomService.addMessage(selectedRoomId, message).subscribe(() => {
        this.scrollDown();
      });
      this.messageControl.setValue('');
      this.jokeTimeout();

    }
  }

  scrollDown() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({behavior: "smooth"})
      }
    }, 100);
  }

jokeTimeout() {
    setTimeout( () => {
    fetch('https://api.chucknorris.io/jokes/random')
      .then((res)=> res.json())
      .then(data => {
        this.joke = data.value;
        console.log(this.joke);
      });
  }, 10000);
}











}
