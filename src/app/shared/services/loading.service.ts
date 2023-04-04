import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import type { LoadingOptions  } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private loadingController: LoadingController) { }

  public async showLoading(options: LoadingOptions ): Promise<any> {
    return await this.loadingController.create(options);
  }
}
