import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operators';

import { TrainingService } from '../training.service';
import { Training } from '../training.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  trainings: Training[];
  trainingSubscription: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.trainingSubscription = this.trainingService.trainingsChanged.subscribe(
      trainings => (this.trainings = trainings)
    );
    this.trainingService.fetchAvailableTrainings();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startTraining(form.value.training);
  }

  ngOnDestroy() {
    this.trainingSubscription.unsubscribe();
  }
}
