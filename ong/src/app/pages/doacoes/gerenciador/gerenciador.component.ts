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
import { DatabaseService } from "src/app/core/services/database.service";

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

  @ViewChildren(NgbdOrdersSortableHeader)
  headers!: QueryList<NgbdOrdersSortableHeader>;
  @ViewChild("showModal", { static: false }) showModal?: ModalDirective;
  @ViewChild("editItemModal", { static: false }) editItemModal?: ModalDirective;
  @ViewChild("removeItemModal", { static: false })
  removeItemModal?: ModalDirective;
  @ViewChild("movimentacaoModal", { static: false })
  movimentacaoModal?: ModalDirective;
  deletId: any;

  constructor(
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private _databaseService: DatabaseService,
  ) {}

  ngOnInit() {
    //this.doacoes = Orders;

    this._databaseService.getRows().subscribe({
      next: (data) => {
        const result = [];
        const rows = data.values;
        //console.log('Dados recebidos:', rows);

        rows.forEach((item, index)=>{
          const doacao: DoacaoModel = {
            id: "#SK2541",
            categoria: "Objeto",
            itemName: item[0]? item[0]: 'sem nome',
            dataCreated: "20/20/2020",
            qntd: item[1],
            index: index,
          };
          this.doacoes.push(doacao);
        })

        console.log(this.doacoes)
      },
      error: (err) => {},
    });


    /**
     * Form Validation
     */
    this.doacaoForm = this.formBuilder.group({
      id: "#VZ2101",
      ids: [""],
      itemName: ["", [Validators.required]],
      data: ["", [Validators.required]],
      qntd: ["", [Validators.required]],
      categoria: ["", [Validators.required]],
    });

    this.addNewItemForm = this.formBuilder.group({
      id: "#VZ2101",
      ids: [""],
      itemName: ["", [Validators.required]],
      data: ["", [Validators.required]],
      qntd: ["", [Validators.required]],
      categoria: ["", [Validators.required]],
    });

    this.attItemForm = this.formBuilder.group({
      id: "#VZ2101",
      ids: [""],
      itemName: ["", [Validators.required]],
      data: ["", [Validators.required]],
      qntd: ["", [Validators.required]],
      categoria: ["", [Validators.required]],
    });

    this.movimentacaoForm = this.formBuilder.group({
      id: "#VZ2101",
      ids: [""],
      itemName: ["", [Validators.required]],
      data: ["", [Validators.required]],
      qntd: ["", [Validators.required]],
      categoria: ["", [Validators.required]],
    });

    /**
     * fetches data
     */
    // this.ordersList.subscribe(x => {
    //   this.doacoes = Object.assign([], x);
    // });
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    if (this.doacoes.length > 0)
      this.doacoes.forEach((doacao: DoacaoModel) => {
        //doacao.state = ev.target.checked;
      });
  }

  checkedValGet: any[] = [];
  // Delete Data
  deleteData(id: any) {
    if (id) {
      document.getElementById("lj_" + id)?.remove();
    } else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById("lj_" + item)?.remove();
      });
    }
  }
  // Delete Data
  confirm(id: any) {
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
   * Save user
   */
  saveUser() {
    if (this.doacaoForm.valid) {
      if (this.doacaoForm.get("ids")?.value) {
        this.doacaoForm.controls["date"].setValue(
          this.datePipe.transform(
            this.doacaoForm.get("date")?.value,
            "YYYY-mm-dd"
          )
        );
        //this.service.products = Orders.map((data: { id: any; }) => data.id === this.ordersForm.get('ids')?.value ? { ...data, ...this.ordersForm.value } : data)
        //this.doacoes = this.service.products
        //  = this.doacoes
      } else {
        const itemName = this.doacaoForm.get("itemName")?.value;
        const dataCreated = this.datePipe.transform(
          this.doacaoForm.get("data")?.value,
          "YYYY-mm-dd"
        );
        const qntd = this.doacaoForm.get("qntd")?.value;
        const categoria = this.doacaoForm.get("categoria")?.value;
        const index = 100;
        // Orders.push({
        //   id: this.doacoes.length + 1,
        //   categoria,
        //   itemName,
        //   dataCreated,
        //   qntd,
        //   index,
        // });
      }
    }
    this.showModal?.hide();
    setTimeout(() => {
      this.doacaoForm.reset();
    }, 0);
    this.doacaoForm.reset();
    this.submitted = true;
  }


  /**
   * MOVIMENTACAO CONFIGS
   */
  movModal(id: any) {
    this.movimentacaoModal?.show();

    //var listData = this.doacoes[id];
    //this.movimentacaoForm.controls["itemName"].setValue(listData.itemName);
  };
  submitMov() {};

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
}
