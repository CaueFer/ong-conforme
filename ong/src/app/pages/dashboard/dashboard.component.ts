import { Component, OnInit, ViewChild } from "@angular/core";
import { columnChart, radialBarChart } from "./data";
import { ChartType } from "../../core/models/charts.model";
import { DatabaseService } from "src/app/core/services/database/database.service";
import { DoacaoModel } from "../../core/models/doacao.model";
import { HistoricoModel } from "../doacoes/historico/historico.model";
import { pt } from "date-fns/locale";
import {
  format,
  isSameDay,
  isSameMonth,
  isSameYear,
  parseISO,
  startOfDay,
} from "date-fns";
import { setTime } from "ngx-bootstrap/chronos/utils/date-setters";
import { ModalDirective } from "ngx-bootstrap/modal";
import {
  FormBuilder,
  FormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import Swal from "sweetalert2";
import { BsDropdownDirective } from "ngx-bootstrap/dropdown";
import { NgbDropdown } from "@ng-bootstrap/ng-bootstrap";
import { ThemeService } from "src/app/core/services/theme/theme.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  @ViewChild("editMetaDropdown") editMetaDropdown: NgbDropdown;
  editMetaForm: FormGroup;

  date: Date;
  actualMonth: string;
  actualDay: number;

  collumnBarChart: ChartType;
  metaMoney: ChartType;
  statData: any;

  isActive: string;

  todayItem: HistoricoModel[] = [];
  historico: HistoricoModel[] = [];
  historicoNotToday: HistoricoModel[] = [];
  historicoByCategoria: any = {};
  doacoes: DoacaoModel[] = [];
  doacoesMonetaria: DoacaoModel[] = [];
  moneyQntd: number = 0;
  moneyMetaAll: number = 0;
  moneyMetaPorcent: any;

  historicoLength: Number;
  doacoesLength: Number;
  familiasLength: Number;
  disableSubmitBtn: boolean = false;
  submitted: boolean = false;
  metaSaved: boolean = true;

  actualMetaValue: any;

  isDark: boolean = false;

  constructor(
    private _databaseService: DatabaseService,
    private formBuilder: FormBuilder,
    private _themeService: ThemeService
  ) {
    this.editMetaForm = this.formBuilder.group({
      metaQntd: ["", [Validators.required]],
      metaName: ["", [Validators.required]],
      id: [""],
    });
  }
  get form() {
    return this.editMetaForm.controls;
  }

  ngOnInit() {
    this.date = new Date();
    const fullMonthName: string = this.date.toLocaleString("pt-BR", {
      month: "long",
    });
    this.actualMonth =
      fullMonthName.charAt(0).toUpperCase() + fullMonthName.slice(1);
    this.actualDay = this.date.getDate();

    this.fetchData();

    this.getTheme();
  }

  ngAfterViewInit() {}

  private fetchData() {
    this.metaMoney = radialBarChart;
    this.collumnBarChart = columnChart;
    this.isActive = "year";

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
        this.historico.reverse();

        const findedItemIndex = this.historico.findIndex((item) => {
          const dataItem = new Date(item.data);
          const hoje = new Date();
          return dataItem.setHours(0, 0, 0, 0) === hoje.setHours(0, 0, 0, 0);
        });

        if (findedItemIndex !== -1) {
          const findedItem = this.historico[findedItemIndex];
          this.todayItem.push(findedItem);
        }

        this.historico.forEach((item) => {
          const dataItem = new Date(item.data);
          const hoje = new Date();

          if (dataItem.setHours(0, 0, 0, 0) !== hoje.setHours(0, 0, 0, 0))
            this.historicoNotToday.push(item);
        });
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
      },
    });

    this._databaseService.getDoacao().subscribe({
      next: (value) => {
        this.doacoes = value;

        this.doacoesMonetaria = value.filter(
          (item) => item.categoria === "monetario"
        );

        if (this.doacoesMonetaria) {
          this.doacoesMonetaria.forEach((doacao) => {
            this.moneyQntd += Number(doacao.qntd);
          });
        }

        this.getMetaFixa();
      },
    });
  }

  getMetaFixa() {
    this._databaseService.getMetaFixa(1).subscribe({
      next: (value) => {
        this.editMetaForm.get("metaQntd").setValue(value[0].qntdMetaAll);
        this.editMetaForm.get("metaName").setValue(value[0].nome);
        this.editMetaForm.get("id").setValue(value[0].id);

        this.moneyMetaAll = this.editMetaForm.get("metaQntd").value;

        if (this.moneyMetaAll > 0) {
          const temp = ((this.moneyQntd / this.moneyMetaAll) * 100).toFixed(1);
          this.metaMoney.series = [temp];
          this.moneyMetaPorcent = Number(this.metaMoney.series).toFixed(0);
        }

        this.statsReport();
      },
      error: (err) => {},
    });
  }

  statsReport() {
    const temp = this.historico.filter((item) => item.tipoMov === "saida");
    if (temp) {
      const doados = temp.length;
      this.statData = [
        {
          icon: "bx bx-copy-alt",
          title: "Doações em Estoque",
          value: this.doacoesLength,
        },
        {
          icon: "bx bx-archive-in",
          title: "Itens doados",
          value: `+${doados}`,
        },
        {
          icon: "bx bx-group",
          title: "Familias Ajudadas",
          value: "+" + this.familiasLength,
        },
      ];
    }

    const categorias = ["monetario", "alimento", "roupa", "mobilia", "outro"];
    let allRequestsCompleted = 0;

    categorias.forEach((categoria) => {
      this._databaseService.getHistoricoByCategoria(categoria).subscribe({
        next: (value) => {
          this.historicoByCategoria[categoria] = value.map((item) => ({
            ...item,
            dataParsed: parseISO(item.data),
          }));
        },
        error: (err) => {},
        complete: () => {
          allRequestsCompleted++;
          if (allRequestsCompleted === categorias.length) {
            this.yearlyreport();
          }
        },
      });
    });
  }

  weeklyreport() {
    this.isActive = "week";

    const daysWeek = [
      "Domingo",
      "Segunda-feira",
      "Terca-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sabado",
    ];

    this.collumnBarChart.xaxis = {
      categories: daysWeek,
    };

    const filtros = ["mobilia", "roupa", "alimento", "monetario", "outro"];

    const lengthCategoriaPorMes = {};

    filtros.forEach((categoria) => {
      lengthCategoriaPorMes[categoria] = {};

      this.historicoByCategoria[categoria].forEach((item) => {
        const itemDate = new Date(item.dataParsed);

        const currentWeek = this.getWeekNumber(new Date());
        const itemWeek = this.getWeekNumber(itemDate);

        if (currentWeek === itemWeek) {
          const dayOfWeek = itemDate.getDay();
          if (dayOfWeek >= 0 && dayOfWeek <= 6) {
            const dia = daysWeek[dayOfWeek];
            lengthCategoriaPorMes[categoria][dia] =
              (lengthCategoriaPorMes[categoria][dia] || 0) + 1;
          }
        }
      });
    });

    this.collumnBarChart.series = filtros.map((categoria) => ({
      name: categoria.charAt(0).toUpperCase() + categoria.slice(1),
      data: daysWeek.map(
        (weekD) => lengthCategoriaPorMes[categoria][weekD] || 0
      ),
    }));
  }

  monthlyreport() {
    this.isActive = "month";

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dias = Array.from({ length: daysInMonth }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    );

    this.collumnBarChart.xaxis = {
      categories: dias,
    };

    const filtros = ["mobilia", "roupa", "alimento", "monetario", "outro"];

    const lengthCategoriaPorMes = {};

    filtros.forEach((categoria) => {
      lengthCategoriaPorMes[categoria] = {};

      this.historicoByCategoria[categoria].forEach((item) => {
        const itemDate = new Date(item.dataParsed);

        const actualMonth = new Date().getMonth();
        const itemMonth = itemDate.getMonth();

        if (actualMonth === itemMonth) {
          const day = itemDate.getDate();

          if (day >= 1 && day <= daysInMonth) {
            const dia = dias[day - 1];
            lengthCategoriaPorMes[categoria][dia] =
              (lengthCategoriaPorMes[categoria][dia] || 0) + 1;
          }
        }
      });
    });

    this.collumnBarChart.series = filtros.map((categoria) => ({
      name: categoria.charAt(0).toUpperCase() + categoria.slice(1),
      data: dias.map((dia) => lengthCategoriaPorMes[categoria][dia] || 0),
    }));
  }

  yearlyreport() {
    this.isActive = "year";

    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    this.collumnBarChart.xaxis = {
      categories: meses,
    };

    const filtros = ["mobilia", "roupa", "alimento", "monetario", "outro"];

    const lengthCategoriaPorMes = {};

    filtros.forEach((categoria) => {
      lengthCategoriaPorMes[categoria] = {};

      this.historicoByCategoria[categoria].forEach((item) => {
        const itemDate = new Date(item.dataParsed);

        const currentYear = new Date().getFullYear();
        const itemYear = itemDate.getFullYear();

        if (currentYear === itemYear) {
          const month = itemDate.getMonth();

          if (month >= 0 && month <= 11) {
            const monthName = meses[month];
            lengthCategoriaPorMes[categoria][monthName] =
              (lengthCategoriaPorMes[categoria][monthName] || 0) + 1;
          }
        }
      });
    });

    this.collumnBarChart.series = filtros.map((categoria) => ({
      name: categoria.charAt(0).toUpperCase() + categoria.slice(1),
      data: meses.map((mes) => lengthCategoriaPorMes[categoria][mes] || 0),
    }));
  }

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  editDropdown(isOpen: boolean) {
    this.submitted = false;
    if (isOpen) {
      this.actualMetaValue = this.form["metaQntd"].value;
    } else {
      this.cancelEdit();
    }
  }

  submitEdit() {
    this.submitted = true;
    this.metaSaved = false;

    if (this.editMetaForm.pristine) {
      setTimeout(() => {
        this.metaSaved = true;

        setTimeout(() => {
          this.submitted = false;

          this.editMetaDropdown?.close();
        }, 700);
      }, 500);

      return;
    }
    if (this.editMetaForm.valid) {
      const itemToAtt = {
        nome: this.form["metaName"].value,
        qntd: this.form["metaQntd"].value,
        id: this.form["id"].value,
      };

      itemToAtt.qntd <= 0 ? null : itemToAtt.qntd;

      this.actualMetaValue = itemToAtt.qntd;

      this._databaseService
        .updateMetaFixa(itemToAtt)
        .then((resolve) => {
          this.getMetaFixa();

          setTimeout(() => {
            this.metaSaved = true;

            setTimeout(() => {
              this.submitted = false;

              this.editMetaDropdown?.close();
            }, 500);
          }, 1000);
        })
        .catch((err) => {});
    }

    setTimeout(() => {
      this.submitted = false;
    }, 2500);
  }

  cancelEdit() {
    this.form["metaQntd"].setValue(this.actualMetaValue);

    this.editMetaDropdown.close();
  }

  alertSucess(msg1, msg2: string) {
    Swal.fire(msg1, msg2, "success");
  }

  getTheme() {
    const theme = this._themeService.getTheme().subscribe((theme) => {
      if (theme === "dark") this.isDark = true;
      else this.isDark = false;
    });
  }
}
