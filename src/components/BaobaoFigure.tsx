/**
 * @description 使用 Three.js 渲染 240x240 的小兔桌宠，强调四肢动作和持续跳跃。
 */

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'motion/react';
import * as THREE from 'three';
import { MoodKey } from '../data/moodSchedule';

interface FigurePose {
  bubbleText: string;
  bubbleClass: string;
  haloColor: string;
  sparkColor: string;
  bodyRotation: number;
  bunnyColor: string;
  earColor: string;
}

interface BaobaoFigureProps {
  moodKey: MoodKey;
  isJumping?: boolean;
  reminderText: string;
  phaseTitle: string;
  phaseKey: MoodKey;
}

interface PetSceneProps {
  moodKey: MoodKey;
  isJumping: boolean;
  tapBoost: boolean;
  haloColor: string;
  sparkColor: string;
  bodyRotation: number;
  bunnyColor: string;
  earColor: string;
  onPetTap: () => void;
}

interface BunnyModelProps {
  bunnyColor: string;
  earColor: string;
  moodKey: MoodKey;
  hopStrength: number;
}

/**
 * @description 根据当前心情返回小兔动作和配色参数。
 * @param {MoodKey} moodKey 当前心情标识。
 * @returns {FigurePose}
 */
function getFigurePose(moodKey: MoodKey): FigurePose {
  switch (moodKey) {
    case 'focus':
      return {
        bubbleText: '工作',
        bubbleClass: 'bg-sky-100/95 text-sky-700',
        haloColor: '#93c5fd',
        sparkColor: '#38bdf8',
        bodyRotation: -0.06,
        bunnyColor: '#fff7fb',
        earColor: '#fbcfe8',
      };
    case 'lunch':
      return {
        bubbleText: '干饭',
        bubbleClass: 'bg-amber-100/95 text-amber-700',
        haloColor: '#fdba74',
        sparkColor: '#f59e0b',
        bodyRotation: 0.03,
        bunnyColor: '#fff8ef',
        earColor: '#fed7aa',
      };
    case 'recharge':
      return {
        bubbleText: '活力',
        bubbleClass: 'bg-emerald-100/95 text-emerald-700',
        haloColor: '#86efac',
        sparkColor: '#10b981',
        bodyRotation: 0.06,
        bunnyColor: '#f7fff9',
        earColor: '#bbf7d0',
      };
    case 'wrap':
      return {
        bubbleText: '收尾',
        bubbleClass: 'bg-violet-100/95 text-violet-700',
        haloColor: '#c4b5fd',
        sparkColor: '#8b5cf6',
        bodyRotation: -0.03,
        bunnyColor: '#fcfaff',
        earColor: '#ddd6fe',
      };
    case 'celebrate':
      return {
        bubbleText: '下班',
        bubbleClass: 'bg-pink-100/95 text-pink-700',
        haloColor: '#f9a8d4',
        sparkColor: '#ec4899',
        bodyRotation: 0.11,
        bunnyColor: '#fff6fb',
        earColor: '#fbcfe8',
      };
    default:
      return {
        bubbleText: '待机',
        bubbleClass: 'bg-slate-200/95 text-slate-700',
        haloColor: '#cbd5e1',
        sparkColor: '#94a3b8',
        bodyRotation: 0.02,
        bunnyColor: '#fafafa',
        earColor: '#e5e7eb',
      };
  }
}

/**
 * @description 让摄像机轻微跟随鼠标，增加立体感。
 * @returns {null}
 */
function ScenePointerRig() {
  const { pointer, camera } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.18, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.12 + 0.08, 0.08);
    camera.lookAt(0, 0.08, 0);
  });

  return null;
}

/**
 * @description 渲染带手脚动画的小兔模型。
 * @param {BunnyModelProps} props 模型参数。
 * @returns {JSX.Element}
 */
