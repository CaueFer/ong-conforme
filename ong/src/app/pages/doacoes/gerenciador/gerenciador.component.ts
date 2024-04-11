import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { OrdersModel } from './orders.model';
import { NgbdOrdersSortableHeader } from './orders-sortable.directive';
import { DatePipe } from '@angular/common';
import { Orders } from './data';


@Component({
  selector: 'app-gerenciador',
  templateUrl: './gerenciador.component.html',
  styleUrls: ['./gerenciador.component.scss']
})
export class GerenciadorComponent implements OnInit{
  modalRef?: BsModalRef;
  masterSelected!: boolean;

  ordersForm!: UntypedFormGroup;
  addNewItemForm!: UntypedFormGroup;
  submitted = false;

  transactions: OrdersModel[] = [];
  // Table data
  content?: any;
  orderes?: any;
  ordersList!: Observable<OrdersModel[]>;
  total: Observable<number>;

  isInput: boolean = true;

  @ViewChildren(NgbdOrdersSortableHeader) headers!: QueryList<NgbdOrdersSortableHeader>;
  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  deletId: any;

  constructor(private modalService: BsModalService, private formBuilder: UntypedFormBuilder, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.orderes = Orders;
    //console.log(this.orderes);

    /**
     * Form Validation
     */
    this.ordersForm = this.formBuilder.group({
      id: "#VZ2101",
      ids: [''],
      itemName: ['', [Validators.required]],
      data: ['', [Validators.required]],
      qntd: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
    });

    this.addNewItemForm = this.formBuilder.group({
      id: "#VZ2101",
      ids: [''],
      itemName: ['', [Validators.required]],
      data: ['', [Validators.required]],
      qntd: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
    });

    /**
    * fetches data
    */
    // this.ordersList.subscribe(x => {
    //   this.orderes = Object.assign([], x);
    // });
  }

  /**
   * Open modal
   * @param content modal content
   */
  openViewModal(content: any) {
    this.modalRef = this.modalService.show(content);
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    if(this.orderes.length > 0) this.orderes.forEach((x: { state: any; }) => x.state = ev.target.checked)
  }

  checkedValGet: any[] = [];
  // Delete Data
  deleteData(id: any) {
    if (id) {
      document.getElementById('lj_' + id)?.remove();
    }
    else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById('lj_' + item)?.remove();
      });
    }
  }
  // Delete Data
  confirm(id: any) {
    this.deletId = id
    this.removeItemModal.show();
  }

  deleteOrder() {
    this.orderes.splice(this.deletId, 1);
    this.removeItemModal.hide();
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
  }
  /**
   * Form data get
   */
  get form() {
    return this.ordersForm.controls;
  }

  /**
  * Save user
  */
  saveUser() {
    if (this.ordersForm.valid) {
      if (this.ordersForm.get('ids')?.value) {
        this.ordersForm.controls['date'].setValue(this.datePipe.transform(this.ordersForm.get('date')?.value,"YYYY-mm-dd"));
        //this.service.products = Orders.map((data: { id: any; }) => data.id === this.ordersForm.get('ids')?.value ? { ...data, ...this.ordersForm.value } : data)
        //this.orderes = this.service.products
        //  = this.orderes
      } else {
        const itemName = this.ordersForm.get('itemName')?.value;
        const dataCreated = this.datePipe.transform(this.ordersForm.get('data')?.value,"YYYY-mm-dd");
        const qntd = this.ordersForm.get('qntd')?.value;
        const categoria = this.ordersForm.get('categoria')?.value;
        const index = 100;
        Orders.push({
          id: this.orderes.length + 1,
          categoria,
          itemName,
          dataCreated,
          qntd,
          index
        });
      }
    }
    this.showModal?.hide()
    setTimeout(() => {
      this.ordersForm.reset();
    }, 0);
    this.ordersForm.reset();
    this.submitted = true
  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editModal(id: any) {
    this.submitted = false;
    // this.modalRef = this.modalService.show(content, { class: 'modal-md'});
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Edit Order';
    var updateBtn = document.getElementById('addNewOrder-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
    this.showModal?.show()
    var listData = this.orderes[id];
    this.ordersForm.controls['categoria'].setValue(listData.categoria);
    this.ordersForm.controls['itemName'].setValue(new Date(listData.itemName));
    this.ordersForm.controls['dataCreated'].setValue(listData.data);
    this.ordersForm.controls['qntd'].setValue(listData.qntd);
    this.ordersForm.controls['ids'].setValue(listData.id);
  }

  toggleInput(value: string){

    if(value === 'entrada') this.isInput = true;
    else this.isInput = false;

  }
}
