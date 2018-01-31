import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Training } from '../training.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

  trainings: Training[] = [];

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.trainings = this.trainingService.getAvailableTrainings();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startTraining(form.value.training);
  }

}
