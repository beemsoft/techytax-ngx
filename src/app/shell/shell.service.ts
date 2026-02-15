import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { LicenseStatusResponse } from '@app/_models';
import { AccountService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class ShellService {
    public isStealthMode = signal<boolean>(localStorage.getItem('stealth_mode') !== 'false');
    public isHardwareLocked = signal<boolean>(localStorage.getItem('hw_locked') === 'true');
    public licenseStatus = signal<'trial' | 'active' | 'expired' | 'SAAS'>('trial');
    public licenseExpiry = signal<string | null>(localStorage.getItem('license_expiry'));
    public trialEndDate = signal<string | null>(null);
    public activationDate = signal<string | null>(null);
    public hardwareId = signal<string>(localStorage.getItem('hw_id') || '');
    public lastBackupDate = signal<string | null>(localStorage.getItem('last_backup_date'));
    public termsAcceptedDate = signal<string | null>(localStorage.getItem('terms_accepted_date'));

    constructor(
        private http: HttpClient,
        private accountService: AccountService
    ) {
        this.accountService.user.pipe(delay(0)).subscribe(user => {
            if (user) {
                this.checkLicense();
            } else {
                // Reset state on logout
                this.licenseStatus.set('trial');
                this.licenseExpiry.set(null);
                this.trialEndDate.set(null);
                this.activationDate.set(null);
            }
        });
    }

    public markBackupDone() {
        const now = new Date().toISOString();
        localStorage.setItem('last_backup_date', now);
        this.lastBackupDate.set(now);
    }

    public activateLicense(code: string) {
        return this.http.post<LicenseStatusResponse>(`${environment.apiUrl}/auth/activate-license`, {
            code,
            hardwareId: this.hardwareId()
        });
    }

    public deactivate() {
        localStorage.removeItem('license_expiry');
        localStorage.removeItem('hw_locked');
        this.licenseExpiry.set(null);
        this.licenseStatus.set('trial');
        this.isHardwareLocked.set(false);
    }

    public checkLicense() {
        this.http.get<LicenseStatusResponse>(`${environment.apiUrl}/auth/license-status`).subscribe({
            next: (status) => {
                let mode = status.licenseMode;
                if (mode === 'SAAS') {
                    if (status.valid) {
                        // If it's SAAS and valid, it could be trial or active
                        // If no activation date but trial end date is present, it's trial
                        if (!status.licenseActivationDate && status.trialEndDate) {
                            mode = 'trial';
                        } else {
                            mode = 'active';
                        }
                    } else {
                        mode = 'expired';
                    }
                }

                // If locally we have a valid non-expired license, we trust it over the backend's 'trial' status
                // This prevents UI flickering back to trial mode before backend syncs activation
                const localExpiry = localStorage.getItem('license_expiry');
                if (localExpiry && new Date(localExpiry) > new Date() && mode === 'trial') {
                    mode = 'active';
                }

                this.licenseStatus.set(mode);
                this.licenseExpiry.set(status.licenseExpiryDate || localExpiry);
                this.trialEndDate.set(status.trialEndDate);
                this.activationDate.set(status.licenseActivationDate);
                this.hardwareId.set(status.hardwareId);
                localStorage.setItem('hw_id', status.hardwareId);

                if (status.valid) {
                    this.isHardwareLocked.set(true);
                    localStorage.setItem('hw_locked', 'true');
                    if (status.licenseExpiryDate) {
                        localStorage.setItem('license_expiry', status.licenseExpiryDate);
                    }
                } else {
                    this.isHardwareLocked.set(false);
                    localStorage.removeItem('hw_locked');
                }

                this.applyTestOverride();
            },
            error: () => {
                // Fallback to local storage if backend is unavailable or error occurs
                const expiry = localStorage.getItem('license_expiry');
                this.licenseExpiry.set(expiry);
                if (!expiry) {
                    this.licenseStatus.set('trial');
                } else {
                    const expiryDate = new Date(expiry);
                    if (expiryDate < new Date()) {
                        this.licenseStatus.set('expired');
                    } else {
                        this.licenseStatus.set('active');
                    }
                }
                this.applyTestOverride();
            }
        });
    }

    private applyTestOverride() {
        const urlParams = new URLSearchParams(window.location.search);
        const testStatus = urlParams.get('testStatus');
        if (testStatus === 'expired' || testStatus === 'trial' || testStatus === 'active') {
            this.licenseStatus.set(testStatus as any);
        }
    }

    public activateStealthMode(active: boolean) {
        this.isStealthMode.set(active);
        localStorage.setItem('stealth_mode', active.toString());
    }
}
