import { Component } from "@angular/core";
import { nextDay } from "date-fns";
import { DatabaseService } from "src/app/core/services/database/database.service";
import { FamiliaModel } from "./familia.model";

@Component({
  selector: "app-family-dashboard",
  standalone: false,
  templateUrl: "./family-dashboard.component.html",
  styleUrl: "./family-dashboard.component.scss",
})
export class FamilyDashboardComponent {
  
  familias: FamiliaModel[] = [];
  submitted = false;
  currentPage = 1;
  itemsPerPage = 10;

  isLoadingList: boolean = false;
  bsRangeFilterValue: any;
  txtSearch: string;

  constructor(private _databaseService: DatabaseService) {}
  ngOnInit() {
    this._databaseService.getFamilias().subscribe({
      next: (familias) => {
        this.familias = familias;
        console.log(this.familias);
      },
      error: (error) => {},
    });
  }
}
