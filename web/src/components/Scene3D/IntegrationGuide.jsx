import React, { useRef, useCallback } from 'react';
import { GameScene } from './Scene3D';
import Board3D from './Board3D';
import VFXManager from './VFXManager';

/**
 * IntegrationGuide
 * 
 * This file demonstrates how to integrate the 3D board into BoardLoop.
 * 
 * Steps to integrate:
 * 
 * 1. In BoardLoop.jsx, import the 3D components:
 *    import { GameScene } from './Scene3D';
 *    import Board3D from './Scene3D/Board3D';
 *    import VFXManager from './Scene3D/VFXManager';
 * 
 * 2. Add refs for 3D components:
 *    const board3DRef = useRef();
 *    const vfxRef = useRef();
 * 
 * 3. Wrap existing content in GameScene:
 *    return (
 *      <div className="game-container">
 *        <GameScene>
 *          <Board3D 
 *            ref={board3DRef}
 *            tiles={CITIES[currentCityId].tiles}
 *            playerPosition={boardPosition}
 *            playerTargetPosition={targetPosition}
 *            isMoving={isAutoRolling}
 *            themeColor={CITIES[currentCityId].themeColor}
 *            onTileClick={handleTileClick}
 *          />
 *          <VFXManager ref={vfxRef} />
 *        </GameScene>
 *        {/* Existing UI overlay (HUD) * /}
 *        <div className="ui-overlay" style={{ zIndex: 10 }}>
 *          {/* Buttons, stats, etc. * /}
 *        </div>
 *      </div>
 *    );
 * 
 * 4. Trigger VFX on events:
 *    - Win big: vfxRef.current.coinExplosion(x, y, z, { amount: 50 })
 *    - Level up: vfxRef.current.levelUp(x, y, z)
 *    - Jail: board3DRef.current.triggerCameraShake(0.5, 0.5)
 *    - Lottery: board3DRef.current.zoomToTile(15, 1.5)
 * 
 * 5. To get tile positions for VFX:
 *    const pos = board3DRef.current.getTilePosition(tileIndex);
 *    vfxRef.current.coinExplosion(pos[0], pos[1] + 2, pos[2]);
 * 
 * 6. CSS updates (add to game-container style):
 *    .game-container {
 *      position: relative;
 *      width: 100vw;
 *      height: 100vh;
 *    }
 *    .ui-overlay {
 *      position: fixed;
 *      top: 0;
 *      left: 0;
 *      width: 100%;
 *      height: 100%;
 *      pointer-events: none; /* Clicks pass through to 3D */
 *    }
 *    .ui-overlay > * {
 *      pointer-events: auto; /* Re-enable clicks on buttons */
 *    }
 */

// Example usage component
export function Board3DIntegration({
  tiles = [],
  playerPosition = 0,
  isMoving = false,
  themeColor = '#00f3ff',
  children // UI overlay content
}) {
  const boardRef = useRef();
  const vfxRef = useRef();

  // Example: trigger coin explosion at current tile
  const handlePayout = useCallback((tileIndex, amount) => {
    const pos = boardRef.current?.getTilePosition(tileIndex);
    if (pos) {
      // Coins above tile
      vfxRef.current?.coinExplosion(pos[0], pos[1] + 1.5, pos[2], {
        amount: Math.min(amount / 10, 100),
        power: 6,
        spread: 1.2
      });
    }
  }, []);

  // Example: trigger on event
  const handleSpecialEvent = useCallback((eventType, tileIndex) => {
    const pos = boardRef.current?.getTilePosition(tileIndex);
    if (!pos) return;

    switch (eventType) {
      case 'jail':
        boardRef.current?.triggerCameraShake(0.8, 0.6);
        break;
      case 'lottery':
        boardRef.current?.zoomToTile(tileIndex, 1.8);
        break;
      case 'levelup':
        vfxRef.current?.levelUp(pos[0], pos[1] + 2, pos[2]);
        boardRef.current?.triggerCameraShake(0.3, 0.4);
        break;
      case 'win':
        vfxRef.current?.celebration(pos[0], pos[1] + 1, pos[2]);
        break;
      default:
        break;
    }
  }, []);

  return (
    <>
      {/* 3D Scene - Behind UI */}
      <GameScene>
        <Board3D
          ref={boardRef}
          tiles={tiles}
          playerPosition={playerPosition}
          isMoving={isMoving}
          themeColor={themeColor}
        />
        <VFXManager ref={vfxRef} />
      </GameScene>
      
      {/* UI Overlay - Above 3D */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        <div style={{ pointerEvents: 'auto' }}>
          {children}
        </div>
      </div>
    </>
  );
}

export default Board3DIntegration;
