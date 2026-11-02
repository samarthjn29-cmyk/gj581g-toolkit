import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {Video, TOTAL} from './Video';
import {KitSheet} from './kitsheet';
import {ThumbA, ThumbB, ThumbC, ThumbD} from './thumbs';
const Root = () => <>
  <Composition id="Video" component={Video} defaultProps={{grain: true}} durationInFrames={Math.max(1, Math.round(TOTAL * 30))} fps={30} width={1920} height={1080} />
  <Composition id="KitSheet" component={KitSheet} durationInFrames={30} fps={30} width={1920} height={1080} />
  {[['ThumbA', ThumbA], ['ThumbB', ThumbB], ['ThumbC', ThumbC], ['ThumbD', ThumbD]].map(([id, c]) => <Composition key={id} id={id} component={c} durationInFrames={30} fps={30} width={1920} height={1080} />)}
</>;
registerRoot(Root);
