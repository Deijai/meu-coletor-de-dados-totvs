import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import type { ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  public async showToast(options: ToastOptions): Promise<any> {
    return await this.toastController.create(options);
  }
}
