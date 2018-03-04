import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { TrainingService } from '../training.service';
import { Training } from '../training.model';
import { UIService } from '../../shared/ui.service';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

  trainings$: Observable<Training[]>;
  isLoading$: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.trainings$ = this.store.select(fromTraining.getAvailableTrainings);
    // this.trainingSubscription = this.trainingService.trainingsChanged.subscribe(
    //   trainings => {
    //     this.trainings = trainings;
    //   }
    // );
    this.fetchTrainings();
  }

  fetchTrainings() {
    this.trainingService.fetchAvailableTrainings();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startTraining(form.value.training);
  }
}
