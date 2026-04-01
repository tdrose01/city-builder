import React, { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const BUILDING_VARIANTS = {
  low: [
    'low-detail-building-a.glb','low-detail-building-b.glb','low-detail-building-c.glb','low-detail-building-d.glb',
    'low-detail-building-e.glb','low-detail-building-f.glb','low-detail-building-g.glb','low-detail-building-h.glb',
    'low-detail-building-i.glb','low-detail-building-j.glb','low-detail-building-k.glb','low-detail-building-l.glb',
    'low-detail-building-m.glb','low-detail-building-n.glb','low-detail-building-wide-a.glb','low-detail-building-wide-b.glb'
  ],
  medium: [
    'building-a.glb','building-b.glb','building-c.glb','building-d.glb','building-e.glb','building-f.glb','building-g.glb',
    'building-h.glb','building-i.glb','building-j.glb','building-k.glb','building-l.glb','building-m.glb','building-n.glb'
  ],
  high: [
    'building-skyscraper-a.glb','building-skyscraper-b.glb','building-skyscraper-c.glb','building-skyscraper-d.glb','building-skyscraper-e.glb'
  ]
};

const DETAILS = [
  'detail-awning.glb',
  'detail-awning-wide.glb',
  'detail-overhang.glb',
  'detail-overhang-wide.glb',
  'detail-parasol-a.glb',
  'detail-parasol-b.glb'
];

const BASE_PATH = '/kenney-city/Models/GLB format/';

const allModelPaths = [
  ...Object.values(BUILDING_VARIANTS).flat(),
  ...DETAILS,
].map((name) => `${BASE_PATH}${name}`);

allModelPaths.forEach((path) => useGLTF.preload(path));

const seededIndex = (seed, length) => {
  if (length <= 0) return 0;
  const normalized = Math.abs(Math.sin(seed * 999.91) * 10000);
  return Math.floor(normalized) % length;
};

const Building = ({ level = 0, tileId = 0, tileType = 'Funds', scale = 0.3 }) => {
  const groupRef = useRef();

  const modelPath = useMemo(() => {
    const tier = level >= 4 ? 'high' : level >= 2 ? 'medium' : 'low';
    const buildings = BUILDING_VARIANTS[tier];
    const details = DETAILS;

    const typeSeed = tileType.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const seed = tileId * 37 + level * 11 + typeSeed;

    const main = buildings[seededIndex(seed, buildings.length)];
    const detail = details[seededIndex(seed + 17, details.length)];

    return {
      main: `${BASE_PATH}${main}`,
      detail: `${BASE_PATH}${detail}`,
    };
  }, [level, tileId, tileType]);

  const mainGltf = useGLTF(modelPath.main);
  const detailGltf = useGLTF(modelPath.detail);

  const mainScene = useMemo(() => mainGltf.scene.clone(true), [mainGltf.scene]);
  const detailScene = useMemo(() => detailGltf.scene.clone(true), [detailGltf.scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const wobble = 0.015 + (tileId % 4) * 0.004;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * (1.4 + (tileId % 3) * 0.2)) * wobble;
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={mainScene} />
      <group position={[0, 0.02, 0]} scale={0.95}>
        <primitive object={detailScene} />
      </group>
    </group>
  );
};

const BuildingPlaceholder = ({ level = 0 }) => {
  const height = 0.45 + level * 0.15;
  return (
    <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
      <boxGeometry args={[0.75, height, 0.75]} />
      <meshStandardMaterial color="#8b9bb4" metalness={0.2} roughness={0.75} />
    </mesh>
  );
};

const BuildingWithFallback = (props) => (
  <Suspense fallback={<BuildingPlaceholder level={props.level} />}>
    <Building {...props} />
  </Suspense>
);

export default BuildingWithFallback;
export { BuildingPlaceholder };
