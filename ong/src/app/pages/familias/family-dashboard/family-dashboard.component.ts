import { Component, ViewChild } from "@angular/core";
import { nextDay } from "date-fns";
import { DatabaseService } from "src/app/core/services/database/database.service";
import { FamiliaModel } from "./familia.model";
import { ModalDirective } from "ngx-bootstrap/modal";
import {
  FormArray,
  FormControl,
  FormGroup,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import Swal from "sweetalert2";
import { CdkStepper } from "@angular/cdk/stepper";
import { Options } from "ngx-slider-v2";

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
  membrosForm: FormGroup;
  addressForm: FormGroup;

  // FORMS FILTROS
  parentescoForm: FormGroup;
  idadeForm: FormGroup;
  generoForm: FormGroup;

  @ViewChild("addFamilyModal", { static: false })
  addFamilyModal?: ModalDirective;
  @ViewChild(CdkStepper) stepper: CdkStepper;

  submitted = false;
  disableSubmitBtn: boolean = false;

  currentPage = 1;
  itemsPerPage = 9;

  isLoadingList: boolean = false;
  addDescrib: boolean = false;
  bsRangeFilterValue: any;
  txtSearch: string;
  showFiltros: boolean = true;
  ageRange: number;
  maxAgeRange: number = 95;
  minAgeRange: number = 5;
  option1: Options = {
    floor: 0,
    ceil: 100,
    translate: (value: number): string => {
      return value.toString();
    },
  };

  constructor(
    private _databaseService: DatabaseService,
    private fb: UntypedFormBuilder
  ) {
    this.respForm = this.fb.group({
      resp_nome: ["", [Validators.required]],
      resp_sobrenome: ["", [Validators.required]],
      resp_cpf: ["", [Validators.required]],
      email: ["", [Validators.required]],
      telefone: ["", [Validators.required]],
    });

    this.membrosForm = this.fb.group({
      formlist: this.fb.array([]),
      describ: [""],
    });

    this.addressForm = this.fb.group({
      street: ["", Validators.required],
      number: ["", Validators.required],
      neighborhood: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      zipcode: ["", [Validators.required]],
      complement: [""],
    });

    this.parentescoForm = this.fb.group({
      Todos: [true],
      Responsavel: [false],
      Filho: [false],
      Outro: [false],
    });

    this.idadeForm = this.fb.group({
      min: [""],
      max: [""],
    });

    this.generoForm = this.fb.group({
      genero: [""],
    });
  }

  ngOnInit() {
    this._databaseService.getFamilias().subscribe({
      next: (values) => {
        this.familias = values;
      },
      error: (error) => {},
    });

    this.formData().push(this.field());
    this.filterParentescoChange(0);
  }

  pageChanged($event: any) {
    this.currentPage = $event;
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

    if (this.membrosForm.invalid) {
      this.stepper.selectedIndex = 2;

      this.resetSubmit(3500);
      return;
    }

    if ((this.membrosForm.valid, this.respForm.valid, this.addressForm.valid)) {
      this.submitted = false;
      this.disableSubmitBtn = false;

      console.log(
        this.respForm.value,
        this.membrosForm.value,
        this.addressForm.value
      );
      this.respForm.reset();
      this.membrosForm.reset();
      this.addressForm.reset();

      this.addFamiliaToDB();

      this.addFamilyModal.hide();
      this.stepper.selectedIndex = 0;
      this.alertSucess("Adicionada", "Familia adiciona com sucesso!");
    }

    this.resetSubmit(3500);
  }

  addFamiliaToDB() {
    // FAMILY VALUES
    const newFamily = {
      respName: this.respForm.get("resp_nome").value,
      respSobrenome: this.respForm.get("resp_sobrenome").value,
      respCpf: this.respForm.get("resp_cpf").value,
      respEmail: this.respForm.get("email").value,
      respTelefone: this.respForm.get("telefone").value,
      familyDesc: this.membrosForm.get("describ").value,
    };

    // ADDRESS VALUES
    const newAddress = {
      street: this.addressForm.get("street").value,
      number: this.addressForm.get("number").value,
      neighborhood: this.addressForm.get("neighborhood").value,
      city: this.addressForm.get("city").value,
      state: this.addressForm.get("state").value,
      zipcode: this.addressForm.get("zipcode").value,
      complement: this.addressForm.get("complement").value,
    };

    //MEMBROS VALUES
    const formArray = this.membrosForm.get("formlist") as FormArray;
    const newMembers = formArray.controls.map((control) => ({
      membro: control.get("membro").value,
      genero: control.get("genero").value,
      idade: control.get("idade").value,
    }));

    console.log(newAddress); // RECEBENDO NULL
    this._databaseService.addAddress(newAddress)
    .then((value) =>{
      console.log(value);
    })
    .catch();
  }

  resetSubmit(timer: number) {
    setTimeout(() => {
      this.submitted = false;
      this.disableSubmitBtn = false;
    }, timer);
  }

  formData(): UntypedFormArray {
    return this.membrosForm.get("formlist") as UntypedFormArray;
  }

  field(): UntypedFormGroup {
    return this.fb.group({
      membro: ["", [Validators.required]],
      genero: ["", [Validators.required]],
      idade: ["", [Validators.required]],
    });
  }

  addField() {
    this.formData().push(this.field());
  }

  removeField(i: number) {
    if (this.formData().value.length > 1) this.formData().removeAt(i);
  }

  // FORMS FILTER
  getParentescoLabel(index: number): string {
    const labels = ["Todos", "Responsavel", "Filho", "Outro"];
    return labels[index];
  }

  getSelectedOptions() {
    const selectedOptions = Object.keys(this.parentescoForm.controls)
      .filter((key) => this.parentescoForm.controls[key].value)
      .map((key) => key);
  }

  filterParentescoChange(i: number) {
    const parentescoControls = Object.keys(this.parentescoForm.controls);
    const checkboxChanged = parentescoControls[i];

    if (checkboxChanged === "Todos") {
      const checkboxValue = this.parentescoForm.get("Todos").value;
      this.parentescoForm.patchValue({
        Responsavel: checkboxValue,
        Filho: checkboxValue,
        Outro: checkboxValue,
      });
    } else {
      const todosChecked = ["Responsavel", "Filho", "Outro"].every(
        (control) => this.parentescoForm.get(control)?.value
      );
      this.parentescoForm.get("Todos").setValue(todosChecked);
    }
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
