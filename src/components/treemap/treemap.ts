import { Component } from '@angular/core';

/**
 * Generated class for the TreemapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'treemap',
  templateUrl: 'treemap.html'
})
export class TreemapComponent {

  text: string;

  constructor() {
    console.log('Hello TreemapComponent Component');
    this.text = 'Hello World';
  }

}
