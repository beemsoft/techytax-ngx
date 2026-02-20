export interface LicenseStatusResponse {
    valid: boolean;
    licenseMode: 'trial' | 'active' | 'expired' | 'SAAS';
    trialEndDate: string;
    licenseActivationDate: string;
    licenseExpiryDate: string;
}
