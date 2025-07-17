import vertexShaderLogo from "./shaders/vert-logo.glsl?raw";
import fragmentShaderLogo from "./shaders/frag-logo.glsl?raw";
import vertexShaderParticle from "./shaders/vert-particle.glsl?raw";
import fragmentShaderParticle from "./shaders/frag-particle.glsl?raw";
import titleMap from "./title-map.png";
import titleMapPortrait from "./title-map-portrait.png";
import backgroundMap from "./background.jpg";
import backgroundVideo from "./background.mp4";
import noiseMap from "./noise.png";
import particleMap from "./particles.png";
// import backgroundDebug from "./uv-16-9.png";
import {
  type BufferInfo,
  type ProgramInfo,
  createProgramInfo,
  createTexture,
  drawBufferInfo,
  primitives,
  setBuffersAndAttributes,
  setUniforms,
  resizeCanvasToDisplaySize,
  createTextureAsync,
  setTextureFromElement,
  createBufferInfoFromArrays,
  createVertexArrayInfo,
  type VertexArrayInfo,
} from "twgl.js";

const WIDTH = 0.6666;
const WIDTH_PORTRAIT = 0.95;
const RESOLUTION = [2200, 880];
const RESOLUTION_PORTRAIT = [1297, 880];
const SPRITE_COUNT = 9;

const easeOutQuad = (t: number) => t * (2 - t);
const easeOutQuart = (t: number) => 1 - (1 - t) ** 4;
const easeInQuart = (t: number) => t ** 4;
const easeOutExpo = (t: number) => (t == 1 ? 1 : 1 - Math.pow(2, -10 * t));

class TitleRenderer {
  private gl: WebGL2RenderingContext;
  private uniformsLogo: { [key: string]: any };
  private uniformsParticle: { [key: string]: any };
  private particleCount = 0;
  private startTime = Date.now();
  private programInfoLogo: ProgramInfo;
  private bufferInfoLogo: BufferInfo;
  private vertexArrayInfoLogo: VertexArrayInfo;
  private programInfoParticle: ProgramInfo;
  private bufferInfoParticle: BufferInfo;
  private vertexArrayInfoParticle: VertexArrayInfo;
  private _width = WIDTH;
  private targetTouchOpacity = 0;
  private targetMousePosition = [-1, -1];
  private loaded = false;
  private orientation =
    window.innerHeight > window.innerWidth ? "portrait" : "landscape";
  private wordmark?: WebGLTexture;
  private wordmarkPortrait?: WebGLTexture;
  private noiseMap: WebGLTexture;
  private particleMap: WebGLTexture;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;

    this.wordmark = createTexture(this.gl, {
      src: [0, 0, 0, 0],
    });
    this.wordmarkPortrait = createTexture(this.gl, {
      src: [0, 0, 0, 0],
    });
    this.noiseMap = createTexture(this.gl, {
      src: [0, 0, 0, 0],
    });
    this.particleMap = createTexture(this.gl, {
      src: [0, 0, 0, 0],
    });
    this.uniformsLogo = {
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
    this.uniformsParticle = {
      u_time: this.startTime,
      u_resolution: [
        gl.canvas.width / window.devicePixelRatio,
        gl.canvas.height / window.devicePixelRatio,
      ],
      u_noise_map: this.noiseMap,
      u_particle_map: this.particleMap,
      u_sprite_count: SPRITE_COUNT,
    };
    this.programInfoLogo = createProgramInfo(gl, [
      vertexShaderLogo,
      fragmentShaderLogo,
    ]);
    this.bufferInfoLogo = primitives.createXYQuadBufferInfo(gl);
    this.vertexArrayInfoLogo = createVertexArrayInfo(
      this.gl,
      this.programInfoLogo,
      this.bufferInfoLogo
    );
    this.programInfoParticle = createProgramInfo(gl, [
      vertexShaderParticle,
      fragmentShaderParticle,
    ]);
    // const particleArrays = { ...primitives.createXYQuadVertices() };

    const [bufferInfoParticle, vertexArrayInfoParticle] =
      this.createParticleArrays();
    this.bufferInfoParticle = bufferInfoParticle;
    this.vertexArrayInfoParticle = vertexArrayInfoParticle;

    // this.bufferInfoParticle = primitives.createXYQuadBufferInfo(gl);

    // Enable transparency and configure blending for iOS compatibility
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0); // Set clear color with transparent alpha

    this.width = this.orientation === "portrait" ? WIDTH_PORTRAIT : WIDTH;
    this.createTextures();

