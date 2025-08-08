// src/app/services/version-check.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { projectConstantsLocal } from '../constants/project-constants';

@Injectable({
  providedIn: 'root'
})
export class VersionCheckService {
  private readonly checkInterval = 1000 * 60 * 5; // 5 minutes
  private readonly versionUrl = 'https://files.loancrm.org/version.json';
  private intervalId: any;

  constructor(private http: HttpClient) { }

  public start(): void {
    this.checkVersion(); // Run once immediately
    this.intervalId = setInterval(() => this.checkVersion(), this.checkInterval);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      // console.log('🛑 Version polling stopped.');
    }
  }

  private checkVersion(): void {
    const currentVersion = projectConstantsLocal.VERSION_DESKTOP;
    const cacheBuster = Date.now();

    this.http.get<{ version: string }>(`${this.versionUrl}?_ts=${cacheBuster}`).subscribe({
      next: ({ version: serverVersionRaw }) => {
        const serverVersion = serverVersionRaw?.trim();
        if (!serverVersion) {
          console.warn('⚠️ version.json returned an empty version.');
          return;
        }

        const urlVersion = this.getVersionFromUrl();
        const alreadyReloaded = localStorage.getItem('versionReloaded');

        const isMismatch = serverVersion !== currentVersion;
        const isUrlOutdated = urlVersion !== serverVersion;

        if ((isMismatch || isUrlOutdated) && !alreadyReloaded) {
          console.warn(
            `🚨 Version mismatch: Local(${currentVersion}), Server(${serverVersion}), URL(${urlVersion}). Forcing reload.`
          );

          localStorage.setItem('versionReloaded', 'true');
          const baseUrl = `${window.location.origin}${window.location.pathname}`;
          window.location.href = `${baseUrl}?v=${serverVersion}`; // harsh reload with version
        } else if (!isMismatch && !isUrlOutdated) {
          localStorage.removeItem('versionReloaded');
          // console.log('✅ Version is up-to-date:', serverVersion);
        } else {
          // console.log('🔁 Already reloaded once. Skipping reload.');
        }
      },
      error: (error) => {
        console.error('❌ Failed to check version.json:', error);
      }
    });
  }

  private getVersionFromUrl(): string | null {
    return new URLSearchParams(window.location.search).get('v');
  }
}
