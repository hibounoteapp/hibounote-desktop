import { ChangeDetectorRef, Component, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BoardDataService } from '@shared-services/board-data/board-data.service';
import { BoardService } from '@shared-services/board/board.service';
import { MatDialog } from '@angular/material/dialog';
import { Board } from '@custom-interfaces/board';
import { CommonModule } from '@angular/common';
import { BoardCardComponent } from './components/board-card/board-card.component';
import { EditBoardModalComponent } from '../../../edit-board-modal/edit-board-modal.component';
import { SearchBarService } from '../../../../services/search-bar/search-bar.service';

@Component({
  selector: 'account-main-boardsContainer',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule, BoardCardComponent],
  templateUrl: './boards-container.component.html',
  styleUrl: './boards-container.component.scss'
})
export class BoardsContainerComponent implements OnChanges{
  input: string = '';
  @Input('boardsData') boardsData!: Board[]; //? Using 'Input' to track everytime boards array changes

  constructor(
    public boardData: BoardDataService,
    private renderer: Renderer2,
    private boardService: BoardService,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    protected searchBar: SearchBarService
  ) {}

  createBoard() {
    this.boardData.createBoard()
  }

  editBoard(event: Event, id: string) {
    const dialog = this.dialog.open(EditBoardModalComponent,{
      panelClass: "edit-modal",
      data:{id:id}
    });

    dialog.afterClosed().subscribe((result)=>{
      const {id, value} = result
      if(value === '') return;

      if(result.value === '$#DELETE#$') {
        this.boardData.deleteBoard(id);
        this.searchBar.filter(this.input);
        return
      }

      this.boardData.editBoardName(id,value)
      this.searchBar.filter(this.input);
    })
  }

  setSearch(event: Event) {
    if(event.target instanceof HTMLInputElement) {
      this.input = event.target.value;
    }
    this.searchBar.setSearch(event,this.input)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.searchBar.filteredBoards = this.boardsData;
  }
}
