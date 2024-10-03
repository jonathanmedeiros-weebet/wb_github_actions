import { NgModule, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApostaService, BilheteEsportivoService, JogoService, MessageService } from 'src/app/services';
import { ExibirBilheteCassinoComponent } from 'src/app/shared/layout/exibir-bilhete/cassino/exibir-bilhete-cassino/exibir-bilhete-cassino.component';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-compartilhar-bilhete',
  templateUrl: './compartilhar-bilhete.component.html',
  styleUrls: ['./compartilhar-bilhete.component.css'],
  providers: [TitleCasePipe]
})

export class CompartilharBilheteComponent implements OnInit {
  @ViewChild(ExibirBilheteCassinoComponent) bilheteCassinoComponent: ExibirBilheteCassinoComponent;
  @ViewChild(LayoutModule) layoutModule: LayoutModule;
  private params = this.activatedRoute.snapshot.params['codigo'];
  loading = true;
  aposta;


  constructor(
    private bilheteEsportivo: BilheteEsportivoService,
    private jogoService: JogoService,
    private cassinoApi: CasinoApiService,
    private apostaService: ApostaService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleCasePipe: TitleCasePipe
  ) { }

  ngOnInit(): void {
    this.transformBet();
  }

  transformBet() {
    if (this.params) {
      this.apostaService.getApostaByCodigo(this.params).subscribe(async aposta => {
        this.aposta = aposta;
        switch (aposta.tipo) {
          case 'esportes':
            this.esportesBet(aposta);
            break;
          case 'loteria':
            this.loteriaBet(aposta);
            break;
          case 'rifa':
            this.rifaBet(aposta);
            break;
          case 'desafio':
            this.desafioBet(aposta);
            break;
          case 'acumuladao':
            this.acumuladaoBet(aposta);
            break;
        }
      }, error => {
        this.apostaService.getApostaByCodigoCassino(this.params).subscribe(async aposta => {
          this.aposta = aposta;
          this.loading = false;
        })
      })
    }
  }

  async esportesBet(aposta) {
    try {
      if (!aposta.itens) {
        this.router.navigate(['/esportes']);
        this.messageService.error('Aposta não encontrada');
        return;
      }
      let bet = await this.jogoService.convertItemToBet(aposta.itens);
      if (bet.length) {
        this.bilheteEsportivo.atualizarItens(bet);
        this.router.navigate(['/esportes']);
        this.messageService.success('Aposta repetida com sucesso!');
        return;
      }
      this.messageService.warning('A aposta não pôde ser repetida.');
    } catch (error) {
      this.messageService.error('Erro ao converter aposta');
    }
  }

  cassinoBet() {
    this.router.navigate([`/casino/${this.aposta.fornecedor}/${this.aposta.gameID}`]);
  }

  acumuladaoBet(aposta) {
    if (!aposta.itens) {
      this.router.navigate(['/acumuladao/listagem']);
      this.messageService.error('Aposta não encontrada');
      return;
    }
    this.router.navigate(['/acumuladao/form/' + aposta.acumuladao.id]);
    this.messageService.success('Acumuladão encontrado com sucesso!');
    return;
  }

  desafioBet(aposta) {
    if (!aposta.itens) {
      this.router.navigate(['/desafios']);
      this.messageService.error('Aposta não encontrada');
      return;
    }
    this.router.navigate(['/desafios']);
    this.messageService.success('Desafio encontrado com sucesso!');
    return;
  }
  
  loteriaBet(aposta) {
    if (!aposta.itens) {
      this.router.navigate(['/loterias/' + aposta.modalidade]);
      this.messageService.error('Aposta não encontrada');
      return;
    }
    this.router.navigate(['/loterias/' + aposta.modalidade]);
    this.messageService.success(`${this.titleCasePipe.transform(aposta.modalidade)} encontrada com sucesso!`);
    return;
  }

  async rifaBet(aposta) {
    if (!aposta.itens) {
      this.router.navigate(['/rifas/show/' + aposta.sorteio_id]);
      this.messageService.error('Aposta não encontrada');
      return;
    }
    this.router.navigate(['/rifas/show/' + aposta.sorteio_id]);
    this.messageService.success(`Rifa encontrada com sucesso!`);
    return;
  }

}
