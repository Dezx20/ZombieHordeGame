export let rain = {
  alpha: {
    start: 0.17,
    end: 0.32
  },
  scale: {
    start: 1,
    end: 1,
    minimumScaleMultiplier: 1
  },
  color: {
    start: "#fa0000",
    end: "#ffffff"
  },
  speed: {
    start: 3000,
    end: 3000,
    minimumSpeedMultiplier: 1
  },
  acceleration: {
    x: 0,
    y: 0
  },
  maxSpeed: 0,
  startRotation: {
    min: 65,
    max: 65
  },
  noRotation: false,
  rotationSpeed: {
    min: 0,
    max: 0
  },
  lifetime: {
    min: 0.81,
    max: 0.81
  },
  blendMode: "normal",
  frequency: 0.004,
  emitterLifetime: -1,
  maxParticles: 1000,
  pos: {
    x: 0,
    y: 0
  },
  addAtBack: false,
  spawnType: "rect",
  spawnRect: {
    x: -600,
    y: -460,
    w: 900,
    h: 20
  }
};
