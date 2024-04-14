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
import { setTime } from "ngx-bootstrap/chronos/utils/date-setters";

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
    private _databaseService: DatabaseService
  ) {
    this.doacaoForm = this.formBuilder.group({
      id: [""],
      ids: [""],
      itemName: ["", [Validators.required]],
      data: ["", [Validators.required]],
      qntd: ["", [Validators.required]],
      categoria: ["", [Validators.required]],
    });

    this.addNewItemForm = this.formBuilder.group({
      id: [""],
      ids: [""],
      itemName: ["", [Validators.required]],
      data: ["", [Validators.required]],
      qntd: [""],
      categoria: ["", [Validators.required]],
      personName: [""],
    });

    this.attItemForm = this.formBuilder.group({
      id: [""],
      ids: [""],
      itemName: ["", [Validators.required]],
      data: ["", [Validators.required]],
      qntd: ["", [Validators.required]],
      categoria: ["", [Validators.required]],
      personName: ["", [Validators.required]],
    });

    this.movimentacaoForm = this.formBuilder.group({
      itemName: ["", [Validators.required]],
      data: ["", [Validators.required]],
      qntd: ["", [Validators.required]],
      categoria: ["", [Validators.required]],
      personName: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this._databaseService.getRows().subscribe({
      next: (data) => {
        const rows = data.values;
        //console.log('Dados recebidos:', rows);
        rows.forEach((item, index)=>{
          if(index === 0) return;
          const doacao: DoacaoModel = {
            id: item[0]? item[0]: 'n/a',
            categoria: item[1]? item[1]: 'n/a',
            itemName: item[2]? item[2]: 'sem nome',
            dataCreated: item[3]? item[3]: 'n/a',
            qntd: item[4] !== null? item[4]: 'n/a',
            movimentacao: item[5] !== 'n/a' ? JSON.parse(item[5]): 'n/a',
            index: index,
          };
          this.doacoes.push(doacao);
        })
        console.log(this.doacoes)
      },
      error: (err) => {},
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

      const itemName = this.addNewItemForm.get("itemName").value || "n/a";
      const data = this.datePipe.transform(
        this.addNewItemForm.get("data").value || "n/a",
        "dd-MM-YYYY"
      );
      const doador = this.addNewItemForm.get("personName").value || "n/a";
      const categoria = this.addNewItemForm.get("categoria").value || "n/a";

      let movJson;
      if (this.addInitialMov) {
        const movimentacao = {
          movs: [
            { 
              tipo: "entrada",
              qntd: qntd,
              person: doador
            }
          ],
        };
        movJson = JSON.stringify(movimentacao);
      }
      else movJson = 'n/a';

      let newItem = {
        categoria,
        itemName,
        data,
        qntd,
        movJson
      };
      this._databaseService.addData(newItem);

      this.showModal?.hide();
      this.addNewItemForm.reset();
      this.submitted = false;

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

    var listData = this.doacoes[id];
    this.movimentacaoForm.controls["itemName"].setValue(listData.itemName);

    const movs = listData.movimentacao.movs;
    if(movs){
      this.itemMovs = movs;

      
    }

    // const movimentacao = {
    //   movs: [
    //     { 
    //       tipo: "entrada",
    //       qntd: qntd,
    //       person: doador
    //     }
    //   ],
    // };
    // movJson = JSON.stringify(movimentacao);
  }
  submitMov() {

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
}
