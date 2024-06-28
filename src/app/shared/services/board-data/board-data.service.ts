import { Injectable, OnInit, WritableSignal, signal } from '@angular/core';
import { Board } from '../../../core/models/interfaces/board';
import { BoardService } from '../board/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Connection, Overlay, UINode, uuid } from '@jsplumb/browser-ui';
import { NodeService } from '../../../features/board/services/node/node.service';
import { CookieService } from 'ngx-cookie-service';
import { CookiesService } from '@core-services/cookies/cookies.service';
import kanban from '@core-board-templates/kanban';
import { TemplateBoard } from '../../../core/models/types/template-board';
import sprintRetro from '@core-board-templates/sprint-retrospective';
import { ElectronService } from '@core-services/electron/electron.service';
import useCase from '@core-board-templates/usecase';

@Injectable({
  providedIn: 'root'
})
export class BoardDataService implements OnInit{

  _boards: Board[] = [];
  activeId!: string;
  activeBoard!: Board;

  public get boards() : Board[] {
    return this._boards;
  }

  public set boards(v : Board[]) {
    this._boards = v;
  }

  constructor(
    protected boardService: BoardService,
    protected activatedRoute: ActivatedRoute,
    protected nodeService: NodeService,
    private router: Router,
    private cookieService: CookieService,
    private cookiesService: CookiesService,
    protected es: ElectronService
  ) {
    this.activatedRoute.queryParamMap.subscribe((p)=>{
      this.activeId = p.get("id") ?? '';
    })
    const selectedBoard = this.boards.find(e=>e.id===this.activeId);

      if(selectedBoard) {
        this.activeBoard = selectedBoard;
      }
  }

  loadBoards(boards: Board[]) {
    this.boards = boards;
  }

  createBoard(board?: Board) {
    const id = uuid();

    if(board) {
      this.boards.push({
        id,
        dateCreated: board.dateCreated,
        name: board.name,
        connetions: board.connetions,
        elements: board.elements,
        groups: board.groups,
        zoomScale: 1,
        favorite: board.favorite,

      })
    } else {
      this.boards.push({
        id,
        dateCreated: new Date(),
        name: `Untitled board`,
        connetions: [],
        elements: [],
        groups: [],
        zoomScale: 1,
        favorite: false,
      })

    }

    this.router.navigate(['/board'], {
      queryParams: {
        id,
      }
    }).then(()=>{
      try {
        this.nodeService.clearAll();
        this.saveData()
      } catch (error) {}
    })

  }

  createBoardFromTemplate(
    template:
    "sprint-retro" |
    "kanban" |
    "useCase"
  ) {

    let templateBoard: TemplateBoard = kanban;

    switch (template) {
      case "sprint-retro":
        templateBoard = sprintRetro;
        break;

      case "kanban":
        templateBoard = kanban;
        break;

      case "useCase":
        templateBoard = useCase;
        break;

      default:

        break;
    }

    console.log(sprintRetro)
    console.log(kanban)
    const id = uuid();
    this.boards.push({
      id,
      dateCreated: new Date(),
      name: templateBoard.name,
      connetions: templateBoard.connetions,
      elements: templateBoard.elements,
      groups: templateBoard.groups,
      zoomScale: templateBoard.zoomScale,
    })

    this.router.navigate(['/board'], {
      queryParams: {
        id,
      }
    })

  }

  saveData() {
    const id = this.activatedRoute.snapshot.queryParamMap.get('id')
    let board = this.boards.find(element=>element.id === id)

    if(board?.elements) board.elements=[]
    if(board?.groups) board.groups=[]
    if(board?.connetions) board.connetions=[]

    if(board) {
      this.saveConnections(board);

      this.saveNodes(board);
      board.zoomScale = this.boardService.panzoom.getScale();

      this.es.saveInDevice(JSON.stringify(board));
    }

  }

  saveConnections(board: Board){
    const connections = this.boardService.instance.getConnections({
      scope: '*',
    })
    if(connections instanceof Array) {
      connections.forEach((connection: Connection)=>{
        type CustomOverlay2 <T> = Partial<T> & {
          canvas?: HTMLInputElement
        };//? For some reason, JsPlumb 'CustomOverlay' base type don't have the reference for 'canvas', which is necessary to get internal information about the overlay

        const paintStyle = connection.paintStyle;
        const hoverPaintStyle = connection.hoverPaintStyle;
        const endpointStyle = connection.endpointStyle;
        const sourceId = connection.sourceId;
        const targetId = connection.targetId;
        let overlays:{
          label:{
            inputValue:string,
          }
        }[]=[];

        for (const key in connection.overlays) {
          const overlay:CustomOverlay2<Overlay> = connection.overlays[key];
          const inputValue = overlay.canvas?.value ?? '';
          overlays.push({
            label:{
              inputValue,
            }
          })
        }

        board.connetions.push({
          anchor: "Continuous",
          connector: "Bezier",
          sourceId,
          targetId,
          paintStyle,
          hoverPaintStyle,
          endpointStyle,
          overlays
        })
      })
    }
  }

  saveNodes(board: Board){
    const elements = this.boardService.instance.getManagedElements()
    for (const key in elements) {
      const element = elements[key].el
      if(element instanceof HTMLElement) {
        try {
          const groupElement = elements[key].el._jsPlumbGroup;
          const groupId = groupElement.elId;
          const children: {id:string| null}[] = [];

          groupElement.children.forEach((subElement: UINode<Element>)=>{
            const childId = subElement.el.getAttribute('data-jtk-managed')
            children.push({
              id: childId,
            })
          })

          board.groups.push({
            groupId,
            children
          })

        } catch (error) {}

        const x = Number(element.style.left.replace(/[a-z]/g,''));
        const y = Number(element.style.top.replace(/[a-z]/g,''));
        const width = Number(element.style.width.replace(/[a-z]/g,''));
        const height = Number(element.style.height.replace(/[a-z]/g,''));
        const color = element.style.backgroundColor;
        const innerText = element.querySelector('textarea')?.value ?? null;
        const type = element.classList.contains('nodeGroup') ? 'group' : 'node'
        const id = this.boardService.instance.getId(element);

        board.elements.push({
          x,
          y,
          width,
          height,
          innerText,
          color,
          type,
          id
        })
      }
    }
  }

  getData(id: string) {
    return this.boards.find(element => element.id === id)
  }

  getActiveBoard() {
    return this.getData(this.activeId);
  }

  deleteBoard(id: string) {
    console.log('DELETE BOARD (board data)')
    let newBoards: Board[] = this.boards.filter((board: Board)=>{
      if(board.id === id) {
        return false;
      }
      return true;
    })
    this.boards = newBoards;

    this.es.deleteBoard(id);
  }

  toggleFavorite(id: string) {

    let newBoards: Board[] = this.boards.map(element=>{
      if(element.id === id) {
        if(element.favorite) {
          element.favorite = !element.favorite;
        } else {
          element.favorite = true;
        }
        console.log(JSON.stringify(element))
        this.es.saveInDevice(JSON.stringify(element));
      }
      return element
    })

    this.boards = newBoards;
  }

  editBoardName(id: string, name: string) {
    let selectedBoard = this.boards.find(e=>e.id===id);
    let newBoards: Board[] = this.boards.map((board: Board)=>{
      if(board.id === id) {
        return {
          ...board,
          name,
        }
      }
      return board
    })
    this.boards = newBoards;

    this.es.saveInDevice(JSON.stringify(selectedBoard));
  }

  ngOnInit(): void {
    this.activeId = this.activatedRoute.snapshot.paramMap.get('id') ?? 'null';
  }
}
