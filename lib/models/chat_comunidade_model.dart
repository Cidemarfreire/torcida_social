class ChatMensagem {
  final String mensagemId;
  final String userId;
  final String userNome;
  final String userFoto;
  final String texto;
  final DateTime timestamp;
  final String timeCoracao;

  ChatMensagem({
    required this.mensagemId,
    required this.userId,
    required this.userNome,
    required this.userFoto,
    required this.texto,
    required this.timestamp,
    required this.timeCoracao,
  });

  factory ChatMensagem.fromJson(Map<String, dynamic> json) {
    return ChatMensagem(
      mensagemId: json['mensagem_id'] as String,
      userId: json['user_id'] as String,
      userNome: json['user_nome'] as String,
      userFoto: json['user_foto'] as String? ?? '',
      texto: json['texto'] as String,
      timestamp: (json['timestamp'] as dynamic).toDate(),
      timeCoracao: json['time_coracao'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'mensagem_id': mensagemId,
      'user_id': userId,
      'user_nome': userNome,
      'user_foto': userFoto,
      'texto': texto,
      'timestamp': timestamp,
      'time_coracao': timeCoracao,
    };
  }

  String get formattedTime {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inMinutes < 1) {
      return 'agora';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}min';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h';
    } else {
      return '${difference.inDays}d';
    }
  }
}
