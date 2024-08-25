import { Component, OnInit } from '@angular/core';
import { ProfessorsInterface } from '../models';
import { MatDialog } from '@angular/material/dialog';
import { ProfessorsService } from '../../../core/services/professors.service';
import { ProfessorsDialogComponent } from './components/professors-dialog/professors-dialog.component';
import { tap } from 'rxjs';


// const Professors: ProfessorsInterface[] = [];


@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html',
  styleUrl: './professors.component.scss'
})


export class ProfessorsComponent implements OnInit {

  
 
  displayedColumns: string[] = [ 'name', 'surname', 'id', 'actions'];
  dataSource!: ProfessorsInterface[];

  nombreAlumno ="";

constructor(private matDialog: MatDialog, private professorsService: ProfessorsService){}

ngOnInit(): void {
    this.loadProfessors();
  }

    loadProfessors(){
    // this.isLoading = true;
    this.professorsService.getProfessors().subscribe({
      next:(studentsData)=>{
        this.dataSource = studentsData;
      },
      complete:()=> {
        // this.isLoading=false;
      },
    })}

  openDialog(): void {
    this.matDialog
    .open(ProfessorsDialogComponent)
    .afterClosed()
    .subscribe({
      next: (value) => {
        console.log('recibimos este valor: ', value);
        this.nombreAlumno =value.nombre;
        // this.dataSource.push(value);
        this.professorsService.addProfessor(value).pipe(tap(()=>this.loadProfessors())).subscribe({
          next: (professor) =>{
            this.dataSource = [...professor];      
          },
          complete: () => {
            // this.isLoading =false;
          },
        })
      },
    });
  }

  deleteProfessor(id:string, studentName:string) {
    if (confirm(`Está por eliminar el curso ${studentName}?`))
      this.professorsService.deleteProfessorByID(id, studentName)
    .pipe(tap(()=> this.loadProfessors()))
    .subscribe()
    }
  

    editProfessor(professorToEdit:ProfessorsInterface){
      this.matDialog.open(ProfessorsDialogComponent, {data:professorToEdit}).afterClosed().subscribe({
        next: (value) =>{
          if (!!value) {
            this.professorsService.editProfessorById(professorToEdit.id, value).pipe(tap(()=> this.loadProfessors())).subscribe()};
        }
      })
    }



}
