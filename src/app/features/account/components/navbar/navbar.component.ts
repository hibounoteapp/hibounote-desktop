import { Component } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ElectronService } from '@core-services/electron/electron.service';
import { IconService } from '@shared-services/icon/icon.service';

@Component({
  selector: 'account-navbar',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatTooltip
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(
    iconService: IconService,
    protected electron: ElectronService
  ){}

  openLink(link: string) {
    this.electron.openLink(link);
  }
}
