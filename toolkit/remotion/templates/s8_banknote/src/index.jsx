import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Pilot, DUR} from './pilot';
const Root = () => <Composition id="Pilot" component={Pilot} durationInFrames={DUR} fps={30} width={1920} height={1080} />;
registerRoot(Root);
