import { Component, Renderer2 } from '@angular/core';
import { BoardDataService } from '../../../../shared/services/board-data/board-data.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BoardService } from '../../../../shared/services/board/board.service';
import { Board } from '../../../../core/models/interfaces/board';
import {MatDialog, MatDialogModule, MatDialogConfig} from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FooterComponent } from '@shared-components/footer';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MainComponent } from '../../components/main/main.component';
import { EditBoardModalComponent } from '../../components/edit-board-modal/edit-board-modal.component';
import { IconService } from '@shared-services/icon/icon.service';
import { CookieService } from 'ngx-cookie-service';
import { CookiesService } from '@core-services/cookies/cookies.service';
import { ElectronService } from '@core-services/electron/electron.service';
import { SearchBarService } from '../../services/search-bar/search-bar.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    FooterComponent,
    NavbarComponent,
    MainComponent,
    SidebarComponent,
    EditBoardModalComponent,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent{

  constructor(
    cookieService: CookieService,
    cookiesService: CookiesService,
    public boardData: BoardDataService,
    searchBar: SearchBarService,
    protected es: ElectronService
  ) {

    let fetchedBoards = boardData.boards;
    boardData.boards=[]

    this.es.getInDevice()
    .then((res)=>{
      fetchedBoards = JSON.parse(res);

      console.log("Fetched Boards:",fetchedBoards)
      boardData.boards = fetchedBoards
      searchBar.filter('');
    })

    .catch((err)=>{
      console.log('ERROR: ',err)
      boardData.boards = []
    })



  }
}
