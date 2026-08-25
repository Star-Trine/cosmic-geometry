import { useEffect, useMemo, useState } from 'react';
import type { AspectData, AspectType, PlanetVisualData } from '../../data/horoscope/types';
import { PLANET_METADATA_BY_ID, PLANET_VISUAL_METADATA, formatClassification, formatHouse, formatZodiacSign, getHouseEnvironmentConfig, type AvailablePlanetVisualId } from './visualProfileConfig';
import { findPlanetVisualParameter, type PlanetVisualParameter } from './visualProfileParameters';
import { createSignVisualTransformation } from './visualProfileTransformations';
import { PLANET_RENDERERS } from './visualProfile/geometry/planetRenderers';
import { CENTER, polarPoint } from './visualProfile/geometry/shared';
import { getPlanetRelations } from './visualProfile/relation/getPlanetRelations';
import type { PlanetRelation } from './visualProfile/relation/types';

export { PLANET_RENDERERS } from './visualProfile/geometry/planetRenderers';

export type VisualProfilePrototypeId = AvailablePlanetVisualId;
export type VisualProfileViewMode = 'individual' | 'relation';

type VisualProfileInfoProps = {
  selectedPrototype: VisualProfilePrototypeId;
  viewMode: VisualProfileViewMode;
  planets?: PlanetVisualData[] | null;
  parameter?: PlanetVisualParameter;
  relation?: PlanetRelation | null;
};

const formatAspectType = (type: AspectType): string =>
  type.charAt(0).toUpperCase() + type.slice(1);

const formatAngle = (value: number): string => `${value.toFixed(2)}°`;

export function VisualProfileInfo({ selectedPrototype, viewMode, planets = null, parameter: parameterOverride, relation = null }: VisualProfileInfoProps) {
  if (viewMode === 'relation') {
    if (!relation || !planets) {
      return <section className="visual-profile-relation-info" aria-label="Relation profile information"><p className="horoscope-empty">No relation data is selected.</p></section>;
    }
    const source = findPlanetVisualParameter(planets, relation.sourcePlanetId);
    const target = findPlanetVisualParameter(planets, relation.targetPlanetId);
    if (!source || !target) {
      return <section className="visual-profile-relation-info" aria-label="Relation profile information"><p className="horoscope-empty">Relation planet data is unavailable.</p></section>;
    }
    const sourceMetadata = PLANET_METADATA_BY_ID[source.planetId];
    const targetMetadata = PLANET_METADATA_BY_ID[target.planetId];
    return (
      <section className="visual-profile-relation-info" aria-label="Relation profile information">
        <p className="visual-profile-relation-info__label">Relation</p>
        <div className="visual-profile-relation-info__endpoint"><span aria-hidden="true">{sourceMetadata.symbol}</span><div><small>From</small><strong>{sourceMetadata.name}</strong><p>{formatZodiacSign(source.sign)} / {formatHouse(source.house)}</p></div></div>
        <div className="visual-profile-relation-info__aspect"><small>Aspect</small><strong>{formatAspectType(relation.type)}</strong><dl><div><dt>Angle</dt><dd>{formatAngle(relation.angle)}</dd></div><div><dt>Orb</dt><dd>{formatAngle(relation.orb)}</dd></div></dl></div>
        <div className="visual-profile-relation-info__endpoint"><span aria-hidden="true">{targetMetadata.symbol}</span><div><small>To</small><strong>{targetMetadata.name}</strong><p>{formatZodiacSign(target.sign)} / {formatHouse(target.house)}</p></div></div>
      </section>
    );
  }
  const parameter = parameterOverride ?? (planets ? findPlanetVisualParameter(planets, selectedPrototype) : null);
  if (!parameter) return <section className="visual-profile-prototype-info" aria-label="Profile information unavailable"><p className="horoscope-empty">Generate a horoscope to view this planet profile.</p></section>;
  const metadata = PLANET_METADATA_BY_ID[parameter.planetId];
  const profile = [['Sign', formatZodiacSign(parameter.sign)], ['Polarity', formatClassification(parameter.polarity)], ['Modality', formatClassification(parameter.modality)], ['Element', formatClassification(parameter.element)], ['House', formatHouse(parameter.house)]];
  return (
    <section className="visual-profile-prototype-info" aria-label="Prototype profile information">
      <div className="visual-profile-prototype-info__identity"><span aria-hidden="true">{metadata.symbol}</span><div><p>Planet / Actor</p><h3>{metadata.name}</h3></div></div>
      <dl>{profile.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </section>
  );
}

function SextileRelationGeometry({ angle }: { angle: number }) {
  const resonancePoints = [0, 60, 120, 180, 240, 300].map((angle) => polarPoint(70, angle - 30));
  return (
    <svg className="visual-profile-relation__operator-svg" viewBox="0 0 480 480" aria-label="Sextile relation operator" role="img">
      <defs><filter id="visual-profile-sextile-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      <g id="visual-profile-aspect-relation-layer">
        <g className="visual-profile-sextile__direction" aria-label="60 degree bridge direction">
          <path d="M 176 286 C 205 266, 230 234, 266 202" />
          <path d="M 258 203 L 269 198 L 266 210" />
        </g>
        <g className="visual-profile-sextile__bridges"><path d="M 112 280 C 165 174, 292 174, 368 248" /><path d="M 118 307 C 195 231, 283 231, 362 275" /><path d="M 143 330 C 210 286, 279 286, 338 303" /></g>
        <polygon className="visual-profile-sextile__resonance" points={resonancePoints.map((point) => `${point.x},${point.y}`).join(' ')} />
        <g className="visual-profile-sextile__nodes">{resonancePoints.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r={index % 2 === 0 ? 3.2 : 2.2} />)}</g>
        <g className="visual-profile-sextile__pulses"><circle cx="112" cy="280" r="4" /><circle cx="118" cy="307" r="3" /><circle cx="143" cy="330" r="2.5" /></g>
        <text className="visual-profile-sextile__label" x={CENTER} y="164">SEXTILE · {formatAngle(angle)}</text>
      </g>
    </svg>
  );
}

