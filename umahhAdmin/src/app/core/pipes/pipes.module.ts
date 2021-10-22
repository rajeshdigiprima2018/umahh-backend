import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from './truncatePipe';


@NgModule({
  imports: [
    CommonModule
  ],
  exports:  [TruncatePipe],
  declarations: [TruncatePipe]
})

export class PipesModule { }
