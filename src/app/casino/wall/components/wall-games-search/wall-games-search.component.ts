import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Fornecedor } from '../../wall.component';
import { Router } from '@angular/router';
import { GameCasino } from 'src/app/shared/models/casino/game-casino';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

const LAST_GAMES_SEARCH = 'last_games_search';
const MAX_QTY_TERMS = 3;

@Component({
  selector: 'app-wall-games-search',
  templateUrl: './wall-games-search.component.html',
  styleUrls: ['./wall-games-search.component.scss']
})
export class WallGamesSearchComponent implements OnInit {
  @Input() providers: Fornecedor[] = [];
  @Input() games: GameCasino[] = []
  @Input() featuredGames: any[] = []
  @Input() isLoggedIn: boolean;
  @Input() isCliente: boolean;

  @Output() openModalLogin = new EventEmitter();
  @Output() onFilterGames = new EventEmitter();

  public term: string = '';
  public showResults: boolean = false;
  public lastGamesSearch: string[] = [];

  private searchTermSubject = new Subject<string>();

  constructor(private router: Router) {}

  get searchItemLength(): number {
    return this.gameList.length + this.providerList.length;
  }

  get showFeasturedGames(): boolean {
    return this.searchItemLength <= 0;
  }

  get showSearchResults(): boolean {
    return this.searchItemLength > 0;
  }

  get showLastGamesSearch(): boolean {
    return Boolean(this.lastGamesSearch.length);
  }

  get providerList(): Fornecedor[] {
    const term = this.term.toLowerCase();
    if(!Boolean(term)) return []

    return this.providers.filter((provider) => {
      const {
       gameFornecedor: providerSlug,
       gameFornecedorExibicao: providerName
      } = provider;

      return (
        providerName.toLowerCase().includes(term) ||
        providerSlug.toLowerCase().includes(term)
      );
    });
  }

  get gameList(): GameCasino[] {
    const term = this.term.toLowerCase();
    if(!Boolean(term)) return []

    return this.games.filter((game) => {
      const {
        gameName: name,
        fornecedorExibicao: providerName,
        fornecedor: providerSlug
      } = game;

      return (
        name.toLowerCase().includes(term) ||
        providerName.toLowerCase().includes(term) ||
        providerSlug.toLowerCase().includes(term)
      );
    });
  }

  get featuredGameList(): any[] {
    return this.featuredGames;
  }

  get isDemo(): boolean {
    return location.host === 'demo.wee.bet';
  }

  get blink(): string {
    return this.router.url.split('/')[2];
  }

  ngOnInit(): void {
    this.lastGamesSearch = this.getLastGamesSearch()

    this.searchTermSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged()
      )
      .subscribe((term) => this.setTermAndLocalStorage(term))
  }

  public handleSearch(term: string, saveStorage = true) {
    if(saveStorage) { 
      this.searchTermSubject.next(term);
    } else {
      this.setTermAndLocalStorage(term, false);
    }
  }

  private setTermAndLocalStorage(term: string, saveStorage: boolean = true) {
    this.term = term;
    if(saveStorage) this.addTermInStorage(term);
  }

  public handleClear() {
    this.term = ''
  }

  public handleCleanHistory() {
    this.setLastGamesSearch([])
  }

  public handleFocusIn() {
    this.showResults = true;
  }

  public handleClose() {
    this.showResults = false;
    this.handleClear();
  }

  public handleModalLogin() {
    this.openModalLogin.emit();
  }

  public handleFilterGamesByProvider(provider: string) {
    this.onFilterGames.emit(provider);
    this.handleClose();
  }

  private addTermInStorage(term: string) {
    if(!term) return;

    const terms: string[] = this.getLastGamesSearch();
    if(terms.length < MAX_QTY_TERMS) {
      terms.push(term);
    } else {
      terms.shift();
      terms.push(term);
    }

    this.setLastGamesSearch(terms)
  }

  private getLastGamesSearch(): string[] {
    const data = localStorage.getItem(LAST_GAMES_SEARCH);
    return (Boolean(data)) ? JSON.parse(data) : [];
  }

  private setLastGamesSearch(terms): void {
    this.lastGamesSearch = terms;
    localStorage.setItem(LAST_GAMES_SEARCH, JSON.stringify(terms));
  }
}
