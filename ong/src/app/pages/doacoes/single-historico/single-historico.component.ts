import { Component, Input, ViewChild } from "@angular/core";
import { DoacaoModel } from "../gerenciador/doacao.model";
import { BehaviorSubject, Observable, filter } from "rxjs";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import {
  BsModalRef,
  BsModalService,
  ModalDirective,
} from "ngx-bootstrap/modal";
import { DatePipe, Location } from "@angular/common";
import { DatabaseService } from "src/app/core/services/database/database.service";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { DateService } from "src/app/core/services/date/date-service.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { defineLocale, ptBrLocale } from "ngx-bootstrap/chronos";
import { HistoricoModel } from "../historico/historico.model";
import { ActivatedRoute, Router } from "@angular/router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChartType } from "../../../core/models/charts.model";
import { metaChart } from "./data";

@Component({
  selector: "app-single-historico",
  standalone: false,
  templateUrl: "./single-historico.component.html",
  styleUrl: "./single-historico.component.scss",
})
export class SingleHistoricoComponent {
  @Input() doacaoId: any;

  tooltip: string = "";
  private doacaoIdSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  doacaoIdObservable$ = this.doacaoIdSubject.asObservable();

  modalRef?: BsModalRef;

  historicoForm!: UntypedFormGroup;
  metaForm!: UntypedFormGroup;
  submitted = false;

  // Table data
  content?: any;
  historicos?: HistoricoModel[] = [];
  historicosIn?: HistoricoModel[] = [];
  historicosOut?: HistoricoModel[] = [];
  ordersList!: Observable<DoacaoModel[]>;
  total: Observable<number>;

  isInput: boolean = true;
  addInitialMov: boolean = false;
  selectedCategoria: string = "";

  itemMovs: Object = {};

  isLoadingList: boolean = true;
  today: Date = new Date();

  @ViewChild("showModal", { static: false }) showModal?: ModalDirective;
  @ViewChild("editItemModal", { static: false }) editItemModal?: ModalDirective;
  @ViewChild("removeItemModal", { static: false })
  removeItemModal?: ModalDirective;
  @ViewChild("movimentacaoModal", { static: false })
  movimentacaoModal?: ModalDirective;

  disableSubmitBtn: boolean = false;

  txtSearch: string;
  filteredCategoria: string = "";
  bsRangeFilterValue: string = "";

  selectedHistorico: Number;
  deletId: any;
  editedId: any;
  editedCategoria: string = "";
  filterSelectedRangeDate: Date[];

  currentPage = 1;
  itemsPerPage = 4;

  targetId: any;
  selectedDoacao: any;
  doacao: DoacaoModel[];

  metaChart: ChartType;

  actualDate: Date = new Date();
  formattedDate: string;
  metaQntd: Number = 0;
  metaResult: string = "";
  metaIsEditing: boolean = false;
  metaSaved: boolean = false;
  customDateString: string;

  constructor(
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private _databaseService: DatabaseService,
    private localeService: BsLocaleService,
    private _dateService: DateService,
    private _toastService: ToastrService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.historicoForm = this.formBuilder.group({
      id: [""],
      data: ["", [Validators.required]],
      qntd: [Number, [Validators.required]],
      tipoMov: ["", [Validators.required]],
      doadorName: ["", [Validators.required]],
    });

    this.metaForm = this.formBuilder.group({
      metaID: [""],
      metaQntd: ["", [Validators.required]],
      metaDate: ["", [Validators.required]],
    });

    defineLocale("pt-br", ptBrLocale);
    this.localeService.use("pt-br");
  }

  ngOnInit() {
    this.isLoadingList = true;
    this.targetId = null;

    this.route.queryParams.subscribe((params) => {
      const id = params["id"];

      this.targetId = id;
      this.updateListHistorico(this.targetId);
    });

    this.formattedDate = format(this.actualDate, "d',' MMMM 'de' yyyy", {
      locale: ptBR,
    });

    this.metaChart = metaChart;
  }

  /**
   * Form data get
   */
  get form() {
    return this.metaForm.controls;
  }

  submitMeta() {
    this.submitted = true;

    if (this.metaForm.invalid) {
      setTimeout(() => {
        this.submitted = false;
      }, 2000);

      return;
    }

    if (this.metaForm.valid) {
      const qntd = this.metaForm.controls["metaQntd"].value;
      const data = this.metaForm.controls["metaDate"].value;
      const doacao_id = this.targetId;

      const metaValues = {
        qntd,
        data,
        doacao_id,
      };

      this._databaseService
        .updateMetaInDoacao(metaValues)
        .then(() => {
          this.submitted = false;
          this.metaSaved = true;
          this.metaIsEditing = false;

          this.metaForm.reset();
          this.updateListHistorico(this.targetId);

          setTimeout(() => {
            this.metaSaved = false;
          }, 2000);

          this.showToast("Meta atualizada.");
        })
        .catch((reject) => {});
    }
  }

