import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-componentscustom-snackbar',
  templateUrl: './componentscustom-snackbar.component.html',
  styleUrls: ['./componentscustom-snackbar.component.css']
})
export class ComponentscustomSnackbarComponent {

  constructor(
    public snackBarRef: MatSnackBarRef<ComponentscustomSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any){}

  dismiss(){
    this.snackBarRef.dismiss();
  }

}
