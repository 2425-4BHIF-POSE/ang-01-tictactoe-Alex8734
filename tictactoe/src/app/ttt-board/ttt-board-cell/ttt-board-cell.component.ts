import {Component, input, InputSignal, output, OutputEmitterRef, signal, WritableSignal} from '@angular/core';
import {Peace} from '../ttt-board.component';
import {MatCard} from '@angular/material/card';
import {MatCell} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {MatGridTile} from '@angular/material/grid-list';

@Component({
  selector: 'app-ttt-board-cell',
  standalone: true,
  imports: [
    MatCard,
    MatCell,
    MatGridTile,
    MatButton,
    MatGridTile
  ],
  templateUrl: './ttt-board-cell.component.html',
  styleUrl: './ttt-board-cell.component.scss'
})
export class TttBoardCellComponent {

  public readonly cellPeace: InputSignal<Peace> = input.required();
  public readonly onSet: OutputEmitterRef<void> = output();

  protected handleClick(): void {
    if (this.cellPeace() === Peace.Blank) {
      this.onSet.emit();
    }
  }
}
