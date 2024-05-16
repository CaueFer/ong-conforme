import { Component, OnInit } from "@angular/core";
import { columnChart, radialBarChart } from "./data";
import { ChartType } from "../../core/models/charts.model";
import { DatabaseService } from "src/app/core/services/database/database.service";
import { DoacaoModel } from "../../core/models/doacao.model";
import { HistoricoModel } from "../doacoes/historico/historico.model";
import { pt } from "date-fns/locale";
import { format, parseISO } from "date-fns";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  date: Date;
  actualMonth: string;
  actualDay: number;

  sentBarChart: ChartType;
  monthlyEarningChart: ChartType;
  statData: any;

  isActive: string;

  historico: HistoricoModel[] = [];
  todayItem: HistoricoModel[] = [];
  doacoes: DoacaoModel[] = [];
  doacoesMoney: DoacaoModel[] = [];

  historicoLength: Number;
  doacoesLength: Number;
  familiasLength: Number;

  constructor(private _databaseService: DatabaseService) {}

  ngOnInit() {
    this.date = new Date();
    const fullMonthName: string = this.date.toLocaleString("pt-BR", {
      month: "long",
    });
    this.actualMonth =
      fullMonthName.charAt(0).toUpperCase() + fullMonthName.slice(1);
    this.actualDay = this.date.getDate();

    this.fetchData();
  }

  ngAfterViewInit() {}

  private fetchData() {
    this._databaseService.getHistorico().subscribe({
      next: (value) => {
        const dateFormat = "dd  MMM";

        this.historico = value.map((item) => {
          const dataFormatada = format(new Date(item.data), dateFormat, {
            locale: pt,
          });

          const nameFormated =
            item.doadorName.charAt(0).toUpperCase() + item.doadorName.slice(1);

          return {
            ...item,
            dataFormated: dataFormatada,
            doadorName: nameFormated,
          };
        });

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const findedItem = this.historico.find((item) => {
          const dataItem = parseISO(item.data);
          dataItem.setHours(0, 0, 0, 0);
          return dataItem.getTime() === hoje.getTime();
        });
        this.todayItem.push(findedItem);
      },
      error: () => {},
    });

    this._databaseService.getTableLength().subscribe({
      next: (value) => {
        if (value) {
          this.familiasLength = value.totalFamilias;
          this.doacoesLength = value.totalDoacoes;
          this.historicoLength = value.totalHistoricos;
        }
        this.statsReport();
      },
    });

    this._databaseService.getDoacao().subscribe({
      next: (value) => {
        this.doacoes = value;

        this.doacoesMoney = value.filter(item => item.categoria === 'monetario');
      },
    });

    this.sentBarChart = columnChart;
    this.monthlyEarningChart = radialBarChart;
    this.isActive = "year";
  }

  statsReport() {
    this.statData = [
      {
        icon: "bx bx-copy-alt",
        title: "Doações Total",
        value: this.doacoesLength,
      },
      {
        icon: "bx bx-archive-in",
        title: "Arrecadação Total",
        value: "R$5, 723",
      },
      {
        icon: "bx bx-group",
        title: "Familias Ajudadas",
        value: "+" + this.familiasLength,
      },
    ];
  }

  weeklyreport() {
    this.isActive = "week";
    this.sentBarChart.series = [
      {
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48],
      },
      {
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18],
      },
      {
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22],
      },
    ];
  }

  monthlyreport() {
    this.isActive = "month";
    this.sentBarChart.series = [
      {
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48],
      },
      {
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22],
      },
      {
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18],
      },
    ];
  }

  yearlyreport() {
    this.isActive = "year";
    this.sentBarChart.series = [
      {
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22],
      },
      {
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18],
      },
      {
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48],
      },
    ];
  }
}
