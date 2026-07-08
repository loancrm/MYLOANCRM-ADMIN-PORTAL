import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeadsService } from '../../leads/leads.service';
import { RoutingService } from 'src/app/services/routing-service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  requirementId: any;

  requirement: any = {};
  loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private leadsService: LeadsService,
    private routingService: RoutingService,
    private location: Location
  ) {}

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {

      this.requirementId = params['id'];

      this.getRequirement();
                                      
    });

  }

  getRequirement() {

    this.leadsService
      .getClientRequirementById(this.requirementId)
      .subscribe((data: any) => {

        this.requirement = data;

      });

  }
  updateRequirement(): void {

  this.routingService.handleRoute(
    'client-requirements/update/' + this.requirement.id,
    null
  );

}

goBack(): void {

  this.location.back();

}
  

}