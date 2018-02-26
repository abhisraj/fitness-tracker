import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operators';

import { TrainingService } from '../training.service';
import { Training } from '../training.model';
import { UIService } from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  trainings: Training[];
  private trainingSubscription: Subscription;
  private loadingSubscription: Subscription;
  isLoading = true;

  constructor(private trainingService: TrainingService, private uiService: UIService) {}

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.trainingSubscription = this.trainingService.trainingsChanged.subscribe(
      trainings => {
        this.trainings = trainings;
      }
    );
    this.fetchTrainings();
  }

  fetchTrainings() {
    this.trainingService.fetchAvailableTrainings();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startTraining(form.value.training);
  }

  ngOnDestroy() {
    if (this.trainingSubscription) {
      this.trainingSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