function BunnyModel({ bunnyColor, earColor, moodKey, hopStrength }: BunnyModelProps) {
  const celebrate = moodKey === 'celebrate';
  const rootRef = useRef<THREE.Group>(null);
  const leftEarRef = useRef<THREE.Group>(null);
  const rightEarRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const run = Math.sin(elapsed * 8);
    const kick = Math.sin(elapsed * 7.2 + Math.PI * 0.28);
    const jump = Math.max(0, run) * hopStrength;

    if (rootRef.current) {
      rootRef.current.position.y = THREE.MathUtils.lerp(rootRef.current.position.y, jump * 0.2, 0.18);
      rootRef.current.rotation.z = THREE.MathUtils.lerp(rootRef.current.rotation.z, run * 0.025, 0.14);
    }

    if (leftArmRef.current && rightArmRef.current) {
      // 左手跟随鼠标轻微摆动，右手保持胸前抬手姿态。
      const leftArmTargetRotZ = -0.2 + state.pointer.x * 0.22 - jump * 0.03;
      const leftArmTargetPosY = -0.24 + state.pointer.y * 0.05 - jump * 0.02;
      const leftArmTargetPosX = -0.28;
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, leftArmTargetRotZ, 0.2);
      leftArmRef.current.position.y = THREE.MathUtils.lerp(leftArmRef.current.position.y, leftArmTargetPosY, 0.16);
      leftArmRef.current.position.x = THREE.MathUtils.lerp(leftArmRef.current.position.x, leftArmTargetPosX, 0.16);
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0.66 + jump * 0.04, 0.2);
    }

    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.z = THREE.MathUtils.lerp(leftLegRef.current.rotation.z, -0.38 - kick * 0.22 - jump * 0.15, 0.18);
      rightLegRef.current.rotation.z = THREE.MathUtils.lerp(rightLegRef.current.rotation.z, 0.38 + kick * 0.22 + jump * 0.15, 0.18);
      leftLegRef.current.position.y = THREE.MathUtils.lerp(leftLegRef.current.position.y, -0.86 - jump * 0.05, 0.16);
      rightLegRef.current.position.y = THREE.MathUtils.lerp(rightLegRef.current.position.y, -0.86 - jump * 0.05, 0.16);
    }

    if (leftEarRef.current && rightEarRef.current) {
      // 长耳轻晃。
      leftEarRef.current.rotation.z = THREE.MathUtils.lerp(leftEarRef.current.rotation.z, -0.2 - jump * 0.08, 0.16);
      rightEarRef.current.rotation.z = THREE.MathUtils.lerp(rightEarRef.current.rotation.z, 0.2 + jump * 0.08, 0.16);
    }
  });

  return (
    <group ref={rootRef}>
      <mesh position={[0.08, -0.48, -0.08]} rotation={[0, -0.24, 0]}>
        <sphereGeometry args={[0.6, 44, 44]} />
        <meshStandardMaterial color={bunnyColor} roughness={0.58} metalness={0.04} />
      </mesh>

      <mesh position={[-0.02, 0.4, 0.08]}>
        <sphereGeometry args={[0.56, 44, 44]} />
        <meshStandardMaterial color={bunnyColor} roughness={0.56} metalness={0.04} />
      </mesh>

      <group ref={leftEarRef} position={[-0.33, 0.88, -0.04]}>
        <mesh position={[0, 0.24, 0]} rotation={[0.1, 0.02, 0.18]}>
          <capsuleGeometry args={[0.102, 0.84, 10, 20]} />
          <meshStandardMaterial color={bunnyColor} roughness={0.55} metalness={0.03} />
        </mesh>
        <mesh position={[0, 0.27, 0.08]} rotation={[0.1, 0.02, 0.18]}>
          <capsuleGeometry args={[0.04, 0.58, 8, 16]} />
          <meshStandardMaterial color={earColor} roughness={0.42} metalness={0.01} />
        </mesh>
      </group>

      <group ref={rightEarRef} position={[0.33, 0.88, -0.04]}>
        <mesh position={[0, 0.24, 0]} rotation={[0.1, -0.02, -0.18]}>
          <capsuleGeometry args={[0.102, 0.84, 10, 20]} />
          <meshStandardMaterial color={bunnyColor} roughness={0.55} metalness={0.03} />
        </mesh>
        <mesh position={[0, 0.27, 0.08]} rotation={[0.1, -0.02, -0.18]}>
          <capsuleGeometry args={[0.04, 0.58, 8, 16]} />
          <meshStandardMaterial color={earColor} roughness={0.42} metalness={0.01} />
        </mesh>
      </group>

      <mesh position={[-0.19, 0.55, 0.62]}>
        <sphereGeometry args={[0.068, 24, 24]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[0.2, 0.55, 0.62]}>
        <sphereGeometry args={[0.068, 24, 24]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[-0.21, 0.58, 0.68]}>
        <sphereGeometry args={[0.018, 14, 14]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.18, 0.58, 0.68]}>
        <sphereGeometry args={[0.018, 14, 14]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>

      <mesh position={[0, 0.35, 0.67]}>
        <sphereGeometry args={[0.046, 18, 18]} />
        <meshStandardMaterial color="#f9a8d4" />
      </mesh>
      <mesh position={[0, 0.23, 0.66]}>
        <boxGeometry args={[0.12, 0.02, 0.03]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      <mesh position={[0, 0.16, 0.67]}>
        <sphereGeometry args={[0.052, 16, 16]} />
        <meshStandardMaterial color="#fb7185" />
      </mesh>

      <mesh position={[-0.26, 0.33, 0.55]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#fbcfe8" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.24, 0.33, 0.55]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#fbcfe8" transparent opacity={0.6} />
      </mesh>

      <group ref={leftArmRef} position={[-0.28, -0.25, 0.52]}>
        <mesh position={[0.01, -0.06, 0]} rotation={[0.08, 0.03, -0.06]}>
          <capsuleGeometry args={[0.06, 0.34, 8, 16]} />
          <meshStandardMaterial color={bunnyColor} roughness={0.55} metalness={0.03} />
        </mesh>
        <mesh position={[0.02, -0.26, 0.08]}>
          <sphereGeometry args={[0.07, 14, 14]} />
          <meshStandardMaterial color="#ffe4ef" />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.24, 0.02, 0.58]}>
        <mesh position={[-0.01, -0.05, 0]} rotation={[0.2, -0.08, 0.34]}>
          <capsuleGeometry args={[0.06, 0.34, 8, 16]} />
          <meshStandardMaterial color={bunnyColor} roughness={0.55} metalness={0.03} />
        </mesh>
        <mesh position={[-0.04, -0.22, 0.12]}>
          <sphereGeometry args={[0.07, 14, 14]} />
          <meshStandardMaterial color="#ffe4ef" />
        </mesh>
      </group>

      <group ref={leftLegRef} position={[-0.24, -0.94, 0.26]}>
        <mesh position={[0, -0.14, 0]} rotation={[0.2, 0, 0]}>
          <capsuleGeometry args={[0.075, 0.42, 10, 18]} />
          <meshStandardMaterial color={bunnyColor} roughness={0.55} metalness={0.03} />
        </mesh>
        <mesh position={[0.02, -0.33, 0.1]} rotation={[0.32, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#fffdf7" roughness={0.6} metalness={0.01} />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.34, -0.9, 0.2]}>
        <mesh position={[0, -0.14, 0]} rotation={[0.24, 0, -0.16]}>
          <capsuleGeometry args={[0.075, 0.42, 10, 18]} />
          <meshStandardMaterial color={bunnyColor} roughness={0.55} metalness={0.03} />
        </mesh>
        <mesh position={[-0.02, -0.33, 0.1]} rotation={[0.34, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#fffdf7" roughness={0.6} metalness={0.01} />
        </mesh>
      </group>

      <mesh position={[0.48, -0.44, -0.42]}>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshStandardMaterial color="#ffffff" roughness={0.62} metalness={0.02} />
      </mesh>

      <mesh position={[0.18, -0.28, 0.55]} rotation={[0.08, -0.2, -0.42]}>
        <cylinderGeometry args={[0.022, 0.024, 1.36, 16]} />
        <meshStandardMaterial color="#3f7f3d" roughness={0.55} />
      </mesh>
      <mesh position={[0.04, -0.08, 0.6]} rotation={[0.5, -0.8, -0.2]}>
        <sphereGeometry args={[0.11, 18, 18]} />
        <meshStandardMaterial color="#2f6f35" roughness={0.5} />
      </mesh>
      <mesh position={[0.3, -0.4, 0.58]} rotation={[-0.5, 0.8, 0.1]}>
        <sphereGeometry args={[0.1, 18, 18]} />
        <meshStandardMaterial color="#2f6f35" roughness={0.5} />
      </mesh>
      <group position={[0.34, 0.22, 0.57]} scale={celebrate ? 1.1 : 1}>
        <mesh>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color="#fda4c0" roughness={0.48} metalness={0.02} />
        </mesh>
        <mesh rotation={[0, 0, 0.62]} position={[0.08, 0.02, 0.04]}>
          <torusGeometry args={[0.18, 0.04, 10, 28]} />
          <meshStandardMaterial color="#f9a8d4" roughness={0.5} />
        </mesh>
        <mesh rotation={[0, 0, -0.62]} position={[-0.08, -0.02, 0.04]}>
          <torusGeometry args={[0.18, 0.04, 10, 28]} />
          <meshStandardMaterial color="#f9a8d4" roughness={0.5} />
        </mesh>
        <mesh rotation={[0.2, 0.2, 0]} position={[0.02, 0.08, 0.08]}>
          <torusGeometry args={[0.12, 0.03, 10, 24]} />
          <meshStandardMaterial color="#fbcfe8" roughness={0.46} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * @description 渲染桌宠主体和轻量光效。
 * @param {PetSceneProps} props 场景参数。
 * @returns {JSX.Element}
 */
function PetScene({
  moodKey,
  isJumping,
  tapBoost,
  haloColor,
  sparkColor,
  bodyRotation,
  bunnyColor,
  earColor,
  onPetTap,
}: PetSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const petBaseY = -0.3;

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const autoHop = Math.abs(Math.sin(elapsed * 5.8));
    const hopStrength = isJumping ? 1.2 : tapBoost ? 1.1 : 0.8;
    const targetY = petBaseY + autoHop * 0.08 * hopStrength;
    const targetRotX = state.pointer.y * 0.12;
    const targetRotY = state.pointer.x * 0.2 + bodyRotation;
    const targetScale = 0.4 + autoHop * 0.01 * hopStrength;

    if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.18);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.14);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.14);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.14));
    }

    if (shadowRef.current) {
      const squash = 0.82 + (1 - autoHop) * 0.2;
      shadowRef.current.scale.x = THREE.MathUtils.lerp(shadowRef.current.scale.x, squash, 0.14);
      shadowRef.current.scale.y = THREE.MathUtils.lerp(shadowRef.current.scale.y, squash, 0.14);
    }
  });

  /**
   * @description 处理点击小兔触发的互动动作。
   * @returns {void}
   */
  function handlePetClick() {
    onPetTap();
  }

  return (
    <>
      <ambientLight intensity={1.45} />
      <directionalLight position={[1.5, 2.2, 2.1]} intensity={2} color="#ffffff" />
      <directionalLight position={[-1.2, 1.4, 1.4]} intensity={0.9} color={haloColor} />
      <pointLight position={[0, 0.9, 1.5]} intensity={0.7} color="#ffffff" />
      <PerspectiveCamera makeDefault position={[0, 0.08, 5.5]} fov={22} />
      <ScenePointerRig />

      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.92, 0]}>
        <circleGeometry args={[0.38, 24]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.16} />
      </mesh>

      <group ref={groupRef} position={[0, petBaseY, 0]} scale={0.4}>
        <Float speed={1.15} rotationIntensity={0.05} floatIntensity={0.08}>
          <group onClick={handlePetClick}>
            <BunnyModel bunnyColor={bunnyColor} earColor={earColor} moodKey={moodKey} hopStrength={isJumping || tapBoost ? 1.3 : 0.9} />
            <mesh position={[0, 0, 0.25]} visible={false}>
              <sphereGeometry args={[1.2, 16, 16]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
          </group>
        </Float>
      </group>
    </>
  );
}

