import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {

  @Input() isLoading: boolean = false;
  @Input() loadingMessage: string = 'Loading...';
}
