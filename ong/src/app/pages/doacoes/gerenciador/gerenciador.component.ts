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
import { DoacaoModel } from "./doacao.model";
import { NgbdOrdersSortableHeader } from "./orders-sortable.directive";
import { DatePipe } from "@angular/common";
import { DatabaseService } from "src/app/core/services/database/database.service";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";
import { DateService } from "src/app/core/services/date/date-service.service";
import { ToastrService } from "ngx-toastr";

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
  attItemForm!: UntypedFormGroup;
  movimentacaoForm!: UntypedFormGroup;
  submitted = false;

  transactions: DoacaoModel[] = [];
  // Table data
  content?: any;
  doacoes?: DoacaoModel[] = [];
  ordersList!: Observable<DoacaoModel[]>;
  total: Observable<number>;

  isInput: boolean = true;
  addInitialMov: boolean = false;
  selectedCategoria: string = "";

  itemMovs: Object = {};

  isLoadingList: boolean = true;

  @ViewChildren(NgbdOrdersSortableHeader)
  headers!: QueryList<NgbdOrdersSortableHeader>;
  @ViewChild("showModal", { static: false }) showModal?: ModalDirective;
  @ViewChild("editItemModal", { static: false }) editItemModal?: ModalDirective;
  @ViewChild("removeItemModal", { static: false })
  removeItemModal?: ModalDirective;
  @ViewChild("movimentacaoModal", { static: false })
  movimentacaoModal?: ModalDirective;
  deletId: any;
  disableSubmitBtn: boolean = false;
  selectedDoacao: Number;

  txtSearch: string;

  constructor(
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private _databaseService: DatabaseService,
    private localeService: BsLocaleService,
    private _dateService: DateService,
    private _toastService: ToastrService
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

    this.attItemForm = this.formBuilder.group({
      id: [""],
      ids: [""],
      itemName: ["", [Validators.required]],
      data: ["", [Validators.required]],
      qntd: [Number, [Validators.required]],
      categoria: ["", [Validators.required]],
      personName: ["", [Validators.required]],
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
    /**
     * fetches data
     */
    // this.ordersList.subscribe(x => {
    //   this.doacoes = Object.assign([], x);
    // });
  }

  updateListDoacao() {
    this.isLoadingList = true;
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
    this.removeItemModal.show();
  }

  deleteOrder() {
    this.doacoes.splice(this.deletId, 1);
    this.removeItemModal.hide();
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
        .addData(newItem)
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

    if (this.movimentacaoForm.valid) {
      let qntd = this.movimentacaoForm.get("qntd").value;
      let person = this.movimentacaoForm.get("personName").value;
      let data = this.movimentacaoForm.get("data").value;

      console.log(this.movimentacaoForm.controls["data"].value);
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

    this._databaseService.addHistorico(movToAdd);
    this._databaseService.updateQntdInDoacao(movToAdd);
  }

  /**
   * EDIT CONFIGS
   */
  submitEdit() {}
  editModal(id: any) {
    this.submitted = false;

    this.editItemModal?.show();

    var listData = this.doacoes[id];
    // this.ordersForm.controls['categoria'].setValue(listData.categoria);
    // this.ordersForm.controls['itemName'].setValue(new Date(listData.itemName));
    // this.ordersForm.controls['dataCreated'].setValue(listData.data);
    // this.ordersForm.controls['qntd'].setValue(listData.qntd);
    // this.ordersForm.controls['ids'].setValue(listData.id);
  }

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
}
