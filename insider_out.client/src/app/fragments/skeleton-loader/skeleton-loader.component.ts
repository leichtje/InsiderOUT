
import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'io-skeleton-loader',
    standalone: true,
    imports: [],
    templateUrl: './skeleton-loader.component.html',
    styleUrl: './skeleton-loader.component.scss'
})
export class SkeletonLoaderComponent implements OnInit {
    @Input() lines = 3;
    
    lineWidths: number[] = [];

    ngOnInit() {
        this.generateWidths();
    }

    ngOnChanges() {
        this.generateWidths();
    }

    private generateWidths() {
        this.lineWidths = Array(this.lines).fill(0).map(() => 
            Math.floor(Math.random() * (100 - 70 + 1)) + 70
        );
    }
}