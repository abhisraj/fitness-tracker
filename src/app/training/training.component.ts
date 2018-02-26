import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TrainingService } from './training.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {

  ongoingTraining = false;
  trainingSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.trainingSubscription = this.trainingService.trainingChanged.subscribe(
      training => {
        if (training) {
          this.ongoingTraining = true;
        } else {
          this.ongoingTraining = false;
        }
      }
    );
  }

  ngOnDestroy () {
    if (this.trainingSubscription) {
      this.trainingSubscription.unsubscribe();
    }
  }

}
