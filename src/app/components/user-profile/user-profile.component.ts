import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {User} from "../../model/User";
import {UserService} from "../../services/user.service";
import {concatMap} from "rxjs/operators";
import {HotToastService} from "@ngneat/hot-toast";
import {FormControl, FormGroup} from "@angular/forms";
import {untilDestroyed} from "@ngneat/until-destroy";



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user$ = this.userService.currentUserProfile$;

  userForm = new FormGroup({
    uid: new FormControl(''),
    displayName: new FormControl(''),
    phoneNumber: new FormControl(''),
  })

  constructor(private authService: AuthenticationService,
              private userService: UserService,
              private toast: HotToastService) { }

  ngOnInit(): void {
    this.userService.currentUserProfile$.pipe(
      untilDestroyed(this)).subscribe((user) => {
        this.userForm.patchValue({...user});
      });
  }

  uploadImage(event: any, user: User) {
    this.userService.uploadImage(event.target.files[0], `images/profile/${user.uid}`).pipe(
      this.toast.observe(
        {
          loading: 'Please, weight...',
          success: 'Image uploaded!',
          error: 'There was an error in updating the profile'
        }
      ),
      concatMap((profileImage) => this.userService.update({uid: user.uid , profileImage}))
    ).subscribe();
  }

  saveProfile() {
    const data = this.userForm.value;
    this.userService.update(data).pipe(
      this.toast.observe({
        loading: 'Updating...',
        success: 'Updated',
        error: 'There was an error'
      })
    ).subscribe();
  }

}
