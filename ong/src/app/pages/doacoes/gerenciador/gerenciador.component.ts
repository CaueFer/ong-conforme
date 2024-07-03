import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
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
import { Observable } from "rxjs";
import { DoacaoModel } from "../../../core/models/doacao.model";
import { DatePipe, formatDate } from "@angular/common";
import { DatabaseService } from "src/app/core/services/database/database.service";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";
import { DateService } from "src/app/core/services/date/date-service.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { ThemeService } from "src/app/core/services/theme/theme.service";

@Component({
  selector: "app-gerenciador",
  templateUrl: "./gerenciador.component.html",
  styleUrls: ["./gerenciador.component.scss"],
})
export class GerenciadorComponent implements OnInit {
  modalRef?: BsModalRef;
  masterSelected!: boolean;

  doacaoForm!: UntypedFormGroup;
  addNewItemForm!: UntypedFormGroup;
  editItemForm!: UntypedFormGroup;
  movimentacaoForm!: UntypedFormGroup;
  submitted = false;

  transactions: DoacaoModel[] = [];
  content?: any;
  doacoes: DoacaoModel[] = [];
  doacoesFiltered: DoacaoModel[] = [];
  ordersList!: Observable<DoacaoModel[]>;
  totalMoney: Number;

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
  filterSelectedRangeDate: Date[];
  bsRangeFilterValue: string = "";

  selectedDoacao: Number;
  deletId: any;
  editedId: any;
  editedCategoria: string = "";

  currentPage = 1;
  itemsPerPage = 9;

  isDark: boolean = false;

  constructor(
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private _databaseService: DatabaseService,
    private localeService: BsLocaleService,
    private _dateService: DateService,
    private _toastService: ToastrService,
    private _themeService: ThemeService
  ) {
    this.doacaoForm = this.formBuilder.group({
      id: [""],
      ids: [""],
      itemName: ["", [Validators.required]],
      data: ["", [Validators.required]],
      qntd: [Number, [Validators.required]],
      categoria: ["", [Validators.required]],
    });

    this.addNewItemForm = this.formBuilder.group({
      id: [""],
      ids: [""],
      itemName: ["", [Validators.required]],
      data: ["", [Validators.required]],
      qntd: [Number],
      categoria: ["", [Validators.required]],
      personName: [""],
    });

    this.editItemForm = this.formBuilder.group({
      id: [""],
      itemName: ["", [Validators.required]],
      categoria: ["", [Validators.required]],
    });

    this.movimentacaoForm = this.formBuilder.group({
      itemName: ["", [Validators.required]],
      data: ["", [Validators.required]],
      qntd: [Number, [Validators.required]],
      personName: ["", [Validators.required]],
    });

    defineLocale("pt-br", ptBrLocale);
    this.localeService.use("pt-br");
  }

