import { Component, OnInit, AfterViewInit } from '@angular/core';

import { EventService } from '../core/services/event.service';

import {
  LAYOUT_VERTICAL, LAYOUT_HORIZONTAL, LAYOUT_WIDTH, TOPBAR, LAYOUT_MODE, SIDEBAR_TYPE
} from './layouts.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit, AfterViewInit {

  // layout related config
  layoutType: string;
  layoutwidth: string;
  topbar: string;
  mode: string;
  sidebartype: string;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.layoutType = LAYOUT_HORIZONTAL;
    this.layoutwidth = LAYOUT_WIDTH;
    this.topbar = TOPBAR;
    this.mode = LAYOUT_MODE;
    this.sidebartype = SIDEBAR_TYPE;
  }


  ngAfterViewInit() {
  }

  isHorizontalLayoutRequested() {
    return this.layoutType === LAYOUT_HORIZONTAL;
  }
}
