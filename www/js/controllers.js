angular.module('starter.controllers', [])

.controller('videoCtrl', ["$sce", "$scope", "$timeout", function ($sce, $scope, $timeout) {
    var $scope = this;
    $scope.state = null;
    $scope.API = null;
    $scope.currentVideo = 0;
    $scope.progressCounter = null;

    // 当视频初始化时调用
    $scope.onPlayerReady = function(API) {
        $scope.API = API;
    };


    // 判断视文件频播放完成
    $scope.onCompleteVideo = function() {
        $scope.isCompleted = true;

        $scope.currentVideo++;

        if ($scope.currentVideo >= $scope.videos.length) $scope.currentVideo = 0;

        $scope.setVideo($scope.currentVideo);
    };

    $scope.onUpdateState = function($state) {
      $scope.state = $state
      console.log("state ======= " + $state)
    }

    $scope.onChangeSource = function($source) {
      window.videoSource = $source;
      if($scope.state == "play") {
        console.log("")
      }
      console.log("source ======= " + $source)
    }


    // 定义视频列表数据源
    $scope.videos = [
      {
        sources: [
          {src: $sce.trustAsResourceUrl("./video/video1.mp4"), type: "video/mp4"}
        ]
      },
      {
        sources: [
          {src: $sce.trustAsResourceUrl("./video/video2.mp4"), type: "video/mp4"}
        ]
      },
      {
        sources: [
          {src: $sce.trustAsResourceUrl("./video/video3.mp4"), type: "video/mp4"}
        ]
      },
      {
        sources: [
          {src: $sce.trustAsResourceUrl("./video/video4.mp4"), type: "video/mp4"}
        ]
      },
      {
        sources: [
          {src: $sce.trustAsResourceUrl("./video/video5.mp4"), type: "video/mp4"}
        ]
      }
    ];

    // 配置
    $scope.config = {
        preload: "none",
        autoHide: false,
        autoHideTime: 3000,
        autoPlay: false,
        sources: $scope.videos[0].sources,
        theme: {
            // url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
        },
        // plugins: {
        //     poster: "http://www.videogular.com/assets/images/videogular.png"
        // }
    };

    $scope.setVideoAttr = function() {
      document.getElementById('playerVideo').children[0].setAttribute('webkit-playsinline', '');
    }

    $scope.setState = function() {
        $scope.currentTime = $scope.API.currentTime;
        $scope.totalTime = $scope.API.totalTime;
        var minutes = new Date($scope.totalTime).getMinutes();
        var seconds = new Date($scope.totalTime).getSeconds();

        $scope.progressCounter = minutes * 60 + seconds;
        console.log(window.videoAPI = $scope.API)
        console.log($scope.progressCounter + " progress counter");
    }

    $timeout(function() {
       $scope.setState();
       $scope.setVideoAttr();
    }, 1000)

    $scope.setVideo = function(index) {
      $scope.API.stop();
      $scope.currentVideo = index;
      $scope.config.sources = $scope.videos[index].sources;
      $timeout($scope.API.play.bind($scope.API), 100);
      $timeout(function(){
        $scope.updateProgress()
      }, 100)
    };

    // 切换下一个视频
    var sourceIndex = 0;
    var sourcesLength = $scope.videos.length;
    $scope.nexeVideo = function() {
      if(sourceIndex < sourcesLength-1) {
        sourceIndex++;
      } else {
        alert("This is the last video");
        return
      }
      console.log(sourceIndex)
      $scope.setVideo(sourceIndex);
    };

    // 切换上一个视频
    $scope.prevVideo = function() {
      if (sourceIndex > 0) {
        sourceIndex--;
      } else {
        alert("This is the first video!");
        return
      }
      console.log(sourceIndex);
      $scope.setVideo(sourceIndex);
    };



    $scope.drawProgress = function(progress) {
      var path,
          r,
          degrees,
          radian,
          x,
          y,
          lenghty,
          descriptions;

      path         = document.getElementById('ring')
      r            = 50;
      degrees      = progress * (360/360);
      radian       = degrees* (Math.PI / 180);
      x            = (Math.sin(radian) * r).toFixed(2);
      y            = -(Math.cos(radian) * r).toFixed(2);
      lenghty      = window.Number(degrees > 180);
      descriptions = [
        'M', 0, 0, // M(m) x y指定路径的起点
        'v', -r, // 指定路径垂直直线终点的y
        'A', r, r, 0, lenghty, 1, x, y,  // A(a) rx ry x-axis-rotation large-arc-flag sweep-flag x y绘制弧形。弧形可以视为圆形或椭圆形的一部分。
        'z' // 没有参数，闭合路径
      ];
      path.setAttribute('transform', 'translate(100,100)');
      path.setAttribute('d', descriptions.join(' '));
    };


    var progress,
        video,
        videoDuration,
        currentTime,
        radianPerSecond;

    $scope.updateProgress = function() {
      // debugger
      video = document.getElementById('playerVideo').children[0];
      videoDuration = Math.floor(video.duration); // 获取视频长度
      console.log("video: " + video);
      console.log("videoDuration: " + videoDuration)
      increaseNumber = 360/videoDuration;
      $scope.progressCounter = videoDuration;

      video.addEventListener('timeupdate', function() {
        currentTime = Math.floor(video.currentTime);
        $scope.progressCounter = videoDuration - currentTime;
        radianPerSecond = currentTime * increaseNumber;
        console.log("实时返回当前的弧度 " + radianPerSecond);
        if (radianPerSecond == 0) {
          $scope.drawProgress(1)
        } else if(radianPerSecond>0 & radianPerSecond<354) {
          $scope.drawProgress(radianPerSecond)
        } else {
          $scope.drawProgress(359)
        }
      })
    }
  }]
);
