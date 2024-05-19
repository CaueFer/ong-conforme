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

  getSingleDoacao(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/getSingleDoacao`, { params: { id: id } }).pipe(
      catchError((error) => {
        console.error("Erro ao obter os dados:", error);
        return of(null);
      })
    );
  }

  getHistorico(): Observable<any> {
    return this.http.get<any>(`${this.url}/getHistorico`).pipe(
      catchError((error) => {
        console.error("Erro ao obter os dados:", error);
        return of(null);
      })
    );
  }

  getFamilias(): Observable<any> {
    return this.http.get<any>(`${this.url}/getFamilias`).pipe(
      catchError((error) => {
        console.error("Erro ao obter os dados:", error);
        return of(null);
      })
    );
  }

  getTableLength(): Observable<any> {
    return this.http.get<any>(`${this.url}/getTableLength`).pipe(
      catchError((error) => {
        console.error("Erro ao obter os dados:", error);
        return of(null);
      })
    );
  }

  getMetaFixa(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/getMetaFixa`, { params: { id: id } }).pipe(
      catchError((error) => {
        console.error("Erro ao obter os dados:", error);
        return of(null);
      })
    );
  }

  getHistoricoByCategoria(categoria: string): Observable<any> {
    return this.http.get<any>(`${this.url}/getHistoricoByCategoria`, { params: { categoria: categoria } }).pipe(
      catchError((error) => {
        console.error("Erro ao obter os dados:", error);
        return of(null);
      })
    );
  }

  async addDoacao(newValue: any): Promise<Number> {
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
          //console.log(data);
          resolve();
        },
        error: (err) => {
          console.error(err);
          reject();
        },
      });
    });
  }

  async updateDoacao(newValue: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const itemToAtt = {
        id: newValue.id,
        categoria: newValue.categoria,
        itemName: newValue.itemName,
      };

      this.http
        .post<any>(`${this.url}/updateDoacao`, itemToAtt)
        .subscribe({
          next: (data) => {
            //console.log(data);
            resolve();
          },
          error: (err) => {
            console.error(err);
            reject();
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

      this.http
        .post<any>(`${this.url}/updateQntdInDoacao`, itemToAtt)
        .subscribe({
          next: (data) => {
            //console.log(data);
            resolve();
          },
          error: (err) => {
            console.error(err);
            reject();
          },
        });
    });
  }
  
  async updateMetaInDoacao(newValue: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const itemToAtt = {
        metaQntd: newValue.qntd,
        metaDate: newValue.data,
        doacao_id: newValue.doacao_id,
      };

      this.http
        .post<any>(`${this.url}/updateMetaInDoacao`, itemToAtt)
        .subscribe({
          next: (data) => {
            //console.log(data);
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
        this.http.post<any>(`${this.url}/deleteDoacao`, { id }).subscribe({
          next: (data) => {
            //console.log(data);
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

  async deleteMultiHistorico(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (id) {
        this.http.post<any>(`${this.url}/deleteMultiHistorico`, { id }).subscribe({
          next: (data) => {
            //console.log(data);
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

  async deleteSingleHistorico(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (id) {
        this.http.post<any>(`${this.url}/deleteSingleHistorico`, { id }).subscribe({
          next: (data) => {
            //console.log(data);
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
}
