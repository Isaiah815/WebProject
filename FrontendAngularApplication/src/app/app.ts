import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import{FormsModule,ReactiveFormsModule} from'@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone:true,
  selector: 'app-root',
  imports: [RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
   
  ],
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.scss']
})
export class App {
  protected title = 'AngularApplication';
}

