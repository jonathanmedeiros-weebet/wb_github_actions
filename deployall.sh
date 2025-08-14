#!/bin/sh

# String com os clientes separados por espaço
CLIENTES="26sports.bet amazonsport.io apostacerta.bet apostefacil.bet \
apostenasorte.bet bet1000.net.br betagora.io betcapital.com betfortuna.com.br \
betmasteroficial.net betnordeste.net.br betpix77.io betsnordeste.bet betsplay.club \
betstar.vip bnrbet.com boaaposta.net brasavipcassino.net brinksbet.com copasbet.bet \
cr7bet.online decolabet.com dentrodaaposta.com easybets.club esportbets.bet \
esporte.fit fadadopirao.bet fizabet.com gramadobet.net.br hotbetz.bet \
ingamedasorte.com joguefacil.bet kwbet.net maraplay.bet megasports.bet \
mjrsports.bet moneybets.net newbet.one novabet.site pinbet.bet pinplay.bet pintou.bet \
playnabet.com primoos.bet reidasorte.bet rondobet.com sortebet777.com sortegol.com \
sporte.vip sts13.vip supertop3.bet topbets.me ultrabetss.bet vaibet360.com viabet.com.br \
vitoriasports.vip wingobet.bet starkbet.casino avante.bet faithbets.bet"

# Limpa logs anteriores
> build_falhos.txt
> build_sucesso.txt

# Cria pasta de logs (se não existir)
mkdir -p logs

for cliente in $CLIENTES; do
  echo "🔧 Iniciando build para: $cliente"

  if npm run $cliente > "logs/$cliente.log" 2>&1; then
    echo "✅ Build sucesso: $cliente"
    echo "$cliente" >> build_sucesso.txt
  else
    echo "❌ Build falhou: $cliente"
    echo "$cliente" >> build_falhos.txt
  fi
done

echo ""
echo "🏁 Fim do processo"
echo "🟢 Sucessos: $(wc -l < build_sucesso.txt)"
echo "🔴 Falhas: $(wc -l < build_falhos.txt)"