function TrineRelationGeometry({ angle }: { angle: number }) {
  const resonancePoints = [-90, 30, 150].map((direction) => polarPoint(76, direction));
  return (
    <svg className="visual-profile-relation__operator-svg" viewBox="0 0 480 480" aria-label="Trine resonance flow operator" role="img">
      <defs>
        <filter id="visual-profile-trine-glow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g id="visual-profile-trine-relation-layer">
        <polygon className="visual-profile-trine__field" points={resonancePoints.map((point) => `${point.x},${point.y}`).join(' ')} />
        <g className="visual-profile-trine__flows" aria-label="120 degree resonance flow">
          <path d="M 142 294 C 167 185, 277 149, 343 218 C 380 257, 345 329, 282 337" />
          <path d="M 151 316 C 206 260, 214 180, 288 181 C 346 183, 368 243, 330 289" />
          <path d="M 174 335 C 236 321, 284 278, 279 222 C 275 184, 246 162, 216 171" />
        </g>
        <g className="visual-profile-trine__nodes">{resonancePoints.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="3" />)}</g>
        <circle className="visual-profile-trine__circulation" cx={CENTER} cy={CENTER} r="29" />
        <text className="visual-profile-trine__label" x={CENTER} y="147">TRINE · {formatAngle(angle)}</text>
      </g>
    </svg>
  );
}

function SquareRelationGeometry({ angle }: { angle: number }) {
  return (
    <svg className="visual-profile-relation__operator-svg" viewBox="0 0 480 480" aria-label="Square cross-force operator" role="img">
      <defs>
        <filter id="visual-profile-square-glow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="2.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g id="visual-profile-square-relation-layer">
        <rect className="visual-profile-square__tension-frame" x="188" y="188" width="104" height="104" />
        <g className="visual-profile-square__forces" aria-label="90 degree cross force">
          <path d="M 118 240 L 362 240" />
          <path d="M 240 112 L 240 368" />
          <path d="M 222 222 L 258 222 L 258 258" />
        </g>
        <g className="visual-profile-square__force-heads">
          <path d="M 228 126 L 240 112 L 252 126" />
          <path d="M 228 354 L 240 368 L 252 354" />
          <path d="M 132 228 L 118 240 L 132 252" />
          <path d="M 348 228 L 362 240 L 348 252" />
        </g>
        <circle className="visual-profile-square__impact" cx={CENTER} cy={CENTER} r="8" />
        <text className="visual-profile-square__label" x={CENTER} y="154">SQUARE · {formatAngle(angle)}</text>
      </g>
    </svg>
  );
}

