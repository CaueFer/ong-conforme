import { Component } from "@angular/core";
import { ThemeService } from "src/app/core/services/theme/theme.service";

@Component({
  selector: "app-single-family",
  standalone: false,
  templateUrl: "./single-family.component.html",
  styleUrl: "./single-family.component.scss",
})
export class SingleFamilyComponent {
  isDark: boolean = false;

  constructor(private _themeService: ThemeService) {}

  ngOnInit() {
    this.getTheme();
  }

  getTheme() {
    const theme = this._themeService.getTheme().subscribe((theme) => {
      if (theme === "dark") this.isDark = true;
      else this.isDark = false;
    });
  }
}