    this.onResize = this.onResize.bind(this);
    window.addEventListener("resize", this.onResize);
  }

  private createParticleArrays() {
    this.particleCount = Math.round(
      window.innerWidth * window.innerHeight * 0.001
    );

    const quadVertices = primitives.createXYQuadVertices();
    this.bufferInfoParticle = createBufferInfoFromArrays(this.gl, {
      ...quadVertices,
      instanceOrigin: {
        numComponents: 3,
        data: new Float32Array(this.particleCount * 3).map((_value, index) => {
          if (index % 3 == 2) {
            return Math.random();
          }
          return Math.random() * 2 - 1;
        }),
        divisor: 1,
      },
      instanceSeed: {
        numComponents: 1,
        data: new Float32Array(this.particleCount).map(() => Math.random()),
        divisor: 1,
      },
      instanceSpeed: {
        numComponents: 1,
        data: new Float32Array(this.particleCount).map(
          () => Math.random() * 0.5 + 0.5
        ),
        divisor: 1,
      },
      instanceAngularVelocity: {
        numComponents: 1,
        data: new Float32Array(this.particleCount).map(
          () => Math.random() * 2 - 1
        ),
        divisor: 1,
      },
      instanceSpriteIndex: {
        numComponents: 1,
        data: new Float32Array(this.particleCount).map(() =>
          Math.floor(Math.random() * SPRITE_COUNT)
        ),
        divisor: 1,
      },
      instanceColor: {
        numComponents: 3,
        data: new Float32Array(this.particleCount * 3).map((_, index) => {
          return 1;
          switch (index % 3) {
            case 0:
              return 0.9 + Math.random() * 0.1;
            case 1:
              return 0.9 + Math.random() * 0.1;
            case 2:
              return 0.6 + Math.random() * 0.15;
            default:
              return 0;
          }
        }),
        divisor: 1,
      },
    });
    this.vertexArrayInfoParticle = createVertexArrayInfo(
      this.gl,
      this.programInfoParticle,
      this.bufferInfoParticle
    );

    return [this.bufferInfoParticle, this.vertexArrayInfoParticle];
  }

  private onResize() {
    const newOrientation =
      window.innerHeight > window.innerWidth ? "portrait" : "landscape";

    this.createParticleArrays();

    if (newOrientation !== this.orientation) {
      this.width = newOrientation === "portrait" ? WIDTH_PORTRAIT : WIDTH;
      this.orientation = newOrientation;
      this.uniformsLogo.u_resolution =
        newOrientation === "portrait" ? RESOLUTION_PORTRAIT : RESOLUTION;
      this.uniformsLogo.u_map_wordmark =
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

    this.uniformsLogo.u_resolution =
      this.orientation === "portrait" ? RESOLUTION_PORTRAIT : RESOLUTION;

    const [wordmark, wordmarkPortrait, background, noise, particle] =
      await Promise.all([
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
        await createTextureAsync(this.gl, {
          src: noiseMap,
          flipY: 1,
        }),
        await createTextureAsync(this.gl, {
          src: particleMap,
          flipY: 1,
        }),
      ]);

    this.wordmark = wordmark;
    this.wordmarkPortrait = wordmarkPortrait;
    this.noiseMap = noise;
    this.uniformsParticle.u_noise_map = noise;
    this.uniformsLogo.u_map_wordmark =
      this.orientation === "portrait" ? wordmarkPortrait : wordmark;
    this.uniformsLogo.u_map_background = background;
    this.uniformsParticle.u_particle_map = particle;
    this.loaded = true;

    const onVideoFrame = () => {
      setTextureFromElement(
        this.gl,
        this.uniformsLogo.u_map_background.texture,
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
      this.uniformsLogo.u_resolution[0] / this.uniformsLogo.u_resolution[1];

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
    this.uniformsLogo.u_color = color;
  }

  public set opacity(opacity: number) {
    this.uniformsLogo.u_opacity = opacity;
  }

  public get opacity(): number {
    return this.uniformsLogo.u_opacity;
  }

  public set width(width: number) {
    this._width = width;
  }

  public get width(): number {
    return this._width;
  }

  public set noiseScale(scale: number) {
    this.uniformsLogo.u_noise_scale = scale;
  }

  private renderParticles(): void {
    this.uniformsParticle.u_time = Date.now() - this.startTime;
    this.uniformsParticle.u_resolution = [
      this.gl.canvas.width / window.devicePixelRatio,
      this.gl.canvas.height / window.devicePixelRatio,
    ];

    this.gl.useProgram(this.programInfoParticle.program);
    setBuffersAndAttributes(
      this.gl,
      this.programInfoParticle,
      this.vertexArrayInfoParticle
    );
    setUniforms(this.programInfoParticle, this.uniformsParticle);
    drawBufferInfo(
      this.gl,
      this.vertexArrayInfoParticle,
      this.gl.TRIANGLES,
      this.vertexArrayInfoParticle.numElements,
      0,
      this.particleCount
    );
  }

  private renderLogo(): void {
    this.uniformsLogo.u_time = Date.now() - this.startTime;
    this.uniformsLogo.u_touch_opacity = this.uniformsLogo.u_touch_opacity +=
      (this.targetTouchOpacity - this.uniformsLogo.u_touch_opacity) * 0.02;
    this.uniformsLogo.u_mouse_position[0] +=
      (this.targetMousePosition[0] - this.uniformsLogo.u_mouse_position[0]) *
      0.02;
    this.uniformsLogo.u_mouse_position[1] +=
      (this.targetMousePosition[1] - this.uniformsLogo.u_mouse_position[1]) *
      0.02;
    this.uniformsLogo.u_touch_opacity +=
      (this.targetTouchOpacity - this.uniformsLogo.u_touch_opacity) * 0.02;

    const aspectRatio =
      this.uniformsLogo.u_resolution[0] / this.uniformsLogo.u_resolution[1];
    const displayWidth = this.gl.canvas.width * this.width;
    const displayHeight = displayWidth / aspectRatio;
    const paddingX = (this.gl.canvas.width - displayWidth) * 0.5;
    const paddingY =
      (this.gl.canvas.height - displayHeight) *
      (this.orientation === "portrait" ? 0.58 : 0.5);
    this.gl.viewport(paddingX, paddingY, displayWidth, displayHeight);

    this.gl.useProgram(this.programInfoLogo.program);
    setBuffersAndAttributes(
      this.gl,
      this.programInfoLogo,
      this.vertexArrayInfoLogo
    );
    setUniforms(this.programInfoLogo, this.uniformsLogo);
    drawBufferInfo(this.gl, this.vertexArrayInfoLogo);
  }

  public render() {
    if (!this.loaded) return;

    resizeCanvasToDisplaySize(
      this.gl.canvas as HTMLCanvasElement,
      window.devicePixelRatio
    );
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT); // Clear with the transparent color

    this.renderParticles();
    this.renderLogo();
  }
}

export default TitleRenderer;
