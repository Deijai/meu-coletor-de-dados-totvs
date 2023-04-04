import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../shared/services/toast.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../shared/services/loading.service';
import { Host } from 'src/app/shared/interfaces/host.interface';
import { NetworkService } from '../../shared/services/network.service';
import { HostService } from '../../shared/services/host.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host-register',
  templateUrl: './host-register.page.html',
  styleUrls: ['./host-register.page.scss'],
})
export class HostRegisterPage implements OnInit {
  public hostRegisterForm = this.fb.group({
    protocol: ['', [Validators.required]],
    address: ['', [Validators.required]],
    port: ['', [Validators.required]],
    endpoint: ['', [Validators.required]],
  });

  public showSaveButton: boolean = false;

  public host!: Host;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private networkService: NetworkService,
    private hostService: HostService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('ngOnInit');
    this.networkService.changeConnectionMobile();
  }

  public async showToast(
    message: string,
    duration: number,
    icon: string,
    color?: string,
    cssClass?: string,
  ) {
    const toast = await this.toastService.showToast({
      message,
      duration,
      position: 'top',
      color,
      icon,
      mode: 'ios',
      cssClass,
    });

    toast.present();
  }

  public async registerHost() {
    console.log(this.hostRegisterForm);
    const loading = await this.loadingService.showLoading({
      message: 'Loading...',
      cssClass: 'success',
    });

    loading.present();

    if (!this.host) {
      return;
    }
    this.hostService.save(this.host).then((status) => {
      if (!status) {
        this.showToast(
          'Erro ao salvar o rest',
          5000,
        'alert-circle-outline',
        'danger',
        );
        loading.dismiss();
      } else {
        this.showToast(
          'Endereço rest validado com sucesso',
          5000,
          'alert-circle-outline',
          'success',
        );
        loading.dismiss();

        this.router.navigateByUrl('/signin');
      }
    });

    setInterval(async () => {
      loading.dismiss();
    }, 5000);
  }

  public async hostIsOnline() {
    const protocol = String(this.hostRegisterForm.get('protocol')?.value);
    const address = String(this.hostRegisterForm.get('address')?.value);
    const port = Number(this.hostRegisterForm.get('port')?.value);
    const endpoint = String(this.hostRegisterForm.get('endpoint')?.value);

    if (this.hostRegisterForm.invalid) {
      this.showToast(
        'Preencha todas as informações',
        5000,
        'alert-circle-outline',
        'danger',
      );
      return;
    }
    const loading = await this.loadingService.showLoading({
      message: 'Loading...',
      cssClass: 'success',
    });

    loading.present();

    this.host = {
      protocol,
      address,
      port,
      endpoint,
    };
    this.hostService.test(this.host).then((status) => {
      if (!status) {
        this.showToast(
          'Erro ao validar o rest',
          5000,
        'alert-circle-outline',
        'danger',
        );
      } else {
        this.showToast(
          'Endereço rest validado com sucesso',
          5000,
        'alert-circle-outline',
        'success',
        );
      }
      loading.dismiss();
      this.showSaveButton = status;
    });
  }
}
