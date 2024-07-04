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
    return this.http
      .get<any>(`${this.url}/getSingleDoacao`, { params: { id: id } })
      .pipe(
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
    return this.http
      .get<any>(`${this.url}/getMetaFixa`, { params: { id: id } })
      .pipe(
        catchError((error) => {
          console.error("Erro ao obter os dados:", error);
          return of(null);
        })
      );
  }

  getHistoricoByCategoria(categoria: string): Observable<any> {
    return this.http
      .get<any>(`${this.url}/getHistoricoByCategoria`, {
        params: { categoria: categoria },
      })
      .pipe(
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

  async addAddress(newValue: any): Promise<number> {
    const addressToAdd = { ...newValue };
    //console.log(addressToAdd);

    return new Promise<number>((resolve, reject) => {
      this.http.post<any>(`${this.url}/addAddress`, addressToAdd).subscribe({
        next: (data) => {
          if (data && data.id) {
            resolve(data.id);
          } else {
            throw new Error("ID do endereço não encontrado");
          }
        },
        error: (err) => {
          console.error(err);
          reject(err);
        },
      });
    });
  }

  async addFamilia(newFamily: any): Promise<number> {
    const familyToAdd = { ...newFamily };

    return new Promise<number>((resolve, reject) => {
      this.http.post<any>(`${this.url}/addFamilia`, familyToAdd).subscribe({
        next: (data) => {
          const familyId = data?.id;

          if (familyId) {
            resolve(familyId);
          } else {
            reject(new Error("Erro ao adicionar familia!"));
          }
        },
        error: (err) => {
          console.error(err);
          reject(err);
        },
      });
    });
  }

  async addMembroToFamily(familyId: any, newMembers: any): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.http.post<any>(`${this.url}/addMemberToFamilia`, {familyId, newMembers}).subscribe({
        next: (data) => {
          const membroId = data?.id;

          if (membroId) {
            resolve(membroId);
          } else {
            reject(new Error("Erro ao adicionar membro na familia!"));
          }
        },
        error: (err) => {
          console.error(err);
          reject(err);
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

      this.http.put<any>(`${this.url}/updateDoacao`, itemToAtt).subscribe({
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
        .put<any>(`${this.url}/updateQntdInDoacao`, itemToAtt)
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
        .put<any>(`${this.url}/updateMetaInDoacao`, itemToAtt)
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

  async updateMetaFixa(newValue: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const itemToAtt = {
        qntdMetaAll: newValue.qntd,
        nome: newValue.nome,
        id: newValue.id,
      };

      this.http.put<any>(`${this.url}/updateMetaFixa`, itemToAtt).subscribe({
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
        this.http
          .delete<any>(`${this.url}/deleteDoacao`, { params: { id } })
          .subscribe({
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
        this.http
          .delete<any>(`${this.url}/deleteMultiHistorico`, { params: { id } })
          .subscribe({
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
        this.http
          .delete<any>(`${this.url}/deleteSingleHistorico`, { params: { id } })
          .subscribe({
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

  async deleteFamilyById(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      
      if (id) {
        this.http
          .delete<any>(`${this.url}/deleteFamilyById`, { params: { id } })
          .subscribe({
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
