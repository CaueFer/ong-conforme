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
    if (theme === "light" || theme === "dark") {
      this.activeTheme = theme;
      localStorage.setItem(this.THEME_KEY, this.activeTheme);
    } else console.error("set undefined theme");
  }

  getTheme(): string {
    return this.activeTheme;
  }
}
