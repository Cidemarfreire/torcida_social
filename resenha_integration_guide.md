# Guia de Integração - Aba RESENHA (Torcida Social)

## Visão Geral
Este módulo implementa um feed de vídeos curtos estilo TikTok com chat comunitário instantâneo para o app Torcida Social em Flutter e Firebase.

## Estrutura de Arquivos

```
lib/
├── models/
│   ├── resenha_video_model.dart      # Modelo de dados para vídeos
│   └── chat_comunidade_model.dart   # Modelo de dados para mensagens
├── widgets/
│   ├── resenha_video_player.dart    # Player de vídeo
│   └── resenha_chat_bottom_sheet.dart # Chat flutuante (BottomSheet)
└── pages/
    └── resenha_page.dart            # Página principal com PageView
```

## Dependências Necessárias

Adicione ao seu `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  cloud_firestore: ^4.0.0
  video_player: ^2.8.0
  chewie: ^1.7.0
```

## Configuração do Firestore

### 1. Criar Coleção Principal

No Firebase Console, crie a coleção `resenha_videos` com a seguinte estrutura:

```json
{
  "video_id": "string",
  "criador_id": "string",
  "nome_canal": "string",
  "origem_plataforma": "youtube_shorts | instagram_reels | tiktok",
  "url_direta_video": "string",
  "legenda_original": "string",
  "data_indexacao": "timestamp",
  "metricas_internas": {
    "likes_app": "number",
    "visualizacoes_app": "number"
  },
  "polo_apadrinhado": "string"
}
```

### 2. Criar Subcoleção de Chat

Para cada documento de vídeo, crie a subcoleção `chat_comunidade` com a estrutura:

```json
{
  "mensagem_id": "string",
  "user_id": "string",
  "user_nome": "string",
  "user_foto": "string",
  "texto": "string",
  "timestamp": "timestamp",
  "time_coracao": "string"
}
```

## Como Usar

### 1. Importar a Página

No seu arquivo de navegação ou rota:

```dart
import 'package:torcida_social/pages/resenha_page.dart';
```

### 2. Navegar para a Página

```dart
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => const ResenhaPage()),
);
```

### 3. Configurar Autenticação

No arquivo `resenha_page.dart`, substitua os dados simulados do usuário:

```dart
// Substituir por dados reais da autenticação
final String _currentUserId = user.uid;
final String _currentUserNome = user.displayName ?? 'Torcedor';
final String _currentUserFoto = user.photoURL ?? '';
```

## Funcionalidades Implementadas

### Feed de Vídeos
- ✅ PageView com rolagem vertical
- ✅ Player de vídeo automático com loop
- ✅ Proporção 9:16 (tela cheia)
- ✅ Play/pause automático ao mudar de página

### Interface Visual
- ✅ Nome do canal e plataforma
- ✅ Legenda do vídeo
- ✅ Polo apadrinhado
- ✅ Gradiente para melhor legibilidade

### Botões de Ação
- ✅ Curtir (com contador)
- ✅ Apoiar Polo (Troféu)
- ✅ Entrar na Resenha (Chat)
- ✅ Compartilhar (placeholder)

### Chat Comunitário
- ✅ BottomSheet deslizante
- ✅ StreamBuilder para mensagens em tempo real
- ✅ Campo de texto com botão de envio
- ✅ Avatar do usuário
- ✅ Timestamp formatado
- ✅ Mensagens agrupadas por usuário

## Personalização

### Cores e Estilo
Edite os valores de cor nos widgets para combinar com o tema do seu app:

```dart
// Exemplo: mudar cor do botão principal
color: Colors.green.withOpacity(0.3),
```

### Ícones
Substitua os ícones do Material Icons por ícones personalizados se necessário.

### Player de Vídeo
O widget usa o pacote `chewie` para o player. Você pode personalizar:

```dart
_chewieController = ChewieController(
  videoPlayerController: _videoPlayerController!,
  autoPlay: widget.isPlaying,
  looping: true,
  showControls: false,
  aspectRatio: 9 / 16,
  // Adicione mais configurações aqui
);
```

## Regras de Segurança do Firestore

Recomendado adicionar regras de segurança:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Regras para vídeos
    match /resenha_videos/{videoId} {
      allow read: if true;
      allow write: if request.auth != null;
      
      // Regras para chat
      match /chat_comunidade/{messageId} {
        allow read: if true;
        allow create: if request.auth != null;
        allow update, delete: if request.auth.uid == resource.data.user_id;
      }
    }
  }
}
```

## Troubleshooting

### Vídeo não carrega
- Verifique se a URL do vídeo é válida e acessível
- Confirme se o pacote `video_player` e `chewie` estão instalados

### Chat não atualiza
- Verifique as regras de segurança do Firestore
- Confirme se a subcoleção `chat_comunidade` está criada

### Erro de permissão
- Verifique se o usuário está autenticado
- Confirme as regras de segurança do Firestore

## Próximos Passos

- [ ] Integrar com sistema de autenticação real
- [ ] Adicionar animações de transição
- [ ] Implementar sistema de notificações
- [ ] Adicionar filtros por categoria/polo
- [ ] Implementar busca de vídeos
- [ ] Adicionar funcionalidade de comentar em vídeos específicos
- [ ] Implementar sistema de reportar conteúdo

## Suporte

Para dúvidas ou problemas, consulte a documentação oficial:
- [Flutter](https://flutter.dev/docs)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Video Player](https://pub.dev/packages/video_player)
- [Chewie](https://pub.dev/packages/chewie)
