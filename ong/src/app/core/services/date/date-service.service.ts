import { Injectable } from "@angular/core";
import { formatISO, isValid, parse, parseISO } from "date-fns";

@Injectable({
  providedIn: "root",
})
export class DateService {
  constructor() {}

  isValidDate(dateString: string): boolean {
    console.log(dateString)
    // TRANSFORMA STRING EM OBJECT DATE E VALIDA O OBJECT DATE
    const dateObj = parse(dateString, "dd/MM/YYYY", new Date());
    return !isNaN(dateObj.getTime());
  }
}