function OppositionRelationGeometry({ angle }: { angle: number }) {
  return (
    <svg className="visual-profile-relation__operator-svg" viewBox="0 0 480 480" aria-label="Opposition axis polarity operator" role="img">
      <defs>
        <filter id="visual-profile-opposition-glow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="3.4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g id="visual-profile-opposition-relation-layer">
        <g className="visual-profile-opposition__axis" aria-label="180 degree polarity axis">
          <line x1="106" y1={CENTER} x2="374" y2={CENTER} />
          <path d="M 130 226 L 106 240 L 130 254" />
          <path d="M 350 226 L 374 240 L 350 254" />
        </g>
        <g className="visual-profile-opposition__poles">
          <circle cx="142" cy={CENTER} r="13" />
          <circle cx="338" cy={CENTER} r="13" />
        </g>
        <circle className="visual-profile-opposition__balance" cx={CENTER} cy={CENTER} r="9" />
        <line className="visual-profile-opposition__balance-line" x1={CENTER} y1="200" x2={CENTER} y2="280" />
        <text className="visual-profile-opposition__label" x={CENTER} y="174">OPPOSITION · {formatAngle(angle)}</text>
      </g>
    </svg>
  );
}

function ConjunctionRelationGeometry({ angle }: { angle: number }) {
  return (
    <svg className="visual-profile-relation__operator-svg" viewBox="0 0 480 480" aria-label="Conjunction fusion operator" role="img">
      <defs>
        <filter id="visual-profile-conjunction-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g id="visual-profile-conjunction-relation-layer">
        <g className="visual-profile-conjunction__fusion-rings">
          <circle cx={CENTER} cy={CENTER} r="54" />
          <circle cx={CENTER} cy={CENTER} r="38" />
          <circle cx={CENTER} cy={CENTER} r="20" />
        </g>
        <circle className="visual-profile-conjunction__fusion-core" cx={CENTER} cy={CENTER} r="7" />
        <text className="visual-profile-conjunction__label" x={CENTER} y="164">CONJUNCTION · {formatAngle(angle)}</text>
      </g>
    </svg>
  );
}

type RelationViewProps = {
  relation: PlanetRelation;
  source: PlanetVisualParameter;
  target: PlanetVisualParameter;
  relationIndex: number;
  relationCount: number;
  onPrevious: () => void;
  onNext: () => void;
};

