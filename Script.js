const deptNames = {
    'stamp-a': '電子機械科',
    'stamp-b': '情報技術科',
    'stamp-c': '情報処理科',
    'stamp-d': '服飾デザイン科',
    'stamp-e': '食物調理科',
    'stamp-f': '流通経済科'
};

let clickCount = 0;
let clickTimer = null;
let nearLogTimeout = null;

function showNearObjectLog() {
    if (document.getElementById('explanation-screen')) return;

    const logElem = document.getElementById('near-object-log');
    if (!logElem) return;

    logElem.classList.add('show');

    clearTimeout(nearLogTimeout);
    nearLogTimeout = setTimeout(() => {
        logElem.classList.remove('show');
    }, 10000);
}

// 動画の再生とA-Frameテクスチャの強制描画更新
function handlePlayVideo(markerElem, path) {
    const videos = document.querySelectorAll('video');
    videos.forEach(v => {
        const src = v.getAttribute('src');
        if (src && src.includes(path)) {
            v.muted = true;
            v.play().then(() => {
                // A-Frameのa-video要素のテクスチャを強制描画更新
                const aVideo = markerElem.querySelector('a-video');
                if (aVideo) {
                    const mesh = aVideo.getObject3D('mesh');
                    if (mesh && mesh.material && mesh.material.map) {
                        mesh.material.map.needsUpdate = true;
                    }
                }
            }).catch(e => console.log("再生エラー:", e));
        }
    });
}

function handlePauseVideo(path) {
    const videos = document.querySelectorAll('video');
    videos.forEach(v => {
        const src = v.getAttribute('src');
        if (src && src.includes(path)) {
            v.pause();
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {

    const unlockAudio = () => {
        const videos = document.querySelectorAll('video');
        videos.forEach(v => {
            if (!v.paused) v.muted = false;
        });
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    // --- マーカー1 (ar-marker-1 -> jgvideo2.mp4) ---
    const m1 = document.getElementById('ar-marker-1');
    if (m1) {
        m1.addEventListener('markerFound', function() {
            console.log("検出成功: ar-marker-1");
            try { localStorage.setItem('stamp-a-flag', '1'); } catch(e){}

            handlePlayVideo(this, 'jgvideo2.mp4');
            setTimeout(showNearObjectLog, 1000);
        });

        m1.addEventListener('markerLost', function() {
            console.log("マーカー喪失: ar-marker-1");
            handlePauseVideo('jgvideo2.mp4');
        });
    }

    // --- マーカー2 (ar-marker-2 -> GameVideo.mp4) ---
    const m2 = document.getElementById('ar-marker-2');
    if (m2) {
        m2.addEventListener('markerFound', function() {
            console.log("検出成功: ar-marker-2");
            try { localStorage.setItem('stamp-b-flag', '1'); } catch(e){}

            handlePlayVideo(this, 'GameVideo.mp4');
            setTimeout(showNearObjectLog, 1000);
        });

        m2.addEventListener('markerLost', function() {
            console.log("マーカー喪失: ar-marker-2");
            handlePauseVideo('GameVideo.mp4');
        });
    }

    // --- マーカー3 (ar-marker-3 -> jgvideo2.mp4) ---
    const m3 = document.getElementById('ar-marker-3');
    if (m3) {
        m3.addEventListener('markerFound', function() {
            console.log("検出成功: ar-marker-3");
            try { localStorage.setItem('stamp-c-flag', '1'); } catch(e){}

            handlePlayVideo(this, 'jgvideo2.mp4');
            setTimeout(showNearObjectLog, 1000);
        });

        m3.addEventListener('markerLost', function() {
            console.log("マーカー喪失: ar-marker-3");
            handlePauseVideo('jgvideo2.mp4');
        });
    }
});

function goBack() {
    window.location.href = 'index.html';
}

function switchToMarkerless() {
    window.location.href = 'test.html';
}

function startAR() {
    const screen = document.getElementById('explanation-screen');
    if (screen) {
        screen.remove();
    }
}

function openCollection() {
    const modal = document.getElementById('collection-modal');
    if (modal) modal.style.display = 'flex';
}

function closeCollection() {
    const modal = document.getElementById('collection-modal');
    if (modal) modal.style.display = 'none';
}

function selectDepartment(deptKey) {
    openDeptVideos(deptKey);
}

function openDeptVideos(deptKey) {
    const modal = document.getElementById('dept-video-modal');
    const title = document.getElementById('dept-title');
    const list = document.getElementById('dept-video-list');
    
    if (title) title.textContent = `${deptNames[deptKey] || '学科'} の動画一覧`;
    
    if (list) {
        list.innerHTML = '';

        const spots = [
            { id: 'stamp-a-flag', title: 'スポット1：校章スポット', src: 'jgvideo2.mp4' },
            { id: 'stamp-b-flag', title: 'スポット2：シューティングゲーム', src: 'GameVideo.mp4' },
            { id: 'stamp-c-flag', title: 'スポット3：丸型スポット', src: 'jgvideo2.mp4' }
        ];

        spots.forEach(spot => {
            let isUnlocked = false;

            try {
                isUnlocked = (localStorage.getItem(spot.id) === '1');
            } catch (e) {
                isUnlocked = false;
            }

            const div = document.createElement('div');
            div.className = `video-item ${isUnlocked ? 'unlocked' : 'locked'}`;

            if (isUnlocked) {
                div.innerHTML = `
                    <p style="font-weight:bold; margin:0 0 8px 0; color:#059669;">🔓 ${spot.title}</p>
                    <video src="${spot.src}" controls style="width:100%; border-radius:8px; display:block;"></video>
                `;
            } else {
                div.innerHTML = `
                    <p style="font-weight:bold; margin:0; color:#475569;">🔒 ${spot.title}</p>
                    <div class="secret-box" style="background:#cbd5e1; border-radius:10px; padding:20px; text-align:center; margin-top:8px;">
                        <div class="secret-icon" style="font-size:36px; font-weight:bold; color:#64748b; margin-bottom:4px;">❓</div>
                        <small style="color:#64748b; font-weight:bold;">ARマーカーを探して解放しよう！</small>
                    </div>
                `;
            }
            list.appendChild(div);
        });
    }
    
    const collectionModal = document.getElementById('collection-modal');
    if (collectionModal) collectionModal.style.display = 'none';
    if (modal) modal.style.display = 'flex';
}

function closeDeptVideos() {
    const deptModal = document.getElementById('dept-video-modal');
    const collectionModal = document.getElementById('collection-modal');
    
    if (deptModal) {
        const videos = deptModal.querySelectorAll('video');
        videos.forEach(v => v.pause());
        deptModal.style.display = 'none';
    }
    
    if (collectionModal) {
        collectionModal.style.display = 'flex';
    }
}

function handleTitleClick() {
    clickCount++;
    clearTimeout(clickTimer);

    if (clickCount >= 5) {
        clickCount = 0;
        if (confirm('【開発者コマンド】スタンプと解放状況を全リセットしますか？')) {
            try { localStorage.clear(); } catch(e){}
            alert('すべての進行状況をリセットしました！');
            location.reload();
        }
    } else {
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 1500);
    }
}