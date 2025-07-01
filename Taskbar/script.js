// 获取DOM元素
const video = document.getElementById('main-video');
const playPauseBtn = document.getElementById('play-pause-btn');
const bigPlayButton = document.getElementById('big-play-button');
const progressBar = document.getElementById('progress-bar');
const progressHandle = document.getElementById('progress-handle');
const progressContainer = document.getElementById('progress-container');
const progressSeek = document.getElementById('progress-seek');
const currentTimeElement = document.getElementById('current-time');
const totalTimeElement = document.getElementById('total-time');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const pipBtn = document.getElementById('pip-btn');
const playbackSpeedBtn = document.getElementById('playback-speed-btn');
const speedOptions = document.getElementById('speed-options');
const loadingIndicator = document.getElementById('loading-indicator');
const videoContainer = document.getElementById('video-container');

// 播放/暂停视频
function togglePlay() {
    if (video.paused || video.ended) {
        video.play();
        playPauseBtn.innerHTML = '<i class="fa fa-pause text-xl"></i>';
        bigPlayButton.style.opacity = '0';
    } else {
        video.pause();
        playPauseBtn.innerHTML = '<i class="fa fa-play text-xl"></i>';
        bigPlayButton.style.opacity = '100';
    }
}

// 更新进度条
function updateProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${percent}%`;
    progressHandle.style.left = `${percent}%`;
    currentTimeElement.textContent = formatTime(video.currentTime);
}

// 格式化时间显示
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// 跳转到指定时间
function scrub(e) {
    const scrubTime = (e.offsetX / progressContainer.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

// 更新音量
function updateVolume() {
    video.volume = volumeSlider.value;
    updateVolumeIcon();
}

// 更新音量图标
function updateVolumeIcon() {
    if (video.volume === 0 || video.muted) {
        volumeIcon.className = 'fa fa-volume-off text-xl';
    } else if (video.volume < 0.5) {
        volumeIcon.className = 'fa fa-volume-down text-xl';
    } else {
        volumeIcon.className = 'fa fa-volume-up text-xl';
    }
}

// 切换静音
function toggleMute() {
    video.muted = !video.muted;
    updateVolumeIcon();
}

// 全屏切换
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen().catch(err => {
            console.error(`全屏请求失败: ${err.message}`);
        });
        fullscreenBtn.innerHTML = '<i class="fa fa-compress text-xl"></i>';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fa fa-expand text-xl"></i>';
        }
    }
}

// 画中画模式
function togglePIP() {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
        video.requestPictureInPicture();
    }
}

// 切换播放速度菜单
function toggleSpeedMenu() {
    speedOptions.classList.toggle('hidden');
}

// 设置播放速度
function setPlaybackSpeed(speed) {
    video.playbackRate = speed;
    playbackSpeedBtn.textContent = `${speed}x`;
    speedOptions.classList.add('hidden');
}

// 显示加载指示器
function showLoading() {
    loadingIndicator.style.opacity = '100';
    loadingIndicator.style.pointerEvents = 'auto';
}

// 隐藏加载指示器
function hideLoading() {
    loadingIndicator.style.opacity = '0';
    loadingIndicator.style.pointerEvents = 'none';
}

// 初始化视频总时间
function initTotalTime() {
    totalTimeElement.textContent = formatTime(video.duration);
}

// 隐藏控制栏（自动隐藏）
let controlsTimeout;

function hideControls() {
    if (!video.paused && video.duration > 0) {
        document.getElementById('controls').style.opacity = '0';
    }
}

// 显示控制栏
function showControls() {
    clearTimeout(controlsTimeout);
    document.getElementById('controls').style.opacity = '100';
    controlsTimeout = setTimeout(hideControls, 3000);
}

// 事件监听器
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('loadedmetadata', initTotalTime);
video.addEventListener('waiting', showLoading);
video.addEventListener('playing', hideLoading);
video.addEventListener('ended', () => {
    playPauseBtn.innerHTML = '<i class="fa fa-play text-xl"></i>';
    bigPlayButton.style.opacity = '100';
});

playPauseBtn.addEventListener('click', togglePlay);
bigPlayButton.addEventListener('click', togglePlay);

progressSeek.addEventListener('click', scrub);
progressSeek.addEventListener('mousemove', (e) => {
    if (e.buttons === 1) { // 鼠标左键按下
        scrub(e);
    }
});

volumeSlider.addEventListener('input', updateVolume);
volumeIcon.addEventListener('click', toggleMute);

fullscreenBtn.addEventListener('click', toggleFullscreen);
pipBtn.addEventListener('click', togglePIP);

playbackSpeedBtn.addEventListener('click', toggleSpeedMenu);
document.querySelectorAll('#speed-options button').forEach(button => {
    button.addEventListener('click', () => {
        setPlaybackSpeed(parseFloat(button.dataset.speed));
    });
});

// 点击其他地方关闭速度菜单
document.addEventListener('click', (e) => {
    if (!playbackSpeedBtn.contains(e.target) && !speedOptions.contains(e.target)) {
        speedOptions.classList.add('hidden');
    }
});

// 鼠标移动显示控制栏
videoContainer.addEventListener('mousemove', showControls);

// 键盘控制
document.addEventListener('keydown', (e) => {
    if (e.target.tagName.toLowerCase() === 'input') return;

    switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
            togglePlay();
            break;
        case 'f':
            toggleFullscreen();
            break;
        case 'm':
            toggleMute();
            break;
        case 'arrowright':
            video.currentTime += 10;
            break;
        case 'arrowleft':
            video.currentTime -= 10;
            break;
        case 'arrowup':
            video.volume = Math.min(1, video.volume + 0.1);
            volumeSlider.value = video.volume;
            updateVolumeIcon();
            break;
        case 'arrowdown':
            video.volume = Math.max(0, video.volume - 0.1);
            volumeSlider.value = video.volume;
            updateVolumeIcon();
            break;
    }
});

// 初始化
updateVolumeIcon();
showControls();