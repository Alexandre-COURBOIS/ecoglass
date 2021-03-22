import { Component, OnInit } from '@angular/core';
import {interval} from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {

  text = [
    "Votre métropole",
    "Votre planête",
    "Mais, surtout vous !",
  ];
  rollMenu!: string;
  intervalValue: any;
  count = 0;
  show = false;

  constructor() { }

  ngOnInit() {
    this.setText();

    this.intervalValue = interval(3000).subscribe(value => {
      this.setText();
    })
  }

  setText = () => {
    this.rollMenu = this.text[this.count];
    this.count++
    if (this.count >= this.text.length) {
      this.count = 0;
    }
  }

  ngOnDestroy() {
    this.intervalValue.unsubscribe();
  }

  //Transition method

  get stateName() {
    return this.show ? 'show' : "hide";
  }

  toggle() {
    this.show = !this.show;
  }

}
