import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-white/98 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full border border-white/30 animate-slide-up">
        <div class="flex items-center gap-3 mb-4">
          <div [class]="data.isDanger ? 'p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl' : 'p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl'">
            <lucide-icon [name]="data.isDanger ? 'trash-2' : 'check'" class="text-white" [size]="24"></lucide-icon>
          </div>
          <h3 class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">{{ data.title }}</h3>
        </div>
        <p class="text-gray-600 text-base mb-8 leading-relaxed">{{ data.message }}</p>
        <div class="flex gap-3">
          <button
            (click)="dialogRef.close(false)"
            class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200">
            {{ data.cancelText }}
          </button>
          <button
            (click)="dialogRef.close(true)"
            [class]="data.isDanger ? 'flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200' : 'flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200'">
            {{ data.confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .animate-fade-in {
      animation: fade-in 0.2s ease-out;
    }

    .animate-slide-up {
      animation: slide-up 0.3s ease-out;
    }
  `]
})
export class ConfirmDialogComponent {
  public dialogRef = inject(DialogRef);
  public data = inject<{
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    isDanger?: boolean;
  }>(DIALOG_DATA);
}
