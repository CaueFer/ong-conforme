import { Component, OnInit } from "@angular/core";
import { emailSentBarChart, monthlyEarningChart } from './data';
import { ChartType } from "../../core/models/charts.model";
import { DatabaseService } from "src/app/core/services/database/database.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  date: Date;
  actualMonth: string;
  actualDay: number;

  sentBarChart: ChartType;
  monthlyEarningChart: ChartType;
  
  statData = [{
      "icon": "bx bx-copy-alt",
      "title": "Doações Total",
      "value": "1,235"
    }, {
      "icon": "bx bx-archive-in",
      "title": "Arrecadação Total",
      "value": "R$5, 723"
    }, {
      "icon": "bx bx-group",
      "title": "Familias Ajudadas",
      "value": "+300"
  }];

  isActive: string;

  constructor(private _databaseService: DatabaseService) {}

  ngOnInit() {
    this.date = new Date();
    const fullMonthName: string = this.date.toLocaleString("pt-BR", {
      month: "long",
    });
    this.actualMonth = fullMonthName.charAt(0).toUpperCase() + fullMonthName.slice(1);
    this.actualDay = this.date.getDate();

    this.fetchData();
  }

  ngAfterViewInit() {}

  private fetchData() {
    this.sentBarChart = emailSentBarChart;
    this.monthlyEarningChart = monthlyEarningChart;

    this.isActive = 'year';
  }

  weeklyreport() {
    this.isActive = 'week';
    this.sentBarChart.series =
      [{
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }, {
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }, {
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }];
  }

  monthlyreport() {
    this.isActive = 'month';
    this.sentBarChart.series =
      [{
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }, {
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }, {
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }];
  }

  yearlyreport() {
    this.isActive = 'year';
    this.sentBarChart.series =
      [{
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }, {
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }, {
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }];
  }
}
