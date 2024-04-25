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

  async addData(newValue: any): Promise<boolean> {
    console.log(newValue);
    let added: boolean;

    const itemToAdd = {
      categoria: newValue.categoria,
      itemName: newValue.itemName,
      dataCreated: newValue.data,
      qntd: newValue.qntd,
    };

    return new Promise<boolean>((resolve, reject) => {
      this.http.post<any>(`${this.url}/addDoacao`, itemToAdd).subscribe({
        next: (data) => {
          console.log(data);
          resolve(true); 
        },
        error: (err) => {
          console.error(err);
          reject(false);
        },
      });
    });
  }

  async updateData(newValue: string[][]) {
    //console.log(newValue)
    if (newValue && newValue.length > 0) {
      this.http.post<any>(`${this.url}/updateValue`, newValue).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  async deleteData(valueIndex: string) {
    //console.log(newValue)
    if (valueIndex && valueIndex.length > 0) {
      this.http.post<any>(`${this.url}/deleteValue`, { valueIndex }).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