function RelationView({ relation, source, target, relationIndex, relationCount, onPrevious, onNext }: RelationViewProps) {
  const [runId, setRunId] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const prefersReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSextile = relation.type === 'sextile';
  const isConjunction = relation.type === 'conjunction';
  const isTrine = relation.type === 'trine';
  const isSquare = relation.type === 'square';
  const isOpposition = relation.type === 'opposition';
  const isAnimated = isSextile || isConjunction || isTrine || isSquare || isOpposition;
  const play = () => {
    if (prefersReducedMotion) { setHasPlayed(true); setIsPlaying(false); return; }
    setRunId((current) => current + 1); setIsPlaying(true); setHasPlayed(false);
  };
  const stageClassName = ['visual-profile-relation-stage', isPlaying ? 'is-playing' : '', hasPlayed ? 'is-complete' : '', prefersReducedMotion ? 'is-reduced-motion' : ''].filter(Boolean).join(' ');
  return (
    <div className="visual-profile-relation">
      <div className="visual-profile-relation__heading"><p>Relation / Actual Aspect Data</p><h2>{PLANET_METADATA_BY_ID[source.planetId].name} → {formatAspectType(relation.type)} → {PLANET_METADATA_BY_ID[target.planetId].name}</h2></div>
      <div className="visual-profile-relation__navigation"><button type="button" onClick={onPrevious} disabled={relationIndex === 0}>Previous</button><span>Relation {relationIndex + 1} / {relationCount}</span><button type="button" onClick={onNext} disabled={relationIndex === relationCount - 1}>Next</button></div>
      {isAnimated && <div className="visual-profile-relation__controls"><button type="button" onClick={play} disabled={isPlaying}>{hasPlayed ? 'Replay' : 'Play'}</button><span aria-live="polite">{prefersReducedMotion ? 'Reduced motion: final state preview' : isPlaying ? 'Transition in progress' : hasPlayed ? `${PLANET_METADATA_BY_ID[target.planetId].name} / Arrival complete` : `${PLANET_METADATA_BY_ID[source.planetId].name} / Ready`}</span></div>}
      <div key={runId} className={`${stageClassName}${isSextile ? ' is-sextile' : isConjunction ? ' is-conjunction' : isTrine ? ' is-trine' : isSquare ? ' is-square' : ' is-opposition'}`} onAnimationEnd={(event) => { if (event.currentTarget === event.target && isPlaying) { setIsPlaying(false); setHasPlayed(true); } }} aria-label={`${PLANET_METADATA_BY_ID[source.planetId].name} to ${PLANET_METADATA_BY_ID[target.planetId].name} ${relation.type} relation`}>
        <div className="visual-profile-relation__profile visual-profile-relation__profile--sun">{renderPrototype(source, '-relation-source')}</div>
        <div className="visual-profile-relation__operator">{isSextile
          ? <SextileRelationGeometry angle={relation.angle} />
          : isConjunction
            ? <ConjunctionRelationGeometry angle={relation.angle} />
            : isTrine
              ? <TrineRelationGeometry angle={relation.angle} />
              : isSquare
                ? <SquareRelationGeometry angle={relation.angle} />
                : <OppositionRelationGeometry angle={relation.angle} />}</div>
        <div className="visual-profile-relation__profile visual-profile-relation__profile--mars">{renderPrototype(target, '-relation-target')}</div>
      </div>
      {isSextile && <ol className="visual-profile-relation__phases" aria-label="Transition phases"><li>{PLANET_METADATA_BY_ID[source.planetId].name}</li><li>Departure</li><li>Sextile</li><li>Arrival</li><li>{PLANET_METADATA_BY_ID[target.planetId].name}</li></ol>}
      {isConjunction && <ol className="visual-profile-relation__phases visual-profile-relation__phases--conjunction" aria-label="Conjunction transition phases"><li>{PLANET_METADATA_BY_ID[source.planetId].name}</li><li>Center</li><li>Overlap</li><li>Fusion</li><li>Separation</li><li>{PLANET_METADATA_BY_ID[target.planetId].name}</li></ol>}
      {isTrine && <ol className="visual-profile-relation__phases" aria-label="Trine transition phases"><li>{PLANET_METADATA_BY_ID[source.planetId].name}</li><li>Release</li><li>Resonance</li><li>Flow</li><li>{PLANET_METADATA_BY_ID[target.planetId].name}</li></ol>}
      {isSquare && <ol className="visual-profile-relation__phases visual-profile-relation__phases--conjunction" aria-label="Square transition phases"><li>{PLANET_METADATA_BY_ID[source.planetId].name}</li><li>Advance</li><li>Stop</li><li>Cross-force</li><li>Redirection</li><li>{PLANET_METADATA_BY_ID[target.planetId].name}</li></ol>}
      {isOpposition && <ol className="visual-profile-relation__phases visual-profile-relation__phases--conjunction" aria-label="Opposition transition phases"><li>{PLANET_METADATA_BY_ID[source.planetId].name}</li><li>Advance</li><li>Axis</li><li>Polarity</li><li>Reversal</li><li>{PLANET_METADATA_BY_ID[target.planetId].name}</li></ol>}
    </div>
  );
}

function renderPrototype(parameter: PlanetVisualParameter, instanceId?: string) {
  const Renderer = PLANET_RENDERERS[parameter.planetId];
  return <Renderer parameter={parameter} environment={getHouseEnvironmentConfig(parameter.house)} transformation={createSignVisualTransformation(parameter)} instanceId={instanceId} />;
}

export type VisualProfileRelationSelection = {
  relation: PlanetRelation;
  index: number;
  count: number;
};

type VisualProfileProps = {
  planets: PlanetVisualData[] | null;
  aspects: AspectData[] | null;
  selectedPrototype: VisualProfilePrototypeId;
  onSelectPrototype: (prototype: VisualProfilePrototypeId) => void;
  viewMode: VisualProfileViewMode;
  onChangeViewMode: (viewMode: VisualProfileViewMode) => void;
  onRelationSelectionChange?: (selection: VisualProfileRelationSelection | null) => void;
};

