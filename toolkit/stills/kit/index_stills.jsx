// Render any stills-workflow scene: npx remotion render src/index_stills.jsx Scene out.mp4 --props=public/<dir>/timeline.json
import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {StillsScene} from './stills/StillsScene.jsx';
registerRoot(() => <Composition id="Scene" component={StillsScene} fps={30} width={1920} height={1080} durationInFrames={30}
  defaultProps={{dir: '', shots: [], cards: []}} calculateMetadata={({props}) => ({durationInFrames: Math.max(30, Math.round((props.dur || 1) * 30))})} />);
