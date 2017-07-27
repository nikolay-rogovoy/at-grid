import {NgModule}      from '@angular/core';

import {AtGrid} from './at-grid';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  imports:
    [
      CommonModule, // Критические провайдеры, NgIf и NgFor
      FormsModule
    ],
  exports: [
    AtGrid
  ],
  declarations: [
    AtGrid
  ]
})
export class AtGridModule { }
