import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentscustomSnackbarComponent } from 'app/componentscustom-snackbar/componentscustom-snackbar.component';
import { ChecklistIdentifier } from 'app/models';
import { ChecklistService } from 'app/_services/checklist.service';
import { StorageService } from 'app/_services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class ChecklistComponent implements OnInit, OnDestroy {
  
  currentUser;
  items: string[] = [];
  newItem: string = '';
  checklistTitle: string = '';
  checklistId: string;
  selectedChecklist: string;

  checklistsDropDown: ChecklistIdentifier[];

  private subscriptions: Subscription = new Subscription();

  constructor(
    private storageService: StorageService,
    private readonly snackBar: MatSnackBar,
    private checklistService: ChecklistService
    ) { }

  ngOnInit(): void {
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('landing-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.currentUser = this.storageService.getUser()

    //find checklist of current user, if have load the first one found
    const sub = this.checklistService.getChecklist(this.currentUser.email).subscribe(
      (checklists: any[]) =>{
        if (checklists.length>0){
          //take first checklist found
          
          //map received data to checklistDropdown
          this.checklistsDropDown = checklists.map(
            checklist => {
              return {id: checklist.id, title: checklist.title} as ChecklistIdentifier;
            }
          )

          //initialise the first checklist
          this.checklistTitle = checklists[0].title;
          this.checklistId = checklists[0].id;
          this.selectedChecklist = this.checklistId;
          this.items = checklists[0].items;
        }
      }
    )

    this.subscriptions.add(sub);
  }

  //update dropdown list after save
  updateDropDown(){
    const sub6 = this.checklistService.getChecklist(this.currentUser.email).subscribe(
      (checklists: any[]) =>{
        if (checklists.length>0){          
          //map received data to checklisDropdown
          this.checklistsDropDown = checklists.map(
            checklist => {
              return {id: checklist.id, title: checklist.title} as ChecklistIdentifier;
            }
          )
        }
      }
    )
    this.subscriptions.add(sub6);
  }

  createNewCheckList(){
    const sub2 = this.checklistService.createNewChecklist(this.currentUser.email).subscribe({
      next: (response: any)=>{
        this.checklistId = response.id;
        this.checklistTitle = response.title;
        this.items = response.items;
        this.updateDropDown() //update dropdown menu for new checklist
      }, 
      error: (error: any)=>{
        console.error('Error:', error);
      }
    })
    this.subscriptions.add(sub2)
  }
  
  //loads the checklist once it is selected from dropdown
  onSelectChecklist(id: string){
    const sub3 = this.checklistService.getChecklistById(id).subscribe(
      (data: any) =>{
        this.checklistTitle = data.title;
        this.checklistId = data.id;
        this.items = data.items;
      }
    )
    this.subscriptions.add(sub3)
  }

  //success notification
  loadGreenSnackBar(message){
    this.snackBar.openFromComponent(ComponentscustomSnackbarComponent,{
      duration: 3000,
      verticalPosition: 'bottom',
      panelClass: 'custom-snackbar',
      data: {
        title: 'Success',
        message: message
      }
    })
  }

  //add item and then call success notification
  addItem(){
    this.items.push(this.newItem);
    this.newItem='';
    this.loadGreenSnackBar("Item added")
  }

  //remove item from checklist
  removeItem(index: number){
    this.items.splice(index, 1);
  }

  //drag and drop function from checklist
  drop(event: CdkDragDrop<string[]>){
    moveItemInArray(this.items,event.previousIndex,event.currentIndex)
  }

  //save items and checklist name to the backend - identified by ID which is set by backend
  saveItems(){
    //create payload
    const checklist = {
      id: this.checklistId,
      title: this.checklistTitle,
      authorEmail: this.currentUser.email,
      items: this.items
    }

    //send payload to backend
    const sub4 = this.checklistService.saveChecklist(checklist).subscribe({
      next: response => {
        this.loadGreenSnackBar("Checklist saved!")
        this.updateDropDown(); //in case it is a new checklist or if checklist name is saved
    }, error: error => {
      console.error('Error while saving checklist', error)
    }  
    })
    this.subscriptions.add(sub4)
  }

  ngOnDestroy(){
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');

    this.subscriptions.unsubscribe();
  }
}
