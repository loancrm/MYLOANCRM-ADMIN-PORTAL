import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from '../contact/contact.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ContactComponent],
  imports: [CommonModule],
  exports: [ContactComponent],
})
export class ContactModule {}
