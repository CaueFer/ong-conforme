import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  constructor(private http: HttpClient) {}

  url: string = "http://localhost:5050";

  async getData() {
    this.http.get<any>(`${this.url}/getData`).subscribe({
      next: (data) => {
        console.log(data.data.values);
      },
      error: (err) => {},
    });
  }

  async addData(newValue: string[][]) {
    //console.log(newValue)
    if (newValue && newValue.length > 0) {
      this.http.post<any>(`${this.url}/addData`, newValue).subscribe({
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
      this.http.post<any>(`${this.url}/deleteValue`,{ valueIndex }).subscribe({
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
