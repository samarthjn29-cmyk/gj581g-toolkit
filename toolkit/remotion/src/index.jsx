import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {Video, TOTAL} from './Video';

// grain: true renders the film grain in the browser (one-step render on a fast computer, with narration);
// the cloud workspace renders with grain false and adds it in ffmpeg while assembling (assemble.sh), which is cheaper there.
const Root = () => <Composition id="Video" component={Video} defaultProps={{grain: true}} durationInFrames={Math.round(TOTAL * 30)} fps={30} width={1920} height={1080} />;
registerRoot(Root);
