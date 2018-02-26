import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    declarations: [],
    imports: [
        FormsModule,
        CommonModule,
        MaterialModule,
        FlexLayoutModule
    ],
    exports: [
        FormsModule,
        CommonModule,
        MaterialModule,
        FlexLayoutModule
    ]
})
export class SharedModule {}
