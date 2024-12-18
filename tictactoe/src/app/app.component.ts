import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TttBoardComponent} from './ttt-board/ttt-board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TttBoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tictactoe';
}
