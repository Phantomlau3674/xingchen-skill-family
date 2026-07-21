export const transitionForRole = (editorialRole: string) => {
  switch (editorialRole) {
    case "establish":
      return "directional-push";
    case "proof":
      return "zoom-burst";
    case "contrast":
      return "contrast-cut";
    case "release":
      return "fade-out";
    default:
      return "fade";
  }
};

export const getStageOverlapFrames = (transitionOut: string, fps: number) => {
  switch (transitionOut) {
    case "contrast-cut":
      return Math.max(2, Math.round(fps * 0.06));
    case "zoom-burst":
      return Math.max(4, Math.round(fps * 0.12));
    case "directional-push":
      return Math.max(8, Math.round(fps * 0.22));
    case "fade-out":
      return Math.max(12, Math.round(fps * 0.34));
    default:
      return Math.max(6, Math.round(fps * 0.18));
  }
};
