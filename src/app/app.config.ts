import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { LUCIDE_ICONS, LucideIconProvider, Heart, Calendar, Target, Camera, User, Home, LogOut, Edit, Trash2, MapPin, Clock, Mail, Check, X, Send, Sparkles, Plus } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ Heart, Calendar, Target, Camera, User, Home, LogOut, Edit, Trash2, MapPin, Clock, Mail, Check, X, Send, Sparkles,Plus})},
  ]
};

