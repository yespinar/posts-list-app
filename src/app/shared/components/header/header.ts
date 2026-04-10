import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    FormsModule,
    FloatLabelModule,
    InputTextModule,
    SelectButtonModule,
    TranslatePipe,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly title = 'TechPoC';
  search: string = '';
  stateOptions: { label: string; value: string }[] = [
    { label: 'ES', value: 'ESP' },
    { label: 'EN', value: 'ENG' },
  ];
  value: string = 'ESP';
}
