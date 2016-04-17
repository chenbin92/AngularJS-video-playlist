angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $timeout) {
  var video,
      playBtn,
      duration,
      volumeBtn;

  $timeout(function() {
    $scope.player();
    $scope.getDuration();
    $scope.showDuration();
    $scope.setVolume();
  }, 1000)

  // 实现播放和暂停功能
  $scope.player = function() {
    video = document.getElementById('playerVideo');
    playBtn = document.getElementById('playButton');
    playBtn.addEventListener('click', function(){
      if (video.paused) {
        video.play();
        console.log('playing')
      } else {
        video.pause();
        console.log('pause')
      }
    })
  }

  // 获取视频时间总长度
  // video.duration: 整个媒体文件的播放时长，单位s
  $scope.getDuration = function() {
    duration = Math.floor(video.duration);
    document.getElementById('videoTotalTime').innerHTML = duration;
    document.getElementById('videoSeconds').innerHTML = duration;
    // document.getElementById('progressBar').setAttribute('data-pct', duration)
  }

  // 自定义视频时间显示
  // ontimeupdate: 当video.currentTime发生改变时触发该事件
  // video.currentTime：以s为单位返回从开始播放到现在所用的时间
  $scope.showDuration = function() {
    video.addEventListener('timeupdate', function() {
      // 秒数转换
      var time = video.currentTime.toFixed(1)
          minutes = Math.floor((time / 60) % 60),
          seconds = Math.floor(time % 60),
          timer = document.getElementById('timer');
          if(seconds < 10) {
            seconds = '0' + seconds;
          }
          timer.innerHTML = minutes + ':' + seconds;
          document.getElementById('videoSeconds').innerHTML = duration - seconds;
          // document.getElementById('progressBar').setAttribute('data-pct',(duration - seconds))
          // document.getElementById('ring').setAttribute('date-percent',(duration - seconds))
    })
  }

  // 音量控制: 静音与取消静音
  // video.muted ：检测当前是否为静音，是则为true；为文件设置静音或消除静音
  $scope.setVolume = function() {
    volumeBtn = document.getElementById('volumeButton');
    volumeBtn.addEventListener('click', function() {
      if (video.muted) {
        video.muted = false;
        console.log("volume open")
      } else {
        video.muted = true;
        console.log("volume close")
      }
    })
  }

  // 绘制扇形
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
  }

  var progress,
      video,
      videoDuration,
      progressTime,
      radianPerSecond;

  // 实时更新绘制扇形进度
  $scope.updateProgress = function() {
    video = document.getElementById('playerVideo');
    videoDuration = Math.floor(video.duration); // 获取视频长度
    increaseNumber = 360/videoDuration;

    video.addEventListener('timeupdate', function() {
      progressTime = Math.floor(video.currentTime);
      radianPerSecond = progressTime * increaseNumber;
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



})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
