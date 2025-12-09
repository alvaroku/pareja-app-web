import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-xl max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">{{ data.title }}</h3>
        <p class="text-sm mb-6">{{ data.message }}</p>
        <div class="flex gap-3">
          <button
            (click)="dialogRef.close(false)"
            class="flex-1 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all">
            {{ data.cancelText }}
          </button>
          <button
            (click)="dialogRef.close(true)"
            [class]="data.isDanger ? 'flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all' : 'flex-1 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-white/90 transition-all'">
            {{ data.confirmText }}
          </button>
        </div>
      </div>
    </div>
  `
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
