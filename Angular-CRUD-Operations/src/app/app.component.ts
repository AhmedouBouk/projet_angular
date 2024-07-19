import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from './models/user';
import { ModeEnum } from './models/mode.enum';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  // Reactive form setup
  form = this.fb.group({
    id: [0],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
  });

  ModeEnum = ModeEnum; // Expose ModeEnum for template
  users!: User[]; // List of users
  mode = ModeEnum.NON; // Current mode (add/edit)

  ngOnInit(): void {
    this.setUsers();
  }

  // Fetch users from the service
  private setUsers() {
    this.users = this.userService.getAllUsers();
  }

  // Switch to add mode
  addNewUser() {
    this.mode = ModeEnum.ADD;
  }

  // Switch to edit mode and populate form
  editUser(user: User) {
    this.mode = ModeEnum.EDIT;
    this.form.setValue(user);
  }

  // Save user data (add or update)
  saveUser() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const user = this.form.value as User;

    if (this.mode === ModeEnum.ADD) {
      this.userService.addUser(user);
    } else {
      this.userService.updateUser(user);
    }
    this.setUsers();
    this.cancel();
  }

  // Remove user and update the list
  removeUser(user: User) {
    this.userService.deleteUser(user);
    this.setUsers();
  }

  // Reset form and mode
  cancel() {
    this.form.reset();
    this.mode = ModeEnum.NON;
  }
  trackUser(index: number, user: any): number {
    return user.id;
  }
}
