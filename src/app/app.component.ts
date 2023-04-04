import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { MingleService } from '@totvs/mingle';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private mingleService = new MingleService();
  constructor(private platform: Platform) {
    this.init();
  }

  private async init(){
    this.platform.ready().then(async () => {
      console.log('ready');
      await SplashScreen.hide();
      await SplashScreen.show({
        showDuration: 5000,
        autoHide: true,
      });

    });
  }

  public async initMingle(){
    const server = this.mingleService.servers.development;
    const appId = 'your_app_id';
    const web = true;
    this.mingleService.init(server, appId, web);
  }
}
