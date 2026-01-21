
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LeadsService } from '../../leads/leads.service';
@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
})
export class CreateUsersComponent implements OnInit {

  form: FormGroup;
  loading: boolean = false;
  heading: string = 'Create User';
  actionType: string = 'create';
  userId: any;

  roleOptions = [
    { label: 'Admin', value: 1 },
    { label: 'Sales', value: 2 },
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private leadsService: LeadsService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = params['id'];
        this.actionType = 'update';
        this.heading = 'Update User';
        this.getUserById();
      }
    });
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      // password: ['', Validators.required],
      role: [1, Validators.required],
    });
  }


   submit() {
    if (this.form.invalid) return;

    this.loading = true;

    if (this.actionType === 'create') {
      this.leadsService.createUser(this.form.value).subscribe(() => {
        this.loading = false;
        this.router.navigate(['admin/users']);
      });
    } else {
      this.leadsService.updateUser(this.userId, this.form.value).subscribe(() => {
        this.loading = false;
        this.router.navigate(['admin/users']);
      });
    }
  }
  getUserById() {
  this.loading = true;

  this.leadsService.getUserById(this.userId).subscribe((data: any) => {
    this.form.patchValue({
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: Number(data.role),
    });

    this.loading = false;
  });
}

  //   getUserById() {
  //   this.loading = true;
  //   this.leadsService.getUserById(this.userId).subscribe(data => {
  //     this.form.patchValue({
  //       name: data.name,
  //       email: data.email,
  //       phone: data.phone,
  //       role: Number(data.role)
  //     });
  //     this.loading = false;
  //   });
  // }


  goBack() {
    this.location.back();
  }
}
