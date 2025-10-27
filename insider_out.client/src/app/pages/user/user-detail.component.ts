import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserViewComponent } from './user-detail-view/user-detail-view.component';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'io-user-detail',
    templateUrl: './user-detail.component.html',
    standalone: true,
    imports: [CommonModule, UserViewComponent]
})
export class UserDetailComponent {

    userId: string | null = null;
    private routeSub: Subscription | undefined;

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.routeSub = this.route.paramMap.subscribe(params => {
        this.userId = params.get('id');
        
        // Call data-fetching service here
        // this.userService.getUser(this.userId);
        });
    }

    ngOnDestroy(): void {
        this.routeSub?.unsubscribe();
    }
}
