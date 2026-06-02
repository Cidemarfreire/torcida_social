import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/resenha_video_model.dart';
import '../widgets/resenha_video_player.dart';
import '../widgets/resenha_chat_bottom_sheet.dart';

class ResenhaPage extends StatefulWidget {
  const ResenhaPage({Key? key}) : super(key: key);

  @override
  State<ResenhaPage> createState() => _ResenhaPageState();
}

class _ResenhaPageState extends State<ResenhaPage> {
  final PageController _pageController = PageController();
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  
  List<ResenhaVideo> _videos = [];
  bool _isLoading = true;
  int _currentIndex = 0;
  
  // Dados do usuário atual (simulado - substituir por autenticação real)
  final String _currentUserId = 'user_123';
  final String _currentUserNome = 'Torcedor';
  final String _currentUserFoto = '';

  @override
  void initState() {
    super.initState();
    _loadVideos();
  }

  Future<void> _loadVideos() async {
    try {
      final snapshot = await _firestore
          .collection('resenha_videos')
          .orderBy('data_indexacao', descending: true)
          .limit(20)
          .get();

      final videos = snapshot.docs
          .map((doc) => ResenhaVideo.fromJson(doc.data() as Map<String, dynamic>))
          .toList();

      if (mounted) {
        setState(() {
          _videos = videos;
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Erro ao carregar vídeos: $e');
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _onPageChanged(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  void _openChat(String videoId) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => ResenhaChatBottomSheet(
        videoId: videoId,
        currentUserId: _currentUserId,
        currentUserNome: _currentUserNome,
        currentUserFoto: _currentUserFoto,
      ),
    );
  }

  Future<void> _likeVideo(String videoId) async {
    try {
      final videoRef = _firestore.collection('resenha_videos').doc(videoId);
      
      await _firestore.runTransaction((transaction) async {
        final snapshot = await transaction.get(videoRef);
        if (!snapshot.exists) return;
        
        final data = snapshot.data() as Map<String, dynamic>;
        final metricas = data['metricas_internas'] as Map<String, dynamic>? ?? {};
        final currentLikes = metricas['likes_app'] as int? ?? 0;
        
        transaction.update(videoRef, {
          'metricas_internas': {
            ...metricas,
            'likes_app': currentLikes + 1,
          },
        });
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao curtir vídeo: $e')),
      );
    }
  }

  void _supportPolo(String poloNome) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Apoiando polo: $poloNome')),
    );
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            )
          : _videos.isEmpty
              ? _buildEmptyState()
              : _buildVideoFeed(),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.video_library_outlined,
            color: Colors.white.withOpacity(0.3),
            size: 64,
          ),
          const SizedBox(height: 16),
          Text(
            'Nenhum vídeo disponível',
            style: TextStyle(
              color: Colors.white.withOpacity(0.5),
              fontSize: 18,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Volte mais tarde para novidades',
            style: TextStyle(
              color: Colors.white.withOpacity(0.3),
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVideoFeed() {
    return PageView.builder(
      controller: _pageController,
      scrollDirection: Axis.vertical,
      itemCount: _videos.length,
      onPageChanged: _onPageChanged,
      itemBuilder: (context, index) {
        final video = _videos[index];
        return _buildVideoPage(video);
      },
    );
  }

  Widget _buildVideoPage(ResenhaVideo video) {
    return Stack(
      fit: StackFit.expand,
      children: [
        // Vídeo player no fundo
        ResenhaVideoPlayer(
          videoUrl: video.urlDiretaVideo,
          isPlaying: _currentIndex == _videos.indexOf(video),
        ),
        
        // Gradiente para melhor legibilidade
        _buildGradientOverlay(),
        
        // Conteúdo sobreposto
        _buildVideoOverlay(video),
      ],
    );
  }

  Widget _buildGradientOverlay() {
    return const DecoratedBox(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Colors.transparent,
            Colors.transparent,
            Colors.black54,
          ],
        ),
      ),
    );
  }

  Widget _buildVideoOverlay(ResenhaVideo video) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Rodapé esquerdo: informações do vídeo
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildChannelInfo(video),
                const SizedBox(height: 8),
                _buildVideoCaption(video),
                const SizedBox(height: 8),
                _buildPoloInfo(video),
              ],
            ),
          ),
          
          // Botões de ação na lateral direita
          Positioned(
            right: 0,
            bottom: 20,
            child: _buildActionButtons(video),
          ),
        ],
      ),
    );
  }

  Widget _buildChannelInfo(ResenhaVideo video) {
    return Row(
      children: [
        CircleAvatar(
          radius: 20,
          backgroundColor: Colors.white.withOpacity(0.2),
          child: Text(
            video.nomeCanal[0].toUpperCase(),
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                video.nomeCanal,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                _getPlatformLabel(video.origemPlataforma),
                style: TextStyle(
                  color: Colors.white.withOpacity(0.7),
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildVideoCaption(ResenhaVideo video) {
    return Text(
      video.legendaOriginal,
      style: const TextStyle(
        color: Colors.white,
        fontSize: 14,
        height: 1.4,
      ),
      maxLines: 3,
      overflow: TextOverflow.ellipsis,
    );
  }

  Widget _buildPoloInfo(ResenhaVideo video) {
    if (video.poloApadrinhado.isEmpty) return const SizedBox.shrink();
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.green.withOpacity(0.2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.green.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(
            Icons.location_city,
            color: Colors.green,
            size: 16,
          ),
          const SizedBox(width: 6),
          Text(
            video.poloApadrinhado,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(ResenhaVideo video) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Botão de curtir
        _buildActionButton(
          icon: Icons.favorite_border,
          label: _formatNumber(video.metricasInternas.likesApp),
          onTap: () => _likeVideo(video.videoId),
        ),
        
        const SizedBox(height: 16),
        
        // Botão de apoiar polo
        _buildActionButton(
          icon: Icons.emoji_events,
          label: 'Apoiar',
          onTap: () => _supportPolo(video.poloApadrinhado),
        ),
        
        const SizedBox(height: 16),
        
        // Botão de entrar na resenha (chat)
        _buildActionButton(
          icon: Icons.chat_bubble_outline,
          label: 'Resenha',
          onTap: () => _openChat(video.videoId),
          isPrimary: true,
        ),
        
        const SizedBox(height: 16),
        
        // Botão de compartilhar
        _buildActionButton(
          icon: Icons.share,
          label: 'Compartilhar',
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Compartilhamento em breve')),
            );
          },
        ),
      ],
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    bool isPrimary = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isPrimary
                  ? Colors.green.withOpacity(0.3)
                  : Colors.white.withOpacity(0.1),
              shape: BoxShape.circle,
              border: Border.all(
                color: isPrimary
                    ? Colors.green.withOpacity(0.5)
                    : Colors.white.withOpacity(0.2),
              ),
            ),
            child: Icon(
              icon,
              color: isPrimary ? Colors.green : Colors.white,
              size: 28,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: isPrimary ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }

  String _getPlatformLabel(String plataforma) {
    switch (plataforma) {
      case 'youtube_shorts':
        return 'YouTube Shorts';
      case 'instagram_reels':
        return 'Instagram Reels';
      case 'tiktok':
        return 'TikTok';
      default:
        return plataforma;
    }
  }

  String _formatNumber(int number) {
    if (number >= 1000000) {
      return '${(number / 1000000).toStringAsFixed(1)}M';
    } else if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(1)}K';
    }
    return number.toString();
  }
}