  ngOnInit() {
    this.updateListDoacao();

    this.getTheme();
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

      this.dateFilter();
    } else {
      console.error("O intervalo de datas não contém duas datas.");
    }
  }

  pageChanged($event: any) {
    this.currentPage = $event;
  }

  updateListDoacao() {
    this.isLoadingList = true;
    this.doacoes = [];
    this._databaseService.getDoacao().subscribe({
      next: (values) => {
        if (values) {
          values.forEach((value) => {
            const date = new Date(value.dataCreated);
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();

            value.dataCreated = `${day}/${month}/${year}`;
          });

          this.doacoes = values;
          this.doacoesFiltered = this.doacoes;

          this.isLoadingList = false;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  checkUncheckAll(ev: any) {
    if (this.doacoes.length > 0)
      this.doacoes.forEach((doacao: DoacaoModel) => {
        doacao.marked = ev.target.checked;
      });
  }
  checkedValGet: any[] = [];

  deleteData(id: any) {
    if (id) {
      document.getElementById("lj_" + id)?.remove();
    } else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById("lj_" + item)?.remove();
      });
    }
  }

  confirmDelete(id: any) {
    this.deletId = id;
    this.alertConfirmOrCancel();
  }

  deleteOrder() {
    if (this.deletId === null) {
      this.showToast("Erro ao deletar item");

      return;
    }

    this._databaseService
      .deleteMultiHistorico(this.deletId)
      .then(() => {})
      .catch(() => {
        console.error("Erro ao deletar historico de id: " + this.deletId);
      });

    this._databaseService
      .deleteDoacao(this.deletId)
      .then(() => {
        this.deletId = null;

        this.alertConfirmDelete();

        this.updateListDoacao();
      })
      .catch(() => {
        this.showToast("Erro ao deletar item id: " + this.deletId);
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
  /**
   * Form data get
   */
  get form() {
    return this.doacaoForm.controls;
  }

  /**
   * add Doacao
   */
  submitAddItem() {
    this.submitted = true;
    this.disableSubmitBtn = true;

    if (this.addInitialMov) {
      this.addNewItemForm.get("qntd").setValidators(Validators.required);
      this.addNewItemForm.get("personName").setValidators(Validators.required);
    } else {
      this.addNewItemForm.get("qntd").clearValidators();
      this.addNewItemForm.get("personName").clearValidators();
    }

    this.addNewItemForm.get("qntd").updateValueAndValidity();
    this.addNewItemForm.get("personName").updateValueAndValidity();

    if (this.addNewItemForm.valid) {
      const qntd = this.addNewItemForm.get("qntd").value || "0";
      if (qntd <= 0 && this.addInitialMov) {
        this.addNewItemForm.get("qntd").setErrors({ nulo: true });
        return;
      }

      const data = this.datePipe.transform(
        this.addNewItemForm.get("data").value || "n/a",
        "YYYY-MM-dd"
      );

      const itemName = this.addNewItemForm.get("itemName").value || "n/a";
      const doador = this.addNewItemForm.get("personName").value || "n/a";
      const categoria = this.addNewItemForm.get("categoria").value || "n/a";

      // DADOS VALIDADOS
      let newItem = {
        categoria,
        itemName,
        data,
        qntd,
      };

      this.disableSubmitBtn = true;
      this._databaseService
        .addDoacao(newItem)
        .then((resolve) => {
          if (this.addInitialMov) {
            const newMov = {
              data: data,
              qntd: qntd,
              tipoMov: "entrada",
              doadorName: doador,
              doacao_id: resolve,
            };
            this.addMov(newMov);
          }

          this.addNewItemForm.reset();
          this.showModal?.hide();
          this.selectedCategoria = "";
          this.submitted = false;
          this.disableSubmitBtn = false;

          this.alertSucess("ADICIONADA!", "Doação foi adicionada.");
          this.updateListDoacao();
        })
        .catch((reject) => {
          this.showToast("Erro ao adicionar doação");
        });

      return;
    }

    setTimeout(() => {
      this.submitted = false;
    }, 5000);
  }

  /**
   * MOVIMENTACAO CONFIGS
   */
  movModal(id: any) {
    this.movimentacaoModal?.show();

    var listData = this.doacoes.find((e) => e.id === id);
    this.movimentacaoForm.controls["itemName"].setValue(listData.itemName);

    let date = new Date();
    let formattedDate =
      date.getFullYear() +
      "/" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + date.getDate()).slice(-2);

    this.movimentacaoForm.controls["data"].setValue(formattedDate);

    this.selectedDoacao = id;
  }

  submitMov() {
    this.submitted = true;
    this.disableSubmitBtn = true;

    if (this.movimentacaoForm.valid) {
      let qntd = this.movimentacaoForm.get("qntd").value;
      let person = this.movimentacaoForm.get("personName").value;
      let data = this.movimentacaoForm.get("data").value;

      let inputOutput;
      if (this.isInput) inputOutput = "entrada";
      else inputOutput = "saida";

      const newMov = {
        data: data,
        qntd: qntd,
        tipoMov: inputOutput,
        doadorName: person,
        doacao_id: this.selectedDoacao,
      };

      this.addMov(newMov);
    }

    setTimeout(() => {
      this.submitted = false;
    }, 5000);
  }

  addMov(movToAdd: any) {
    //console.log(movToAdd);

    this._databaseService
      .addHistorico(movToAdd)
      .then(() => {
        this.showToast("Movimentação adicionada com sucesso.");
      })
      .catch(() => {
        this.showToast("Erro ao adicionar movimentação de doação.");
      });

    this._databaseService
      .updateQntdInDoacao(movToAdd)
      .then(() => {
        this.movimentacaoForm.reset();
        this.movimentacaoModal?.hide();

        this.updateListDoacao();
        this.disableSubmitBtn = false;
      })
      .catch(() => {});
  }

  /**
   * EDIT CONFIGS
   */
  editModal(id: any) {
    this.submitted = false;

    this.editedId = id;

    var editData = this.doacoes.find((e) => e.id === id);

    if (editData) {
      this.editItemForm.patchValue({
        categoria: editData.categoria,
        itemName: editData.itemName,
      });
    }

    this.editItemModal?.show();
  }
  submitEdit() {
    this.submitted = true;
    this.disableSubmitBtn = true;

    let newCategoria = this.editItemForm.get("categoria")?.value;
    let newItemName = this.editItemForm.get("itemName")?.value;

    if (this.editItemForm.valid) {
      this.submitted = false;
      let newItem = {
        id: this.editedId,
        categoria: newCategoria,
        itemName: newItemName,
      };

      this._databaseService
        .updateDoacao(newItem)
        .then(() => {
          this.disableSubmitBtn = false;
          this.editItemForm.reset();

          this.editItemModal?.hide();
          this.alertSucess("ATUALIZADA!", "Doação atualizada com sucesso.");

          this.updateListDoacao();
        })
        .catch(() => {
          this.showToast("Erro ao atualizar, tente novamente.");
        });
    }
  }
  /**
   * EDIT CONFIGS ENDS
   */

  toggleInput(value: string) {
    if (value === "entrada") this.isInput = true;
    else this.isInput = false;
  }
  toggleCheckbox($event: any) {
    this.addInitialMov = $event;
  }

  selectCategoria($event) {
    this.selectedCategoria = this.removeAccents($event.innerText).toLowerCase();

    this.addNewItemForm.get("categoria").setValue(this.selectedCategoria);
  }

  removeAccents(value: string) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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

  alertConfirmDelete() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ms-2",
      },
      buttonsStyling: false,
      iconHtml:
        '<i class="fas fa-trash-alt text-danger animate__animated animate__shakeX fs-1"></i>',
    });

    swalWithBootstrapButtons.fire(
      "Deletado!",
      "Doação foi deletada com sucesso.",
      "error"
    );
  }

  alertConfirmOrCancel() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ms-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Tem certeza?",
        text: "Essa ação é irreversível!",
        icon: "question",
        cancelButtonText: "Cancelar!",
        confirmButtonText: "Deletar!",
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.deleteOrder();
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelado",
            "Sua doação não foi deletada!",
            "error"
          );
        }
      });
  }

  getTheme() {
    const theme = this._themeService.getTheme().subscribe((theme) => {
      if (theme === "dark") this.isDark = true;
      else this.isDark = false;
    });
  }

  // FILTERS
  searchFilter(event: any) {
    this.filteredCategoria = "";
    this.filterSelectedRangeDate = null;
    this.bsRangeFilterValue = "";

    const search = event.target.value;

    if (!search) {
      this.doacoesFiltered = [...this.doacoes];
      return;
    }

    const lowerCaseSearch = search.toLowerCase();
    this.doacoesFiltered = this.doacoes.filter((doacao) =>
      Object.values(doacao).some((value) =>
        String(value).toLowerCase().includes(lowerCaseSearch)
      )
    );
  }

  categoriaFilter() {
    this.txtSearch = "";
    this.filterSelectedRangeDate = null;
    this.bsRangeFilterValue = "";

    if (!this.filteredCategoria) {
      this.doacoesFiltered = [...this.doacoes];
      return;
    }

    this.doacoesFiltered = this.doacoes.filter((doacao) =>
      this.filteredCategoria.includes(doacao.categoria)
    );
  }

  dateFilter() {
    this.txtSearch = "";
    this.filteredCategoria = "";

    if (!this.bsRangeFilterValue) {
      this.doacoesFiltered = [...this.doacoes];
      return;
    }

    //console.log(this.filterSelectedRangeDate);
    this.doacoesFiltered = this.doacoes.filter((doacao) => {
      if (typeof doacao.dataCreated === "string") {
        const [day, month, year] = doacao.dataCreated.split("/");

        const dateCreated = new Date(+year, +month - 1, +day);

        //console.log(dateCreated);

        return (
          dateCreated >= this.filterSelectedRangeDate[0] &&
          dateCreated <= this.filterSelectedRangeDate[1]
        );
      }
      return false;
    });
  }
}
