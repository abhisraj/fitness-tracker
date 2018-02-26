import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Training } from '../training.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Training>();
  private exchangedSubscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.exchangedSubscription = this.trainingService.finishedTrainingsChanged.subscribe((trainings: Training[]) => {
      this.dataSource.data = trainings;
    });
    this.trainingService.fetchCompletedorCancelledTrainings();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    if  (this.exchangedSubscription) {
      this.exchangedSubscription.unsubscribe();
    }
  }
}
