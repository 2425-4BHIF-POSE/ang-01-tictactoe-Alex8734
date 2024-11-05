import {Component, Signal, signal, WritableSignal} from '@angular/core';
import {TttBoardCellComponent} from './ttt-board-cell/ttt-board-cell.component';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-ttt-board',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    TttBoardCellComponent,
    MatButton,
    FormsModule
  ],
  templateUrl: './ttt-board.component.html',
  styleUrl: './ttt-board.component.scss'
})
export class TttBoardComponent {
  protected readonly cells: WritableSignal<Peace[][]> = signal(
     Array.from({length: 3}, () => Array.from({length: 3}, () => Peace.Blank))
  );

  protected lastMove: Peace = Peace.O;
  protected isGameOver: WritableSignal<boolean> = signal(false);

  protected getTurnMessage = (last:Peace):string => {
    switch (last) {
      case Peace.X:
        return 'O is next Turn!';
      case Peace.O:
        return 'X is next Turn!';
      default:
        throw new Error(`Unexpected peace ${last}`);
    }
  }

  protected message: WritableSignal<string> = signal(this.getTurnMessage(this.lastMove));

  protected readonly updatePeace = (row: number, col: number): void => {
    if(this.isGameOver()){
      return;
    }
    this.cells.update(cells => {

      cells[row][col] = this.getNextMove();
      this.message.update(()=>this.getTurnMessage(this.lastMove));
      return cells;
    });

    const winner = this.determineWinner();
    if(winner){
      this.message.update(()=>`${winner} is the winner!`);
      this.isGameOver.set(true);
      return;
    }

    if(this.cells().flat().every(cell => cell !== Peace.Blank)){
      this.message.update(()=>`It's a tie!`);
      this.isGameOver.set(true);
      return;
    }


  }

  public readonly getNextMove = ():Peace => {
    switch (this.lastMove) {
      case Peace.X:
        this.lastMove = Peace.O;
        return Peace.O;
      case Peace.O:
        this.lastMove = Peace.X;
        return Peace.X;
      default:
        throw new Error(`Unexpected peace ${this.lastMove}`);
    }

  }

  protected readonly resetGame = (): void => {
    this.cells.set(Array.from({length: 3}, () => Array.from({length: 3}, () => Peace.Blank)));
    this.message.set(this.getTurnMessage(this.lastMove));
    this.isGameOver.set(false);
  }

  protected determineWinner(): Peace | null {
    const cells = this.cells();
    const winningCombinations = [
      // Rows
      [ [0, 0], [0, 1], [0, 2] ],
      [ [1, 0], [1, 1], [1, 2] ],
      [ [2, 0], [2, 1], [2, 2] ],
      // Columns
      [ [0, 0], [1, 0], [2, 0] ],
      [ [0, 1], [1, 1], [2, 1] ],
      [ [0, 2], [1, 2], [2, 2] ],
      // Diagonals
      [ [0, 0], [1, 1], [2, 2] ],
      [ [0, 2], [1, 1], [2, 0] ]
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (cells[a[0]][a[1]] !== Peace.Blank &&
        cells[a[0]][a[1]] === cells[b[0]][b[1]] &&
        cells[a[0]][a[1]] === cells[c[0]][c[1]]) {
        return cells[a[0]][a[1]];
      }
    }

    return null;
  }

 Peace = Peace;
}


export enum Peace{
  X= 'X',
  O = 'O',
  Blank = '  '
}