export default function VisualProfile({ planets, aspects, selectedPrototype, onSelectPrototype, viewMode, onChangeViewMode, onRelationSelectionChange }: VisualProfileProps) {
  const [relationIndex, setRelationIndex] = useState(0);
  const parameter = planets ? findPlanetVisualParameter(planets, selectedPrototype) : null;
  const metadata = PLANET_METADATA_BY_ID[selectedPrototype];
  const environment = parameter ? getHouseEnvironmentConfig(parameter.house) : null;
  const relations = useMemo(
    () => aspects ? getPlanetRelations(aspects, selectedPrototype) : [],
    [aspects, selectedPrototype],
  );
  const safeRelationIndex = relations.length === 0 ? 0 : Math.min(relationIndex, relations.length - 1);
  const selectedRelation = relations[safeRelationIndex] ?? null;
  const sourceParameter = selectedRelation && planets
    ? findPlanetVisualParameter(planets, selectedRelation.sourcePlanetId)
    : null;
  const targetParameter = selectedRelation && planets
    ? findPlanetVisualParameter(planets, selectedRelation.targetPlanetId)
    : null;

  useEffect(() => {
    setRelationIndex(0);
  }, [selectedPrototype, aspects]);

  useEffect(() => {
    if (relationIndex !== safeRelationIndex) setRelationIndex(safeRelationIndex);
  }, [relationIndex, safeRelationIndex]);

  useEffect(() => {
    onRelationSelectionChange?.(selectedRelation
      ? { relation: selectedRelation, index: safeRelationIndex, count: relations.length }
      : null);
  }, [onRelationSelectionChange, relations.length, safeRelationIndex, selectedRelation]);
  return (
    <section className="visual-profile-prototype">
      <div className="visual-profile-view-selector" aria-label="Visual Profile views"><button type="button" className={viewMode === 'individual' ? 'is-active' : ''} aria-pressed={viewMode === 'individual'} onClick={() => onChangeViewMode('individual')}>Individual</button><button type="button" className={viewMode === 'relation' ? 'is-active' : ''} aria-pressed={viewMode === 'relation'} onClick={() => onChangeViewMode('relation')}>Relation</button></div>
      {viewMode === 'individual' ? <>
        <div className="visual-profile-selector" aria-label="Visual Profile prototypes">{PLANET_VISUAL_METADATA.map((option) => { const isSelected = selectedPrototype === option.id; return <button key={option.id} type="button" className={isSelected ? 'is-active' : ''} aria-pressed={isSelected} disabled={!option.available} title={option.available ? undefined : 'Coming Soon'} onClick={() => { if (option.available) onSelectPrototype(option.id); }}><span aria-hidden="true">{option.symbol}</span>{option.name}</button>; })}</div>
        {parameter && environment ? <>
          <div className="visual-profile-prototype__heading"><p>Individual / Planet · Sign · House</p><h2>{metadata.name} in {formatZodiacSign(parameter.sign)} / {formatHouse(parameter.house)}</h2></div>
          {environment.variant === 'neutral' && <p className="visual-profile-coverage-note">{parameter.house === null ? 'Birth time is unknown; a neutral house environment is shown.' : `${formatHouse(parameter.house)} environment is not designed yet; a neutral field is shown.`}</p>}
          {renderPrototype(parameter)}
        </> : <p className="horoscope-empty">Selected planet data is unavailable. Generate a horoscope to continue.</p>}
      </> : planets === null || aspects === null
        ? <p className="horoscope-empty">Generate a horoscope to view planet relations.</p>
        : !selectedRelation
          ? <p className="horoscope-empty">No major aspects for this planet.</p>
          : sourceParameter && targetParameter
            ? <RelationView
                key={`${selectedPrototype}-${safeRelationIndex}-${selectedRelation.type}`}
                relation={selectedRelation}
                source={sourceParameter}
                target={targetParameter}
                relationIndex={safeRelationIndex}
                relationCount={relations.length}
                onPrevious={() => setRelationIndex((current) => Math.max(0, current - 1))}
                onNext={() => setRelationIndex((current) => Math.min(relations.length - 1, current + 1))}
              />
            : <p className="horoscope-empty">Relation planet data is unavailable.</p>}
    </section>
  );
}