/**
 * @description 渲染 Three.js 小兔桌宠。
 * @param {BaobaoFigureProps} props 组件参数。
 * @returns {JSX.Element}
 */
export function BaobaoFigure({ moodKey, isJumping = false, reminderText, phaseTitle, phaseKey }: BaobaoFigureProps) {
  const pose = getFigurePose(moodKey);
  const [speechText, setSpeechText] = useState(reminderText);
  const [tapBoost, setTapBoost] = useState(false);
  const dragStateRef = useRef({
    active: false,
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    setSpeechText(phaseTitle);
  }, [phaseKey, phaseTitle]);

  /**
   * @description 点击小兔后触发一次短时强化跳跃和提示。
   * @returns {void}
   */
  function handlePetTap() {
    setTapBoost(true);
    setSpeechText('兔兔收到');
    window.setTimeout(() => {
      setTapBoost(false);
      setSpeechText(phaseTitle);
    }, 900);
  }

  /**
   * @description 按下角色区域时记录窗口内偏移，用于后续拖动桌宠窗口。
   * @param {ReactPointerEvent<HTMLDivElement>} event 指针事件。
   * @returns {void}
   */
  function handleFigurePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!window.moodBuddy?.isDesktop || event.button !== 0) {
      return;
    }

    dragStateRef.current.active = true;
    dragStateRef.current.offsetX = event.clientX;
    dragStateRef.current.offsetY = event.clientY;
  }

  useEffect(() => {
    /**
     * @description 在拖拽激活时根据屏幕坐标实时移动窗口。
     * @param {PointerEvent} event 浏览器原生指针事件。
     * @returns {void}
     */
    function handlePointerMove(event: PointerEvent) {
      if (!dragStateRef.current.active || !window.moodBuddy?.isDesktop) {
        return;
      }

      window.moodBuddy.dragWindow(event.screenX, event.screenY, dragStateRef.current.offsetX, dragStateRef.current.offsetY);
    }

    /**
     * @description 结束拖拽状态，防止抬手后继续触发窗口移动。
     * @returns {void}
     */
    function handlePointerUp() {
      dragStateRef.current.active = false;
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('blur', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('blur', handlePointerUp);
    };
  }, []);

  return (
    <div className="app-no-drag relative mx-auto h-[240px] w-[240px] select-none" onPointerDown={handleFigurePointerDown}>
      <div className="absolute inset-x-0 bottom-0 top-8 overflow-visible rounded-[30px]">
        <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: true }} className="!h-full !w-full">
          <PetScene
            moodKey={moodKey}
            isJumping={isJumping}
            tapBoost={tapBoost}
            haloColor={pose.haloColor}
            sparkColor={pose.sparkColor}
            bodyRotation={pose.bodyRotation}
            bunnyColor={pose.bunnyColor}
            earColor={pose.earColor}
            onPetTap={handlePetTap}
          />
        </Canvas>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-0 z-30"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.08, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-[42px] h-[118px] w-[188px] -translate-x-1/2"
        >
          <motion.div
            key={`${phaseKey}-${speechText}`}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-1/2 top-0 max-w-[170px] -translate-x-1/2 rounded-[16px] border border-white/90 bg-white/92 px-3 py-1.5 text-center shadow-[0_12px_24px_rgba(15,23,42,0.12)] backdrop-blur-xl"
          >
            <p className="truncate text-[11px] font-black tracking-[0.08em] text-slate-500">{speechText}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 4, y: 4 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute right-0 top-[56px] rounded-full border border-white/85 px-2.5 py-1 text-[10px] font-black shadow-md ${pose.bubbleClass}`}
          >
            {pose.bubbleText}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
