import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Training } from './training.model';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as TrainingAct from './training.actions';
import * as fromTraining from './training.reducer';

@Injectable()
export class TrainingService {
    private fbSubs: Subscription[] = [];

    constructor(
        private db: AngularFirestore,
        private uiService: UIService,
        private store: Store<fromTraining.State>
    ) {}

    fetchAvailableTrainings() {
        this.store.dispatch(new UI.StartLoading());
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
            .subscribe(
                (trainings: Training[]) => {
                    this.store.dispatch(new UI.StopLoading());
                    this.store.dispatch(new TrainingAct.SetAvailableTrainings(trainings));
            }, error => {
                this.store.dispatch(new UI.StopLoading());
                this.uiService.showSnackbar('Fetching training failed, please try again later', null, 3000);
            })
        );
    }

    startTraining(selectedId: string) {
        this.store.dispatch(new TrainingAct.StartTraining(selectedId));
    }

    completeTraining() {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(
            ex => {
                this.addDataToDatabase({
                    ...ex,
                    date: new Date(),
                    state: 'completed'
                });
                this.store.dispatch(new TrainingAct.StopTraining());
            }
        );
    }

    cancelTraining(progress: number) {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(
            ex => {
                this.addDataToDatabase({
                    ...ex,
                    duration: ex.duration * (progress / 100 ),
                    calories: ex.calories * (progress / 100),
                    date: new Date(),
                    state: 'cancelled'
                });
                this.store.dispatch(new TrainingAct.StopTraining());
            }
        );
    }

    fetchCompletedorCancelledTrainings() {
        this.fbSubs.push(this.db.collection('finishedTrainings')
            .valueChanges()
            .subscribe((trainings: Training[]) => {
                this.store.dispatch(new TrainingAct.SetFinishedTrainings(trainings));
        }));
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(training: Training) {
        this.db.collection('finishedTrainings').add(training);
    }
}
