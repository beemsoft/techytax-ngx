import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AlertService } from './alert.service';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class DockerService {
    private baseUrl = `${environment.apiUrl}/docker`;
    private storageKey = 'docker_image_shas';

    constructor(
        private http: HttpClient,
        private alertService: AlertService
    ) { }

    checkUpdates() {
        return this.http.get<any[]>(`${this.baseUrl}/updates`).pipe(
            map((images: any[]) => {
                const currentShas: { [key: string]: string } = {};
                images.forEach((img: any) => {
                    if (img.imageName && img.latestHash) {
                        currentShas[img.imageName] = img.latestHash;
                    }
                });

                const storedShasJson = localStorage.getItem(this.storageKey);
                if (!storedShasJson) {
                    // First time, just store them
                    localStorage.setItem(this.storageKey, JSON.stringify(currentShas));
                } else {
                    const storedShas = JSON.parse(storedShasJson);
                    const updates = [];
                    for (const imageName in currentShas) {
                        if (!storedShas[imageName]) {
                            updates.push(`New image found: ${imageName}`);
                        } else if (storedShas[imageName] !== currentShas[imageName]) {
                            updates.push(`Er is een update beschikbaar voor: ${imageName}`);
                        }
                    }

                    if (updates.length > 0) {
                        const message = `<strong>Docker Image Updates:</strong><ul>${updates.map(u => `<li>${u}</li>`).join('')}</ul>`;
                        this.alertService.info(message, { keepAfterRouteChange: true });
                        // Update stored SHAs
                        localStorage.setItem(this.storageKey, JSON.stringify(currentShas));
                    }
                }
                return currentShas;
            }),
            catchError(err => {
                console.error('Error checking Docker updates', err);
                return of(null);
            })
        );
    }
}
