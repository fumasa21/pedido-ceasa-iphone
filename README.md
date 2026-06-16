# Pedido Ceasa iPhone

Versao PWA separada do Pedido Ceasa para usar no iPhone pelo Safari.

## Publicar No GitHub Pages

1. Crie um repositorio novo no GitHub, por exemplo `pedido-ceasa-iphone`.
2. Envie todos os arquivos desta pasta para o repositorio.
3. No GitHub, abra `Settings > Pages`.
4. Em `Build and deployment`, escolha `Deploy from a branch`.
5. Selecione a branch `main` e a pasta `/root`.
6. Salve e aguarde o GitHub gerar o link HTTPS.

## Instalar No iPhone

1. Abra o link do GitHub Pages no Safari do iPhone.
2. Toque no botao de compartilhar.
3. Toque em `Adicionar a Tela de Inicio`.
4. Confirme o nome `Pedido Ceasa`.
5. Abra pelo icone criado na tela inicial.

## Restaurar Dados Do App Atual

1. No app atual, abra a aba `Backup`.
2. Toque em `Baixar Backup`.
3. Envie o arquivo para o iPhone, se necessario.
4. Abra a PWA no iPhone.
5. Na aba `Backup`, toque em `Restaurar Backup`.
6. Escolha o arquivo baixado.

## Observacoes

- Esta versao usa armazenamento proprio: `pedido-ceasa-iphone-state-v1`.
- O cache tambem e separado: `pedido-ceasa-iphone-v1`.
- O app atual e o projeto Android nao foram alterados para criar esta versao.
- No iPhone, a instalacao como PWA deve ser feita pelo Safari.
