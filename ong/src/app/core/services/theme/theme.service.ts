import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private readonly THEME_KEY = "theme";
  private activeThemeSubject: BehaviorSubject<string>;

  constructor() {
    const storedTheme = localStorage.getItem(this.THEME_KEY);
    const initialTheme = storedTheme ? storedTheme : "light";
    this.activeThemeSubject = new BehaviorSubject<string>(initialTheme);
  }

  setTheme(theme: string) {
    if (theme === "light" || theme === "dark") {
      this.activeThemeSubject.next(theme);
      localStorage.setItem(this.THEME_KEY, theme);
    } else {
      console.error("set undefined theme");
    }
  }

  getTheme(): Observable<string> {
    return this.activeThemeSubject.asObservable();
  }

  getCurrentTheme(): string {
    return this.activeThemeSubject.getValue();
  }
}
