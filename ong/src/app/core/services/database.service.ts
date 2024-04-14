import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  constructor(private http: HttpClient) {}

  url: string = "http://localhost:5050";

  getData(): Observable<any> {
    return this.http.get<any>(`${this.url}/getData`).pipe(
      map((data) => data.sheets[0].properties),
      catchError((error) => {
        console.error("Erro ao obter os dados:", error);
        return of(null);
      })
    );
  }

  getRows(): Observable<any> {
    return this.http.get<any>(`${this.url}/getRows`).pipe(
      map((data) => data),
      catchError((error) => {
        console.error("Erro ao obter os dados:", error);
        return of(null);
      })
    );
  }

  async addData(newValue: any) {

    const values = Object.values(newValue);
    const newItem: string[] = values.map((item: any) => String(item));

    const data = {
      values: [newItem]
    }

    if (newItem && newItem.length > 0) {
      this.http.post<any>(`${this.url}/addRow`, data).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
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
