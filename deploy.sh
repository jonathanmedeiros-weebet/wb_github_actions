# ssh-add ~/.ssh/wb_vpn.pem

export SERVER=cambista.bet4.wee.bet
npm i
npm run build
rsync -r ./dist/* $SERVER:/var/www/cambista.bet4.wee.bet