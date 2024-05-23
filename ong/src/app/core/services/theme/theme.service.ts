import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private readonly THEME_KEY = "theme";
  private activeTheme: string;

  constructor() {
    const storedTheme = localStorage.getItem(this.THEME_KEY);
    this.activeTheme = storedTheme ? storedTheme : "light";
  }

  setTheme(theme: string) {
    this.activeTheme = theme;
    localStorage.setItem(this.THEME_KEY, this.activeTheme);
  }

  getTheme(): string {
    return this.activeTheme;
  }
}
