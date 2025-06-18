import vertexShader from "./shaders/vert.glsl?raw";
import fragmentShader from "./shaders/frag.glsl?raw";
import titleMap from "./title-map.png";
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
} from "twgl.js";

const convertToRange = (
  value: number,
  range: [number, number],
  targetRange: [number, number]
) => {
  const [min, max] = range;
  const [targetMin, targetMax] = targetRange;
  return ((value - min) / (max - min)) * (targetMax - targetMin) + targetMin;
};

class TitleRenderer {
  private uniforms: { [key: string]: any };
  private startTime = Date.now();
  private programInfo: ProgramInfo;
  private bufferInfo: BufferInfo;
  private _width = 0.66666;
  private targetMousePosition = [-1, -1];
  private gl: WebGL2RenderingContext;
  private img: HTMLImageElement;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.img = new Image();

    this.createTexture = this.createTexture.bind(this);
    this.uniforms = {
      u_time: this.startTime,
      u_timescale: 0.3,
      u_noise_scale: 1,
      u_resolution: [2200, 880],
      u_opacity: 1,
      u_map_wordmark: createTexture(this.gl, {
        minMag: gl.LINEAR,
        src: [0, 0, 0, 0],
      }),
      u_mouse_position: [-1, -1],
      u_color: [1, 0, 0],
    };
    this.programInfo = createProgramInfo(gl, [vertexShader, fragmentShader]);
    this.bufferInfo = primitives.createXYQuadBufferInfo(gl);

    this.img.addEventListener("load", this.createTexture);
    this.img.src = titleMap;
  }

  public onMouseMove([x, y]: [number, number]) {
    const aspectRatio =
      this.uniforms.u_resolution[0] / this.uniforms.u_resolution[1];

    const displayWidth = window.innerWidth * this.width;
    const displayHeight = displayWidth / aspectRatio;

    const paddingX = (window.innerWidth - displayWidth) * 0.5;
    const paddingY = (window.innerHeight - displayHeight) * 0.5;

    this.targetMousePosition = [
      (x - paddingX) / displayWidth,
      1 - (y - paddingY) / displayHeight,
    ];
  }

  private createTexture() {
    this.uniforms.u_resolution = [this.img.width, this.img.height];
    this.uniforms.u_map_wordmark = createTexture(this.gl, {
      minMag: this.gl.LINEAR,
      src: this.img,
      flipY: 1,
    });
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

    this.uniforms.u_mouse_position[0] +=
      (this.targetMousePosition[0] - this.uniforms.u_mouse_position[0]) * 0.02;

    this.uniforms.u_mouse_position[1] +=
      (this.targetMousePosition[1] - this.uniforms.u_mouse_position[1]) * 0.02;

    const paddingX = (this.gl.canvas.width - displayWidth) * 0.5;
    const paddingY = (this.gl.canvas.height - displayHeight) * 0.5;
    this.gl.viewport(paddingX, paddingY, displayWidth, displayHeight);
    drawBufferInfo(this.gl, this.bufferInfo);
  }
}

export default TitleRenderer;
