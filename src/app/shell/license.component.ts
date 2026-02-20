import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShellService } from './shell.service';
import { AlertService } from '@app/_services';

@Component({
    templateUrl: './license.component.html',
    standalone: false
})
export class LicenseComponent implements OnInit {
    licenseForm: FormGroup;
    showTerms = false;

    constructor(
        public shellService: ShellService,
        private formBuilder: FormBuilder,
        private alertService: AlertService
    ) {
        this.licenseForm = this.formBuilder.group({
            code: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.shellService.checkLicense();
    }

    activate() {
        if (this.licenseForm.invalid) return;

        const code = this.licenseForm.value.code;

        this.shellService.activateLicense(code).subscribe({
            next: (status) => {
                if (status.valid) {
                    // Update local state immediately based on backend response
                    if (status.licenseExpiryDate) {
                        localStorage.setItem('license_expiry', status.licenseExpiryDate);
                        this.shellService.licenseExpiry.set(status.licenseExpiryDate);
                    }
                    localStorage.setItem('hw_locked', 'true');
                    this.shellService.isHardwareLocked.set(true);

                    // The backend might return 'active' or 'SAAS' mode, let checkLicense handle the mapping
                    this.shellService.checkLicense();

                    this.alertService.success('Licentie succesvol geactiveerd!', { keepAfterRouteChange: true });
                    this.licenseForm.reset();
                } else {
                    this.alertService.error('Ongeldige activatie code.');
                }
            },
            error: (error) => {
                console.error('Activation error:', error);
                this.alertService.error('Er is een fout opgetreden bij het activeren van de licentie. Probeer het later opnieuw.');
            }
        });
    }

    public toggleTerms() {
        // Method kept for backward compatibility if needed, but UI link removed
        this.showTerms = !this.showTerms;
    }

    copyHardwareId(element: HTMLElement) {
        // Method kept for backward compatibility if needed in template, but functionality removed
    }

    deactivate() {
        if (confirm('Weet je zeker dat je de licentie op dit apparaat wilt deactiveren?')) {
            this.shellService.deactivate();
            this.alertService.success('Licentie gedeactiveerd.');
        }
    }
}
