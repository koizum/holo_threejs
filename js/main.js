var initScene, render,
    renderer,
    scene, camera, camera2, light, light2, controls, loader, geometry, material, mesh,
    r, urls, textureCube, gui, canvasMoto, canvasUp, ctx;
    
var rad = -90 * Math.PI / 180; // -90度
var viewW = window.innerWidth; // ウィンドウサイズの横幅
var viewH = window.innerHeight; // ウィンドウサイズの高さ
var size = Math.min(viewW, viewH); // 幅と高さの小さい方を返す
var dw = size / 3;
var dh = size / 3;
var px = (viewW - size) / 2;
var py = (viewH - size) / 2;
var setting = {        // dat.guiの設定
    color: '#80ff80',  // 色
    wireframe: true,   // ワイヤーフレーム
    reflectivity: 0.1  // 反射率
}

function initScene() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, 1 / 1, 0.1, 1000);
    camera.position.set(0, 0, 2);
    controls = new THREE.OrbitControls(camera, holo1);
    scene.add(camera);

    light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(5, 5, 5);
    scene.add(light2);

    loader = new THREE.TextureLoader();
    cubeLoader = new THREE.CubeTextureLoader();  // meshに反射させるテクスチャ
    mycolor = loader.load('tex/white.png');  // 真っ白いテクスチャを貼っています
    r = "tex/";
    // skyboxのテクスチャ 右、左、上、下、前、後 の順です
    urls = [r + "right.jpg", r + "left.jpg", r + "top.jpg", r + "bottom.jpg", r + "front.jpg", r + "back.jpg"];
    textureCube = cubeLoader.load(urls);

    geometry = new THREE.IcosahedronGeometry(1, 1);  // 値は半径、分割回数
    material = new THREE.MeshPhongMaterial({
        wireframe: setting.wireframe,       // ワイヤーフレーム
        color: setting.color,               // 色
        map: mycolor,                       // テクスチャ
        envMap: textureCube,                // 反射させるテクスチャ
        reflectivity: setting.reflectivity  // 反射率
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(330, 330);
    renderer.setClearColor(0x000000);

    canvasMoto = document.getElementById("holo").appendChild(renderer.domElement);  // キャンバスの元
    canvasUp = document.getElementById("holo1");  // 映るキャンバス
    ctx = canvasUp.getContext("2d");  // 2Dのコンテキストを取得
    canvasUp.width = viewW;
    canvasUp.height = viewH;

    gui = new dat.GUI();  // dat.gui
    gui.addColor(setting, "color").onChange(function(value) {
        value = value.replace('#', '0x');
        material.color.setHex(value);
    });
    gui.add(setting, "wireframe").onChange(function(value) {
        material.wireframe = value;
    });
    gui.add(setting, 'reflectivity', 0.0, 1.0).onChange(function(value) {
        material.reflectivity = Number(value);
    });
    gui.open();

    render();
}

function render() {
    requestAnimationFrame(render);

    // 四角形の形にクリア
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); // clearRect(左上のx座標, 左上のy座標, 四角形の幅, 四角形の高さ);

    ctx.strokeStyle = "rgb(255, 215, 0)"; // 中心の枠
    ctx.strokeRect((viewW - size / 6) * 0.5, (viewH - size / 6) * 0.5, size / 6, size / 6);

    ctx.save(); // 現在の描画状態を保存
    ctx.translate(px + dw * 2, py);
    ctx.scale(-1, 1);
    ctx.drawImage(canvasMoto, 0, 0, dw, dh);
    ctx.restore(); // 描画状態を保存した時点のものに戻す

    ctx.save();
    ctx.translate(px, py + dh);
    ctx.scale(1, -1);
    ctx.rotate(rad);
    ctx.drawImage(canvasMoto, 0, 0, dw, dh);
    ctx.restore();

    ctx.save();
    ctx.translate(px + dw, py + dh * 3);
    ctx.scale(-1, 1);
    ctx.rotate(rad * 2);
    ctx.drawImage(canvasMoto, 0, 0, dw, dh);
    ctx.restore();

    ctx.save();
    ctx.translate(px + dw * 3, py + dh * 2);
    ctx.scale(1, -1);
    ctx.rotate(rad * 3);
    ctx.drawImage(canvasMoto, 0, 0, dw, dh);
    ctx.restore();

    controls.update();
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}

window.onload = initScene;
