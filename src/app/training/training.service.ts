import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Training } from './training.model';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { UIService } from '../shared/ui.service';
import { error } from 'selenium-webdriver';

@Injectable()

export class TrainingService {

    trainingChanged = new Subject<Training>();
    trainingsChanged = new Subject<Training[]>();
    finishedTrainingsChanged = new Subject<Training[]>();
    private availableTrainings: Training[] = [];

    private runningTraining: Training;
    private fbSubs: Subscription[] = [];

    constructor(private db: AngularFirestore, private uiService: UIService) {}

    fetchAvailableTrainings() {
        this.uiService.loadingStateChanged.next(true);
        this.fbSubs.push(this.db
            .collection('availableTrainings')
            .snapshotChanges()
            .map(docArray => {
                // throw(new Error());
                return docArray.map(doc => {
                    return {
                        id: doc.payload.doc.id,
                        name: doc.payload.doc.data().name,
                        duration: doc.payload.doc.data().duration,
                        calories: doc.payload.doc.data().calories
                    };
                });
            })
            .subscribe((trainings: Training[]) => {
                this.uiService.loadingStateChanged.next(false);
                console.log(trainings);
                this.availableTrainings = trainings;
                this.trainingsChanged.next([...this.availableTrainings]);
            }, error => {
                this.uiService.loadingStateChanged.next(false);
                this.uiService.showSnackbar('Fetching training failed, please try again later', null, 3000);
                this.trainingsChanged.next(null);
            })
        );
    }

    startTraining(selectedId: string) {
        // this.db.doc('availableTrainings/' + selectedId).update({lastSelected: new Date()});
        this.runningTraining = this.availableTrainings.find(
            tr => tr.id === selectedId
        );
        this.trainingChanged.next({ ...this.runningTraining });
    }

    completeTraining() {
        this.addDataToDatabase({
            ...this.runningTraining,
            date: new Date(),
            state: 'completed'
        });
        this.runningTraining = null;
        this.trainingChanged.next(null);
    }

    cancelTraining(progress: number) {
        this.addDataToDatabase({
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

    fetchCompletedorCancelledTrainings() {
        this.fbSubs.push(this.db.collection('finishedTrainings')
            .valueChanges()
            .subscribe((trainings: Training[]) => {
                this.finishedTrainingsChanged.next(trainings);
        }));
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(training: Training) {
        this.db.collection('finishedTrainings').add(training);
    }
}
