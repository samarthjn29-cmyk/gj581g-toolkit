import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {ScrollsFrames, FRAMES} from './scrolls/frames.jsx';
const Root = () => <Composition id="ScrollsFrames" component={ScrollsFrames} durationInFrames={FRAMES.length} fps={30} width={1920} height={1080} />;
registerRoot(Root);
