import { Subject } from 'rxjs/Subject';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';


@Injectable()

export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(private router: Router,
        private afuth: AngularFireAuth,
        private trainingService: TrainingService,
        private snakbar: MatSnackBar,
        private uiService: UIService
    ) {}

    initAuthListner() {
        this.afuth.authState.subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            } else {
                this.trainingService.cancelSubscriptions();
                this.isAuthenticated = true;
                this.authChange.next(false);
                this.router.navigate(['/login']);
            }
        });
    }

    registerUser(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afuth.auth.createUserAndRetrieveDataWithEmailAndPassword(
            authData.email,
            authData.password
        ).then(result => {
            this.uiService.loadingStateChanged.next(false);
        }).catch(error => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(error.message, null, 3000);
        });
    }

    login (authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afuth.auth.signInWithEmailAndPassword(
            authData.email,
            authData.password
        ).then(result => {
            this.uiService.loadingStateChanged.next(false);
        }).catch(error => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(error.message, null, 3000);
        });
    }

    logout() {
        this.afuth.auth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }
}
