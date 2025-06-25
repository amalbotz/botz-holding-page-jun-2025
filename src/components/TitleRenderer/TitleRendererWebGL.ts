import vertexShader from "./shaders/vert.glsl?raw";
import fragmentShader from "./shaders/frag.glsl?raw";
import titleMap from "./title-map.png";
import titleMapPortrait from "./title-map-portrait.png";
import backgroundMap from "./background.png";
import backgroundVideo from "./background.mp4";
// import backgroundDebug from "./uv-16-9.png";
import {
  type BufferInfo,
  type ProgramInfo,
  bindFramebufferInfo,
  createProgramInfo,
  createTexture,
  drawBufferInfo,
  primitives,
  setBuffersAndAttributes,
  setUniforms,
  resizeCanvasToDisplaySize,
  createTextureAsync,
  setTextureFromElement,
} from "twgl.js";

const WIDTH = 0.6666;
const WIDTH_PORTRAIT = 0.95;
const RESOLUTION = [2200, 880];
const RESOLUTION_PORTRAIT = [1297, 880];

class TitleRenderer {
  private uniforms: { [key: string]: any };
  private startTime = Date.now();
  private programInfo: ProgramInfo;
  private bufferInfo: BufferInfo;
  private _width = WIDTH;
  private targetTouchOpacity = 0;
  private targetMousePosition = [-1, -1];
  private gl: WebGL2RenderingContext;
  private loaded = false;
  private orientation =
    window.innerHeight > window.innerWidth ? "portrait" : "landscape";
  private wordmark?: WebGLTexture;
  private wordmarkPortrait?: WebGLTexture;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;

    this.wordmark = createTexture(this.gl, {
      src: [0, 0, 0, 0],
    });
    this.wordmarkPortrait = createTexture(this.gl, {
      src: [0, 0, 0, 0],
    });
    this.uniforms = {
      u_time: this.startTime,
      u_timescale: 0.3,
      u_noise_scale: 1,
      u_resolution:
        this.orientation === "portrait" ? RESOLUTION_PORTRAIT : RESOLUTION, // resolution of the image map
      u_background_resolution: [16, 9],
      u_opacity: 1,
      u_touch_opacity: 0,
      u_map_wordmark:
        this.orientation === "portrait" ? this.wordmarkPortrait : this.wordmark,
      u_map_background: createTexture(this.gl, {
        minMag: gl.LINEAR,
        src: [0, 0, 0, 0],
      }),
      u_mouse_position: [-1, -1],
      u_color: [1, 0, 0],
      u_rotate_maps: 0,
    };
    this.programInfo = createProgramInfo(gl, [vertexShader, fragmentShader]);
    this.bufferInfo = primitives.createXYQuadBufferInfo(gl);

