import { CommonModule } from "@angular/common";
import { Component, input, computed, inject } from "@angular/core";
import { BidiModule } from "@angular/cdk/bidi";
import { UserModel } from "../../../models/user.model";
import { ThemeService } from "../../../services/theme.service";

@Component({
    selector: 'io-avatar-view',
    templateUrl: 'avatar-view.component.html',
    styleUrl: 'avatar-view.component.scss',
    standalone: true,
})
export class AvatarViewComponent {

    private avatarLightColors = [
        '#FFAB91', // Light Salmon
        '#FFCC80', // Light Orange
        '#E6EE9B', // Light Lime
        '#80CBC4', // Light Teal
        '#a7dbf3ff', // Light Blue
        '#a8cdeaff', // Lighter Blue
        '#cac2d8ff', // Light Purple
        '#e9a8bdff', // Light Pink
        '#CFD8DC', // Blue Grey
        '#A5D6A7', // Light Green
    ];

    private avatarDarkColors = [
        '#aa3737ff', // Dark Salmon
        '#a87b38ff', // Dark Orange
        '#8e9e18ff', // Dark Lime
        '#359d92ff', // Dark Teal
        '#306a84ff', // Dark Blue
        '#408cc7ff', // Darker Blue
        '#7a55baff', // Dark Purple
        '#af3b60ff', // Dark Pink
        '#5f737bff', // Blue Grey
        '#369a39ff', // Dark Green
    ];

    private themeService = inject(ThemeService);

    user = input<UserModel>();

    initials = computed(() => {
        const currentUser = this.user();

        if (currentUser?.firstName && currentUser?.lastName) {
            return currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0);
        }
        
        return null;
    });

    backgroundColor = computed(() => {
        const currentInitials = this.initials();
        
        const isDark = this.themeService.isDark(); 
        
        const colorPalette = isDark ? this.avatarDarkColors : this.avatarLightColors;

        if (currentInitials) {
            const charCode = currentInitials.charCodeAt(0);
            const colorIndex = charCode % colorPalette.length;
            
            return colorPalette[colorIndex];
        }

        return isDark ? '#424242' : '#BDBDBD';
    });
}