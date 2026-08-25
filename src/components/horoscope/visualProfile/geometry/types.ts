import type { ComponentType } from 'react';
import type { HouseEnvironmentConfig } from '../../visualProfileConfig';
import type { PlanetVisualParameter } from '../../visualProfileParameters';
import type { SignVisualTransformation } from '../../visualProfileTransformations';

export type PlanetGeometryProps = {
  parameter: PlanetVisualParameter;
  environment: HouseEnvironmentConfig;
  transformation: SignVisualTransformation;
  instanceId?: string;
};

export type PlanetGeometryRenderer = ComponentType<PlanetGeometryProps>;

export type MarsGeometryProps = PlanetGeometryProps & {
  relationSnapshot?: boolean;
};
