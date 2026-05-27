// Import configurazioni Angular
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

// Import routes applicazione
import { routes } from './app.routes';
import {provideHttpClient} from '@angular/common/http';

// Configurazione principale applicazione
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