  updateMetaValues() {
    const qntd =
      isNaN(this.doacao[0].metaQntd) || this.doacao[0].metaQntd < 0
        ? 0
        : this.doacao[0].metaQntd;
    const data = this.doacao[0].metaDate
      ? new Date(this.doacao[0].metaDate)
      : "";

    this.metaForm.reset({
      metaQntd: qntd,
      metaDate: data,
    });

    if (data != "") {
      const day = ("0" + data.getDate()).slice(-2);
      const month = ("0" + (data.getMonth() + 1)).slice(-2);
      const year = data.getFullYear();
      this.customDateString = `${day}/${month}/${year}`;
    } else {
      this.customDateString = "Data final";
    }

    this.metaIsEditing = false;
  }

  metaCalc() {
    this.metaQntd = this.metaForm.controls["metaQntd"].value;

    if (!this.doacao || this.doacao.length === 0) {
      this.metaResult = "Dados de doação inválidos";
      return;
    }
    
    if (Number(this.metaQntd) <= 0 || Number(this.doacao[0].qntd) <= 0) {
      this.metaResult = "Nenhuma meta definida.";

      this.metaChart.series = [0];
    } else {
      const quantidadeFalta = Math.floor(
        (Number(this.doacao[0].qntd) / Number(this.metaQntd)) * 100
      );

      if (quantidadeFalta < 100) {
        this.metaResult = `${quantidadeFalta}% da meta total`;
      } else {
        this.metaResult = "Meta atingida!";
      }

      this.metaChart.series = [quantidadeFalta];
    }
  }

  onFilterDateChange(dates: Date[]) {
    this.filterSelectedRangeDate = dates;

    if (dates === null) return;

    if (dates.length === 2) {
      const startDate = dates[0];
      const endDate = dates[1];

      const startDay = ("0" + startDate.getDate()).slice(-2);
      const startMonth = ("0" + (startDate.getMonth() + 1)).slice(-2);
      const startYear = startDate.getFullYear();

      const endDay = ("0" + endDate.getDate()).slice(-2);
      const endMonth = ("0" + (endDate.getMonth() + 1)).slice(-2);
      const endYear = endDate.getFullYear();

      const formattedStartDate = `${startDay}/${startMonth}/${startYear}`;
      const formattedEndDate = `${endDay}/${endMonth}/${endYear}`;

      this.bsRangeFilterValue = `${formattedStartDate} - ${formattedEndDate}`;
    } else {
      console.error("O intervalo de datas não contém duas datas.");
    }
  }

  pageChanged($event: any) {
    this.currentPage = $event;
  }

  updateListHistorico(idReceived: any) {
    this.isLoadingList = true;

    this.doacao = [];
    this._databaseService.getSingleDoacao(idReceived).subscribe({
      next: (values) => {
        if (values) {
          this.doacao = values;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.historicos = [];
    this.historicosIn = [];
    this.historicosOut = [];
    this._databaseService.getHistorico().subscribe({
      next: (values) => {
        if (values) {
          values.forEach((value) => {
            const date = new Date(value.data);
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();

            value.data = `${day}/${month}/${year}`;

            value.itemName = this.doacao[0].itemName;
          });

          const historicosTemp = values.filter(
            (e) => e.doacao_id.toString() === idReceived
          );
          if (historicosTemp.length > 0) {
            this.historicos.push(...historicosTemp);
          }

          const historicosIn = this.historicos.filter(
            (e) => e.tipoMov === "entrada"
          );
          this.historicosIn.push(...historicosIn);

          const historicosOut = this.historicos.filter(
            (e) => e.tipoMov === "saida"
          );
          this.historicosOut.push(...historicosOut);

          this.isLoadingList = false;

          this.updateMetaValues();
          this.metaCalc();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  checkUncheckAll(ev: any) {
    if (this.historicos.length > 0)
      this.historicos.forEach((historico: HistoricoModel) => {
        historico.marked = ev.target.checked;
      });
  }

  checkUncheckOut(ev: any) {
    if (this.historicosOut.length > 0)
      this.historicosOut.forEach((historico: HistoricoModel) => {
        historico.marked = ev.target.checked;
      });
  }

  checkUncheckIn(ev: any) {
    if (this.historicosIn.length > 0)
      this.historicosIn.forEach((historico: HistoricoModel) => {
        historico.marked = ev.target.checked;
      });
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: "modal-md" });
  }

  removeAccents(value: string) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  voltar() {
    this.location.back();
  }

  showToast(text: string) {
    var message = text;

    this._toastService.show(message, "", {
      timeOut: 5000, // ms
      closeButton: false,
      progressBar: true,
      tapToDismiss: true,
      positionClass: "toast-bottom-right",
      toastClass: "opacity-100 bg-dark ngx-toastr",
    });
  }

  closeToast() {
    this._toastService.clear();
  }

  alertSucess(msg1, msg2: string) {
    Swal.fire(msg1, msg2, "success");
  }
}
