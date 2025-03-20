# ssh-add ~/.ssh/wb_vpn.pem

export SERVER1=front1
export SERVER2=front2
export SERVER3=front3
export SERVER4=front4
export SERVER5=front5

# npm i
npm run build

echo 'Sync FRONT1'
rsync -r ./dist/* $SERVER1:~/b/app-cambista
echo 'Sync FRONT2'
rsync -r ./dist/* $SERVER2:~/b/app-cambista
echo 'Sync FRONT3'
rsync -r ./dist/* $SERVER3:~/b/app-cambista
echo 'Sync FRONT4'
rsync -r ./dist/* $SERVER4:~/b/app-cambista
echo 'Sync FRONT5'
rsync -r ./dist/* $SERVER5:~/b/app-cambista