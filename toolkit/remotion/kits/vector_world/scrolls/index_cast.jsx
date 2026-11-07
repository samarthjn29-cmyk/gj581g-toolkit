import React from 'react';
import {Composition, registerRoot, AbsoluteFill} from 'remotion';
import {CastSheet} from './scrolls/people.jsx';
const Root = () => <Composition id="Cast" component={() => <AbsoluteFill><CastSheet /></AbsoluteFill>} durationInFrames={1} fps={30} width={1920} height={1080} />;
registerRoot(Root);
