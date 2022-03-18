export enum BodyTransformationStage {
  strength,
  flesh,
  viscera,
  muscle,
  bone,
  pulse,
  marrow
}

export enum EightGates {
  healing,
  limit,
  wonder,
  pain,
  opening,
  view,
  life,
  death
}

export enum DaoPalaceStars {
  destruction,
  wolf,
  kismet,
  star,
  titan,
  song,
  virtue,
  channel,
  origin,
  understanding
}

export class BodyTransformation {
  stage: BodyTransformationStage;
  gate: EightGates
  start: DaoPalaceStars
}