    // Enable transparency and configure blending for iOS compatibility
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0); // Set clear color with transparent alpha

    this.width = this.orientation === "portrait" ? WIDTH_PORTRAIT : WIDTH;
    this.createTextures();

    this.onResize = this.onResize.bind(this);
    window.addEventListener("resize", this.onResize);
  }

  private onResize() {
    const newOrientation =
      window.innerHeight > window.innerWidth ? "portrait" : "landscape";

    if (newOrientation !== this.orientation) {
      this.width = newOrientation === "portrait" ? WIDTH_PORTRAIT : WIDTH;
      this.orientation = newOrientation;
      this.uniforms.u_resolution =
        newOrientation === "portrait" ? RESOLUTION_PORTRAIT : RESOLUTION;
      this.uniforms.u_map_wordmark =
        this.orientation === "portrait" ? this.wordmarkPortrait : this.wordmark;
    }
  }

  private async createTextures() {
    const video = document.createElement("video");
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.src = backgroundVideo;
    video.play();
    video.style.width = "1px";
    video.style.height = "1px";
    video.style.pointerEvents = "none";
    video.style.opacity = "0";
    document.body.appendChild(video);

    this.uniforms.u_resolution =
      this.orientation === "portrait" ? RESOLUTION_PORTRAIT : RESOLUTION;

    const [wordmark, wordmarkPortrait, background] = await Promise.all([
      await createTextureAsync(this.gl, {
        src: titleMap,
        flipY: 1,
      }),
      await createTextureAsync(this.gl, {
        src: titleMapPortrait,
        flipY: 1,
      }),
      await createTextureAsync(this.gl, {
        src: backgroundMap,
        // src: backgroundDebug,
        flipY: 1,
      }),
    ]);

    this.wordmark = wordmark;
    this.wordmarkPortrait = wordmarkPortrait;

    this.uniforms.u_map_wordmark =
      this.orientation === "portrait" ? wordmarkPortrait : wordmark;
    this.uniforms.u_map_background = background;
    this.loaded = true;

    const onVideoFrame = () => {
      setTextureFromElement(
        this.gl,
        this.uniforms.u_map_background.texture,
        video,
        {
          minMag: this.gl.LINEAR,
          flipY: 1,
        }
      );
      video.requestVideoFrameCallback(onVideoFrame);
    };

    video.requestVideoFrameCallback(onVideoFrame);
  }

  public onMouseMove([x, y]: [number, number]) {
    const aspectRatio =
      this.uniforms.u_resolution[0] / this.uniforms.u_resolution[1];

    const displayWidth = window.innerWidth * this.width;
    const displayHeight = displayWidth / aspectRatio;

    const paddingX = (window.innerWidth - displayWidth) * 0.5;
    const paddingY =
      (window.innerHeight - displayHeight) *
      (this.orientation === "portrait" ? 0.42 : 0.5);

    this.targetMousePosition = [
      (x - paddingX) / displayWidth,
      1 - (y - paddingY) / displayHeight,
    ];
  }

  public set isTouching(value: boolean) {
    if (value) {
      this.targetTouchOpacity = 1;
    } else {
      this.targetTouchOpacity = 0;
    }
  }

  public set color(color: [number, number, number]) {
    this.uniforms.u_color = color;
  }

  public set opacity(opacity: number) {
    this.uniforms.u_opacity = opacity;
  }

  public get opacity(): number {
    return this.uniforms.u_opacity;
  }

  public set width(width: number) {
    this._width = width;
  }

  public get width(): number {
    return this._width;
  }

  public set noiseScale(scale: number) {
    this.uniforms.u_noise_scale = scale;
  }

  public render() {
    this.uniforms.u_time = Date.now() - this.startTime;
    if (!this.loaded) return;

    const aspectRatio =
      this.uniforms.u_resolution[0] / this.uniforms.u_resolution[1];
    this.gl.useProgram(this.programInfo.program);
    setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
    setUniforms(this.programInfo, this.uniforms);
    resizeCanvasToDisplaySize(
      this.gl.canvas as HTMLCanvasElement,
      window.devicePixelRatio
    );
    bindFramebufferInfo(this.gl, null);
    const displayWidth = this.gl.canvas.width * this.width;
    const displayHeight = displayWidth / aspectRatio;

    this.uniforms.u_touch_opacity = this.uniforms.u_touch_opacity +=
      (this.targetTouchOpacity - this.uniforms.u_touch_opacity) * 0.02;

    this.uniforms.u_mouse_position[0] +=
      (this.targetMousePosition[0] - this.uniforms.u_mouse_position[0]) * 0.02;

    this.uniforms.u_mouse_position[1] +=
      (this.targetMousePosition[1] - this.uniforms.u_mouse_position[1]) * 0.02;

    this.uniforms.u_touch_opacity +=
      (this.targetTouchOpacity - this.uniforms.u_touch_opacity) * 0.02;

    const paddingX = (this.gl.canvas.width - displayWidth) * 0.5;
    const paddingY =
      (this.gl.canvas.height - displayHeight) *
      (this.orientation === "portrait" ? 0.58 : 0.5);
    this.gl.viewport(paddingX, paddingY, displayWidth, displayHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT); // Clear with the transparent color
    drawBufferInfo(this.gl, this.bufferInfo);
  }
}

export default TitleRenderer;
