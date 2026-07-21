import "./index.css";
import {Composition} from "remotion";
import {DirectorComposition} from "./DirectorComposition";
import {defaultDirectorProps, totalDurationInFrames as totalDirectorDurationInFrames} from "./directorData";
import {RenderPlanReviewSheet} from "./RenderPlanReviewSheet";
import {defaultRenderPlan, totalDurationInFrames as totalRenderPlanDurationInFrames} from "./renderPlanData";
import {VideoProjectComposition} from "./VideoProjectComposition";

const fps = defaultRenderPlan.meta.fps;
const videoProjectDurationInFrames = totalRenderPlanDurationInFrames(fps, defaultRenderPlan);
const directorDurationInFrames = totalDirectorDurationInFrames(fps, defaultDirectorProps);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DirectorVertical"
        component={DirectorComposition}
        durationInFrames={directorDurationInFrames}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={defaultDirectorProps}
      />
      <Composition
        id="DirectorHorizontal"
        component={DirectorComposition}
        durationInFrames={directorDurationInFrames}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={defaultDirectorProps}
      />
      <Composition
        id="VideoProjectHorizontal"
        component={VideoProjectComposition}
        durationInFrames={videoProjectDurationInFrames}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={defaultRenderPlan}
      />
      <Composition
        id="VideoProjectVertical"
        component={VideoProjectComposition}
        durationInFrames={videoProjectDurationInFrames}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={defaultRenderPlan}
      />
      <Composition
        id="RenderPlanReviewSheet"
        component={RenderPlanReviewSheet}
        durationInFrames={1}
        fps={fps}
        width={1800}
        height={1200}
        defaultProps={defaultRenderPlan}
      />
    </>
  );
};
