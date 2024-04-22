import { Component } from "@angular/core";
import { DoacaoModel } from "../gerenciador/doacao.model";
import { HistoricoModel } from "./historico.model";
import { setTime } from "ngx-bootstrap/chronos/utils/date-setters";

@Component({
  selector: "app-historico",
  templateUrl: "./historico.component.html",
  styleUrls: ["./historico.component.scss"],
})
export class HistoricoComponent {
  masterSelected!: boolean;

  historico: HistoricoModel[] = [];

  constructor() {
    setTimeout(() =>{
      this.historico = [{
        id: "02",
        categoria: "Objeto",
        itemName: "Armario",
        data: "20/02/2024",
        qntd: 12,
        tipoMov: "entrada",
        doadorName: "Jailson"
      }, {
        id: "02",
        categoria: "Objeto",
        itemName: "Armario",
        data: "20/02/2024",
        qntd: 12,
        tipoMov: "entrada",
        doadorName: "Jailson"
      }];
    }, 2000)
  }

  checkUncheckAll($event: any) {
    throw new Error("Method not implemented.");
  }
  isActive: any;
}
