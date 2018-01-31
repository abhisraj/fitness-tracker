import { Training } from './training.model';
import { Subject } from 'rxjs/Subject';

export class TrainingService {

    trainingChanged = new Subject<Training>();
    private availableTrainings: Training[] = [
        {id: 'crunches', name: 'Crunches', duration: 30, calories: 8},
        {id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15},
        {id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18},
        {id: 'burpees', name: 'Burpees', duration: 160, calories: 8}
    ];

    private runningTraining: Training;
    private trainings: Training[] = [];

    getAvailableTrainings() {
        return this.availableTrainings.slice();
    }

    startTraining(selectedId: string) {
        this.runningTraining = this.availableTrainings.find(
            tr => tr.id === selectedId
        );
        this.trainingChanged.next({ ...this.runningTraining });
    }

    completeTraining() {
        this.trainings.push({
            ...this.runningTraining,
            date: new Date(),
            state: 'completed'
        });
        this.runningTraining = null;
        this.trainingChanged.next(null);
    }

    cancelTraining(progress: number) {
        this.trainings.push({
            ...this.runningTraining,
            duration: this.runningTraining.duration * (progress / 100 ),
            calories: this.runningTraining.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runningTraining = null;
        this.trainingChanged.next(null);
    }

    getRunninmgTraining() {
        return { ...this.runningTraining };
    }

    getCompletedorCancelledTrainings() {
        return this.trainings.slice();
    }
}
