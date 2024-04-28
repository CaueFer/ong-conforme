import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, of } from "rxjs";
import config from "../../../../../../config.js";

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  constructor(private http: HttpClient) {}

  url: string = config.databaseUrlBack;

  getDoacao(): Observable<any> {
    return this.http.get<any>(`${this.url}/getDoacao`).pipe(
      catchError((error) => {
        console.error("Erro ao obter os dados:", error);
        return of(null);
      })
    );
  }

  async addData(newValue: any): Promise<Number> {
    console.log(newValue);

    const itemToAdd = {
      categoria: newValue.categoria,
      itemName: newValue.itemName,
      dataCreated: newValue.data,
      qntd: newValue.qntd,
    };

    return new Promise<Number>((resolve, reject) => {
      this.http.post<any>(`${this.url}/addDoacao`, itemToAdd).subscribe({
        next: (data) => {
          if (data && data.doacaoId) {
            resolve(data.doacaoId);
          } else {
            reject(new Error("ID da doação não encontrado na resposta"));
          }
        },
        error: (err) => {
          console.error(err);
          reject(false);
        },
      });
    });
  }

  async updateQntdInDoacao(newValue: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const itemToAtt = {
        qntd: newValue.qntd,
        tipoMov: newValue.tipoMov,
        doacao_id: newValue.doacao_id,
      };
  
      this.http.post<any>(`${this.url}/updateQntdInDoacao`, itemToAtt).subscribe({
        next: (data) => {
          console.log(data);
          resolve();
        },
        error: (err) => {
          console.error(err);
          reject();
        },
      });
    });
  }
  

  async deleteDoacao(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (id) {
        this.http
          .post<any>(`${this.url}/deleteDoacao`, { id })
          .subscribe({
            next: (data) => {
              console.log(data);
              resolve();
            },
            error: (err) => {
              console.log(err);
              reject();
            },
          });
      }
    });
  }

  async deleteHistorico(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (id) {
        this.http
          .post<any>(`${this.url}/deleteHistorico`, { id })
          .subscribe({
            next: (data) => {
              console.log(data);
              resolve();
            },
            error: (err) => {
              console.log(err);
              reject();
            },
          });
      }
    });
  }

  async addHistorico(newHistorico: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const newMov = {
        data: newHistorico.data,
        qntd: newHistorico.qntd,
        tipoMov: newHistorico.tipoMov,
        doadorName: newHistorico.doadorName,
        doacao_id: newHistorico.doacao_id,
      };
  
      this.http.post<any>(`${this.url}/addHistorico`, newMov).subscribe({
        next: (data) => {
          console.log(data);
          resolve();
        },
        error: (err) => {
          console.error(err);
          reject();
        },
      });
    });
  }
}
