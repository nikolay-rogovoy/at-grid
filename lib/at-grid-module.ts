import {NgModule}      from '@angular/core';

import {AtGrid} from './at-grid';
import {SafeHtml} from './safe-html'
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
    AtGrid,
    SafeHtml
  ]
})
export class AtGridModule { }
