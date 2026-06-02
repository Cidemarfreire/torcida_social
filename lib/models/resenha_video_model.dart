class ResenhaVideo {
  final String videoId;
  final String criadorId;
  final String nomeCanal;
  final String origemPlataforma;
  final String urlDiretaVideo;
  final String legendaOriginal;
  final DateTime dataIndexacao;
  final MetricasInternas metricasInternas;
  final String poloApadrinhado;

  ResenhaVideo({
    required this.videoId,
    required this.criadorId,
    required this.nomeCanal,
    required this.origemPlataforma,
    required this.urlDiretaVideo,
    required this.legendaOriginal,
    required this.dataIndexacao,
    required this.metricasInternas,
    required this.poloApadrinhado,
  });

  factory ResenhaVideo.fromJson(Map<String, dynamic> json) {
    return ResenhaVideo(
      videoId: json['video_id'] as String,
      criadorId: json['criador_id'] as String,
      nomeCanal: json['nome_canal'] as String,
      origemPlataforma: json['origem_plataforma'] as String,
      urlDiretaVideo: json['url_direta_video'] as String,
      legendaOriginal: json['legenda_original'] as String,
      dataIndexacao: (json['data_indexacao'] as dynamic).toDate(),
      metricasInternas: MetricasInternas.fromJson(
        json['metricas_internas'] as Map<String, dynamic>,
      ),
      poloApadrinhado: json['polo_apadrinhado'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'video_id': videoId,
      'criador_id': criadorId,
      'nome_canal': nomeCanal,
      'origem_plataforma': origemPlataforma,
      'url_direta_video': urlDiretaVideo,
      'legenda_original': legendaOriginal,
      'data_indexacao': dataIndexacao,
      'metricas_internas': metricasInternas.toJson(),
      'polo_apadrinhado': poloApadrinhado,
    };
  }
}

class MetricasInternas {
  final int likesApp;
  final int visualizacoesApp;

  MetricasInternas({
    required this.likesApp,
    required this.visualizacoesApp,
  });

  factory MetricasInternas.fromJson(Map<String, dynamic> json) {
    return MetricasInternas(
      likesApp: json['likes_app'] as int? ?? 0,
      visualizacoesApp: json['visualizacoes_app'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'likes_app': likesApp,
      'visualizacoes_app': visualizacoesApp,
    };
  }
}
