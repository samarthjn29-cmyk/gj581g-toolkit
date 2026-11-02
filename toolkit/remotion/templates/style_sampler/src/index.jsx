import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {LEN} from './common';
import {Kinetic} from './s10_kinetic';
import {Whiteboard} from './s3_whiteboard';
import {Cutout} from './s11_cutout';
import {DataMorph} from './s12_datamorph';
import {Board} from './s2_board';
import {Screen} from './s13_screen';
import {Diorama} from './s14_diorama';
import {Reel, REEL} from './reel';
const C = [['Kinetic', Kinetic], ['Whiteboard', Whiteboard], ['Cutout', Cutout], ['DataMorph', DataMorph], ['Board', Board], ['Screen', Screen], ['Diorama', Diorama]];
const Root = () => <><Composition id="Reel" component={Reel} durationInFrames={REEL} fps={30} width={1920} height={1080} />{C.map(([id, c]) => <Composition key={id} id={id} component={c} durationInFrames={LEN} fps={30} width={1920} height={1080} />)}</>;

registerRoot(Root);
