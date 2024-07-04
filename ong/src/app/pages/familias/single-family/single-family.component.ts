import { DatePipe, Location } from "@angular/common";
import { Component, Input, ViewChild } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import {
  BsModalRef,
  BsModalService,
  ModalDirective,
} from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable } from "rxjs";
import { DatabaseService } from "src/app/core/services/database/database.service";
import { DateService } from "src/app/core/services/date/date-service.service";
import { ThemeService } from "src/app/core/services/theme/theme.service";
import Swal from "sweetalert2";
import { HistoricoModel } from "../../doacoes/historico/historico.model";
import { DoacaoModel } from "src/app/core/models/doacao.model";
import { defineLocale, ptBrLocale } from "ngx-bootstrap/chronos";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { metaChart } from "./data";
import { ChartType } from "src/app/core/models/charts.model";
import { FamiliaModel } from "../family-dashboard/familia.model";
@Component({
  selector: "app-single-family",
  standalone: false,
  templateUrl: "./single-family.component.html",
  styleUrl: "./single-family.component.scss",
})
export class SingleFamilyComponent {
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
  familias?: FamiliaModel[] = [];
  familia?: FamiliaModel = {};
  membros?: any[] = [];
  membrosFiltered?: any[] = [];
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

  isDark: boolean = false;

  constructor(
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private _databaseService: DatabaseService,
    private localeService: BsLocaleService,
    private _dateService: DateService,
    private _toastService: ToastrService,
    private route: ActivatedRoute,
    private location: Location,
    private _themeService: ThemeService,
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
      this.updateListFamilia(this.targetId);
    });

    this.formattedDate = format(this.actualDate, "d',' MMMM 'de' yyyy", {
      locale: ptBR,
    });

    this.metaChart = metaChart;

    this.getTheme();
  }

  /**
   * Form data get
   */
  get form() {
    return this.metaForm.controls;
  }

  // submitMeta() {
  //   this.submitted = true;

  //   if (this.metaForm.invalid) {
  //     setTimeout(() => {
  //       this.submitted = false;
  //     }, 2000);

  //     return;
  //   }

  //   if (this.metaForm.valid) {
  //     let qntd = this.metaForm.controls["metaQntd"].value;
  //     let data = this.metaForm.controls["metaDate"].value;
  //     const doacao_id = this.targetId;

  //     if (qntd === 0) {
  //       qntd = null;
  //       data = null;
  //     }

  //     const metaValues = {
  //       qntd,
  //       data,
  //       doacao_id,
  //     };

  //     this._databaseService
  //       .updateMetaInDoacao(metaValues)
  //       .then(() => {
  //         this.submitted = false;
  //         this.metaSaved = true;
  //         this.metaIsEditing = false;

  //         this.metaForm.reset();
  //         this.updateListHistorico(this.targetId);

  //         setTimeout(() => {
  //           this.metaSaved = false;
  //         }, 2000);

  //         this.showToast("Meta atualizada.");
  //       })
  //       .catch((reject) => {});
  //   }
  // }

  // updateMetaValues() {
  //   const qntd =
  //     isNaN(this.doacao[0].metaQntd) || this.doacao[0].metaQntd < 0
  //       ? 0
  //       : this.doacao[0].metaQntd;
  //   const data = this.doacao[0].metaDate
  //     ? new Date(this.doacao[0].metaDate)
  //     : "";

  //   this.metaForm.reset({
  //     metaQntd: qntd,
  //     metaDate: data,
  //   });

  //   if (data != "") {
  //     const day = ("0" + data.getDate()).slice(-2);
  //     const month = ("0" + (data.getMonth() + 1)).slice(-2);
  //     const year = data.getFullYear();
  //     this.customDateString = `${day}/${month}/${year}`;
  //   } else {
  //     this.customDateString = "Data final";
  //   }

  //   this.metaIsEditing = false;
  //   this.metaCalc();
  // }

  // metaCalc() {
  //   this.metaQntd = this.metaForm.controls["metaQntd"].value;

  //   if (!this.doacao || this.doacao.length === 0) {
  //     this.metaResult = "Dados de doação inválidos";
  //     return;
  //   }

  //   if (Number(this.metaQntd) <= 0) {
  //     this.metaResult = "Nenhuma meta definida.";

  //     this.metaChart.series = [0];
  //   } else {
  //     const quantidadeFalta = Math.floor(
  //       (Number(this.doacao[0].qntd) / Number(this.metaQntd)) * 100
  //     );

  //     if (quantidadeFalta < 100) {
  //       this.metaResult = `${quantidadeFalta}% da meta total`;
  //     } else {
  //       this.metaResult = "Meta atingida!";
  //     }

  //     this.metaChart.series = [quantidadeFalta];
  //   }
  // }

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

      //this.dateFilter();
    } else {
      console.error("O intervalo de datas não contém duas datas.");
    }
  }

  pageChanged($event: any) {
    this.currentPage = $event;
  }

  updateListFamilia(idReceived: any) {
    this.isLoadingList = true;

    this.familias = [];
    this.familia = {};
    this.membros = [];

    this._databaseService.getFamilias().subscribe({
      next: (values) => {
        if (values) {

          const familiaTemp = values.filter(
            (e) => e.id.toString() === idReceived
          );
          if (familiaTemp.length > 0) {
            this.familia = familiaTemp;
          }

          console.log(this.familia)
          this.isLoadingList = false;

          //this.updateMetaValues();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  checkUncheckAll(ev: any) {
    if (this.membros.length > 0)
      this.membros.forEach((membro: any) => {
        membro.marked = ev.target.checked;
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

  getTheme() {
    const theme = this._themeService.getTheme().subscribe((theme) => {
      if (theme === "dark") this.isDark = true;
      else this.isDark = false;
    });
  }

  // // FILTERS
  // searchFilter(event: any) {
  //   this.filteredCategoria = "";
  //   this.filterSelectedRangeDate = null;
  //   this.bsRangeFilterValue = "";

  //   const search = event.target.value;

  //   if (!search) {
  //     this.membrosFiltered = [...this.membros];
  //     return;
  //   }

  //   const lowerCaseSearch = search.toLowerCase();
  //   this.membrosFiltered = this.membros.filter((membro) =>
  //     Object.values(membro).some((value) =>
  //       String(value).toLowerCase().includes(lowerCaseSearch)
  //     )
  //   );
  // }

  // categoriaFilter() {
  //   this.txtSearch = "";
  //   this.filterSelectedRangeDate = null;
  //   this.bsRangeFilterValue = "";

  //   if (!this.filteredCategoria) {
  //     this.membrosFiltered = [...this.membros];
  //     return;
  //   }

  //   this.membrosFiltered = this.membros.filter((membro) =>
  //     this.filteredCategoria.includes(membro.e)
  //   );
  // }

  // dateFilter() {
  //   this.txtSearch = "";
  //   this.filteredCategoria = "";

  //   if (this.bsRangeFilterValue === "" || !this.bsRangeFilterValue) {
  //     this.membrosFiltered = [...this.membros];
  //     return;
  //   }

  //   console.log(this.filterSelectedRangeDate);
  //   this.membrosFiltered = this.membros.filter((historico) => {
  //     if (typeof historico.data === "string") {
  //       const [day, month, year] = historico.data.split("/");

  //       const dateCreated = new Date(+year, +month - 1, +day);

  //       console.log(dateCreated);

  //       return (
  //         dateCreated >= this.filterSelectedRangeDate[0] &&
  //         dateCreated <= this.filterSelectedRangeDate[1]
  //       );
  //     }
  //     return false;
  //   });
  // }
}
