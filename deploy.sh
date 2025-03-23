echo ""
echo ""
echo ""
echo "Iniciando deploy"
echo ""
echo ""
echo ""
echo "1 - Verificando e instalando dependências;"
echo ""
echo ""
echo ""

npm i

echo ""
echo ""
echo ""


#Fronts
read -p "Deseja atualizar app do cambista nos fronts (1,2,3,4 e 5)? (y/n): " resposta
echo ""
echo ""
echo ""

if [[ "$resposta" =~ ^[Yy]$ ]]; then
    echo "Você escolheu SIM! Executando ação..."

    if ! command -v rsync &> /dev/null; then
        echo "❌ O rsync NÃO está instalado. Instale o rsync para continuar."
        exit 1  # Encerra o script
    fi

    if ! grep -q "Host front1" ~/.ssh/config; then
        echo "❌ O host 'front1' NÃO está configurado no SSH."
        exit 1  # Encerra o script se não encontrado
    fi

    if ! grep -q "Host front2" ~/.ssh/config; then
        echo "❌ O host 'front2' NÃO está configurado no SSH."
        exit 1  # Encerra o script se não encontrado
    fi

    if ! grep -q "Host front3" ~/.ssh/config; then
        echo "❌ O host 'front3' NÃO está configurado no SSH."
        exit 1  # Encerra o script se não encontrado
    fi

    if ! grep -q "Host front4" ~/.ssh/config; then
        echo "❌ O host 'front4' NÃO está configurado no SSH."
        exit 1  # Encerra o script se não encontrado
    fi

    if ! grep -q "Host front5" ~/.ssh/config; then
        echo "❌ O host 'front5' NÃO está configurado no SSH."
        exit 1  # Encerra o script se não encontrado
    fi

    npm run build:fronts

    export SERVER1=front1
    export SERVER2=front2
    export SERVER3=front3
    export SERVER4=front4
    export SERVER5=front5

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

elif [[ "$resposta" =~ ^[Nn]$ ]]; then
    echo "Você escolheu NÃO! Os fronts não serão atualizados."
else
    echo "Entrada inválida! Os fronts não serão atualizados."
fi

echo ""
echo ""
echo ""

#S3
read -p "Deseja atualizar app do cambista no S3? (y/n): " resposta
echo ""
echo ""
echo ""

if [[ "$resposta" =~ ^[Yy]$ ]]; then
    echo "Você escolheu SIM! Executando ação..."
    export BUCKET_NAME="weebet-cambista-app"
    export DISTRIBUTION_ID="E25X60X8U0HK9K"

    if ! command -v aws &> /dev/null; then
        echo "❌ AWS CLI não está instalado! Instale antes de continuar."
        exit 1  # Encerra o script
    fi

    if ! aws sts get-caller-identity &> /dev/null; then
        echo "❌ AWS CLI NÃO está configurado! Verifique com 'aws configure'."
        exit 1  # Encerra o script com erro
    fi

    if ! aws s3 ls "s3://$BUCKET_NAME" &> /dev/null; then
        echo "❌ O bucket '$BUCKET_NAME' NÃO existe!"
        exit 1  # Sai do script com erro
    fi

    echo ""
    echo ""
    echo ""
    echo "Executando build..."

    npm run build:s3

    echo ""
    echo ""
    echo ""
    echo "Iniciando transferência..."

    aws s3 sync ./dist s3://$BUCKET_NAME --delete --acl public-read

    echo ""
    echo ""
    echo ""
    echo "Invalidando distribuição..."

    echo "🚀 Iniciando invalidação de cache do CloudFront..."
    invalidation_response=$(aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*")

    # Verifica se a invalidação foi bem-sucedida
    if [ $? -eq 0 ]; then

        export INVALIDATION_ID=$(echo "$invalidation_response" | jq -r '.Invalidation.Id')
        echo "✅ Invalidação enviada com sucesso! ID da Invalidação: $INVALIDATION_ID"

        # Função para verificar o status da invalidação
        check_invalidation_status() {
            aws cloudfront get-invalidation --distribution-id "$DISTRIBUTION_ID" --id "$INVALIDATION_ID" --query "Invalidation.Status" --output text
        }

        while true; do
            invalidation_status=$(check_invalidation_status)

            if [ "$invalidation_status" == "Completed" ]; then
                echo "✅ A invalidação foi COMPLETA!"
                break
            else
                echo "🔄 Status da Invalidação: $invalidation_status. Aguardando..."
                sleep 5  # Espera 30 segundos antes de verificar novamente
            fi
        done
    else
        echo "❌ Erro ao enviar invalidação."
        exit 1
    fi
   
elif [[ "$resposta" =~ ^[Nn]$ ]]; then
    echo "Você escolheu NÃO! Os fronts não serão atualizados."
else
    echo "Entrada inválida! Os fronts não serão atualizados."
fi

echo ""
echo ""
echo ""
echo "Deploy finalizado;"
echo ""
echo ""
echo ""
