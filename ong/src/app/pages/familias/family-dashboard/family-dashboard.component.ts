import { Component, ViewChild } from "@angular/core";
import { nextDay } from "date-fns";
import { DatabaseService } from "src/app/core/services/database/database.service";
import { FamiliaModel } from "./familia.model";
import { ModalDirective } from "ngx-bootstrap/modal";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { CdkStepper } from "@angular/cdk/stepper";

@Component({
  selector: "app-family-dashboard",
  standalone: false,
  templateUrl: "./family-dashboard.component.html",
  styleUrl: "./family-dashboard.component.scss",
})
export class FamilyDashboardComponent {
  familias: FamiliaModel[] = [];
  familia: FamiliaModel[] = [];
  respForm: FormGroup;
  outroForm: FormGroup;
  addressForm: FormGroup;

  @ViewChild("addFamilyModal", { static: false })
  addFamilyModal?: ModalDirective;
  @ViewChild(CdkStepper) stepper: CdkStepper;

  submitted = false;
  disableSubmitBtn: boolean = false;

  currentPage = 1;
  itemsPerPage = 8;

  isLoadingList: boolean = false;
  addDescrib: boolean = false;
  bsRangeFilterValue: any;
  txtSearch: string;

  constructor(
    private _databaseService: DatabaseService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.respForm = this.formBuilder.group({
      id: [""],
      resp_nome: ["", [Validators.required]],
      resp_sobrenome: ["", [Validators.required]],
      resp_cpf: ["", [Validators.required]],
      qntd_membros: [""],
      descb: [""],
      email: ["", [Validators.required]],
      telefone: ["", [Validators.required]],
    });

    this.outroForm = this.formBuilder.group({
      qntd_membros: ["", [Validators.required]],
      descb: [""],
    });

    this.addressForm = this.formBuilder.group({
      street: ["", Validators.required],
      number: ["", Validators.required],
      neighborhood: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      zipcode: ["", [Validators.required]],
      complement: [""],
    });
  }

  ngOnInit() {
    this._databaseService.getFamilias().subscribe({
      next: (values) => {
        this.familias = values;
      },
      error: (error) => {},
    });
  }

  toggleCheckbox($event: any) {
    this.addDescrib = $event;
  }

  /**
   * add Doacao
   */
  nextStep(forms: FormGroup) {
    this.submitted = true;
    this.disableSubmitBtn = true;

    if (forms.valid) {
      this.submitted = false;
      this.disableSubmitBtn = false;

      this.stepper.next();
    }

    this.resetSubmit(3500);
  }

  submitAddFamilia() {
    this.submitted = true;
    this.disableSubmitBtn = true;

    if (this.respForm.invalid) {
      this.stepper.selectedIndex = 0;

      this.resetSubmit(3500);
      return;
    }

    if (this.addressForm.invalid) {
      this.stepper.selectedIndex = 1;

      this.resetSubmit(3500);
      return;
    }

    if (this.outroForm.invalid) {
      this.stepper.selectedIndex = 2;

      this.resetSubmit(3500);
      return;
    }

    if ((this.outroForm.valid, this.respForm.valid, this.addressForm.valid)) {
      this.submitted = false;
      this.disableSubmitBtn = false;

      this.respForm.reset();
      this.outroForm.reset();
      this.addressForm.reset();

      this.addFamilyModal.hide();
      this.stepper.selectedIndex = 0;

      this.alertSucess("Adicionada", "Familia adiciona com sucesso!");
    }

    this.resetSubmit(3500);
  }

  resetSubmit(timer: number) {
    setTimeout(() => {
      this.submitted = false;
      this.disableSubmitBtn = false;
    }, timer);
  }

  pageChanged($event: any) {
    this.currentPage = $event;
  }

  // ALERTS
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
        text: "Confirme os dados.",
        icon: "question",
        cancelButtonText: "cancelar",
        confirmButtonText: "adicionar",
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.submitAddFamilia();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // cancelado
        }
      });
  }

  alertSucess(msg1, msg2: string) {
    Swal.fire(msg1, msg2, "success");
  }
}
