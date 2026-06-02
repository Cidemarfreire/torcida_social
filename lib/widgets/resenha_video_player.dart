import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import 'package:chewie/chewie.dart';

class ResenhaVideoPlayer extends StatefulWidget {
  final String videoUrl;
  final bool isPlaying;

  const ResenhaVideoPlayer({
    required this.videoUrl,
    this.isPlaying = true,
    Key? key,
  }) : super(key: key);

  @override
  State<ResenhaVideoPlayer> createState() => _ResenhaVideoPlayerState();
}

class _ResenhaVideoPlayerState extends State<ResenhaVideoPlayer> {
  VideoPlayerController? _videoPlayerController;
  ChewieController? _chewieController;
  bool _isInitialized = false;
  bool _hasError = false;

  @override
  void initState() {
    super.initState();
    _initializeVideo();
  }

  Future<void> _initializeVideo() async {
    try {
      _videoPlayerController = VideoPlayerController.networkUrl(
        Uri.parse(widget.videoUrl),
      );

      await _videoPlayerController!.initialize();

      _chewieController = ChewieController(
        videoPlayerController: _videoPlayerController!,
        autoPlay: widget.isPlaying,
        looping: true,
        showControls: false,
        aspectRatio: 9 / 16,
        allowFullScreen: false,
        allowMuting: true,
      );

      if (mounted) {
        setState(() {
          _isInitialized = true;
        });
      }
    } catch (e) {
      print('Erro ao inicializar vídeo: $e');
      if (mounted) {
        setState(() {
          _hasError = true;
        });
      }
    }
  }

  @override
  void didUpdateWidget(ResenhaVideoPlayer oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.videoUrl != widget.videoUrl) {
      _disposeControllers();
      _initializeVideo();
    }
    if (oldWidget.isPlaying != widget.isPlaying) {
      if (widget.isPlaying) {
        _chewieController?.play();
      } else {
        _chewieController?.pause();
      }
    }
  }

  void _disposeControllers() {
    _chewieController?.dispose();
    _videoPlayerController?.dispose();
    _chewieController = null;
    _videoPlayerController = null;
  }

  @override
  void dispose() {
    _disposeControllers();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_hasError) {
      return _buildErrorWidget();
    }

    if (!_isInitialized) {
      return _buildLoadingWidget();
    }

    return SizedBox.expand(
      child: FittedBox(
        fit: BoxFit.cover,
        child: SizedBox(
          width: _chewieController!.videoPlayerController.value.size.width,
          height: _chewieController!.videoPlayerController.value.size.height,
          child: Chewie(controller: _chewieController!),
        ),
      ),
    );
  }

  Widget _buildLoadingWidget() {
    return Container(
      color: Colors.black,
      child: const Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
        ),
      ),
    );
  }

  Widget _buildErrorWidget() {
    return Container(
      color: Colors.black,
      child: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              color: Colors.white,
              size: 48,
            ),
            SizedBox(height: 16),
            Text(
              'Erro ao carregar vídeo',
              style: TextStyle(color: Colors.white),
            ),
          ],
        ),
      ),
    );
  }
}
