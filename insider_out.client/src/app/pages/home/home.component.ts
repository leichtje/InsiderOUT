import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


interface WeatherForecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

@Component({
    selector: 'io-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
    imports: [CommonModule]
})
export class HomeComponent implements OnInit {
    public forecasts: WeatherForecast[] = [];

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.getForecasts();
    }

    getForecasts() {
      this.http.get<WeatherForecast[]>("/weatherforecast").subscribe(
            (result) => {
                this.forecasts = result;
            },
            (error) => {
                console.error(error);
            }
        );
    }
}
